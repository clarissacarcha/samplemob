import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
  Image,
  TouchableHighlight,
  RefreshControl,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

//COMPONENTS
import {
  HeaderBack,
  HeaderTitle,
  Separator,
  SearchInput,
  LoadingIndicator,
  EmptyList,
  SomethingWentWrong,
} from 'toktokbills/components';
import {FavoriteDetails} from './Components';

//IMAGES
import {empty_search, empty_list, empty_fave} from 'toktokbills/assets/images';

//HELPER
import {moderateScale} from 'toktokbills/helper';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SEARCH_FAVORITE_BILLS, GET_FAVORITES_BILLS_ITEMS} from 'toktokbills/graphql/model';
import {usePrompt, useThrottle} from 'src/hooks';
import {useDebounce} from 'toktokwallet/hooks';

//FONTS & COLORS
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;

export const ToktokBillsFavorites = ({navigation, route}) => {
  const prompt = usePrompt();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'Favorites'} />,
  });

  const isFocused = useIsFocused();

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [getFavoriteBillsPaginate, {loading: getFavoritesLoading, error: getFavoritesError}] = useLazyQuery(
    GET_FAVORITES_BILLS_ITEMS,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
        setFavorites([]);
      },
      onCompleted: ({getFavoriteBillsPaginate}) => {
        let data = refreshing ? getFavoriteBillsPaginate.edges : [...favorites, ...getFavoriteBillsPaginate.edges];
        setFavorites(data);
        setPageInfo(getFavoriteBillsPaginate.pageInfo);
        setRefreshing(false);
      },
    },
  );

  const [getSearchFavoriteBillsPaginate, {loading: getSearchBills, error: getSearchError}] = useLazyQuery(
    GET_SEARCH_FAVORITE_BILLS,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
        setSearchLoading(false);
      },
      onCompleted: ({getSearchFavoriteBillsPaginate}) => {
        let data = refreshing
          ? getSearchFavoriteBillsPaginate.edges
          : [...filteredData, ...getSearchFavoriteBillsPaginate.edges];
        setFilteredData(data);
        setPageInfo(getSearchFavoriteBillsPaginate.pageInfo);
        setRefreshing(false);
        setSearchLoading(false);
      },
    },
  );

  useEffect(() => {
    setIsMounted(true);
    handleGetFavoriteBills();
  }, []);

  const handleGetFavoriteBills = () => {
    getFavoriteBillsPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorUpdatedAt: null,
        },
      },
    });
  };

  useEffect(() => {
    if (!search) {
      handleGetFavoriteBills();
      setFavorites([]);
    }
  }, [search]);

  const getData = () => {
    if (search) {
      return filteredData.length > 0 ? filteredData : [];
    }
    return favorites;
  };

  const onRefreshFavorite = () => {
    setRefreshing(true);
    search ? processSearch(search) : handleGetFavoriteBills();
  };

  const fetchMoreData = () => {
    if (pageInfo.hasNextPage) {
      if (search) {
        getSearchFavoriteBillsPaginate({
          variables: {
            input: {
              search,
              afterCursorId: pageInfo.endCursorId,
              afterCursorName: pageInfo.endCursorName,
            },
          },
        });
      } else {
        getFavoriteBillsPaginate({
          variables: {
            input: {
              afterCursorId: pageInfo.endCursorId,
              afterCursorUpdatedAt: pageInfo.endCursorUpdatedAt,
            },
          },
        });
      }
    }
  };

  const onSearchChange = value => {
    setFilteredData([]);
    setSearchLoading(value.length > 0);
    setSearch(value);
    debounceProcessSearch(value);
  };

  const debounceProcessSearch = useDebounce(value => processSearch(value), 1000);

  const processSearch = value => {
    getSearchFavoriteBillsPaginate({
      variables: {
        input: {
          search: value,
          afterCursorId: null,
          afterCursorName: null,
        },
      },
    });
  };

  const ListFooterComponent = () => {
    return (
      <View style={{marginTop: moderateScale(15)}}>
        <LoadingIndicator isLoading={pageInfo.hasNextPage} size="small" />
      </View>
    );
  };

  const ListEmptyComponent = () => {
    const emptyImage = search ? empty_search : empty_fave;
    const emptyText = search ? 'Try to search something similar' : 'Check our products and add them to your favorites!';
    const emptyLabel = search ? 'No Results Found' : "You don't have favorites yet";
    if (searchLoading || getFavoritesLoading) return null;
    return <EmptyList imageSrc={emptyImage} label={emptyLabel} message={emptyText} />;
  };

  if (getFavoritesError || getSearchError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefreshFavorite} error={getFavoritesError ?? getSearchError} />
      </View>
    );
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchInput
            search={search}
            onChangeText={onSearchChange}
            onClear={() => {
              setSearch('');
            }}
            placeholder="Search Favorites"
          />
        </View>
        {(searchLoading && filteredData.length === 0) ||
        (getFavoritesLoading && favorites.length === 0 && !refreshing) ? (
          <LoadingIndicator isLoading={true} isFlex />
        ) : (
          <FlatList
            data={getData()}
            renderItem={({item, index}) => (
              <FavoriteDetails item={item} index={index} onRefreshFavorite={onRefreshFavorite} />
            )}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item, index) => index.toString()}
            extraData={{filteredData, favorites}}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshFavorite} />}
            onEndReachedThreshold={0.2}
            onEndReached={fetchMoreData}
            ListFooterComponent={ListFooterComponent}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    marginTop: 5,
    padding: moderateScale(16),
  },
  listContainer: {
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(5),
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(-50),
  },
});
