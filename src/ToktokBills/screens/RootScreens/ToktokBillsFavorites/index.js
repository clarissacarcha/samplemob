import React, {useEffect, useState, useCallback} from 'react';
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
import {useHeaderHeight} from '@react-navigation/stack';

//COMPONENTS
import {
  HeaderBack,
  HeaderTitle,
  Separator,
  SearchInput,
  LoadingIndicator,
  EmptyList,
  SomethingWentWrong,
  ToastModal,
} from 'toktokbills/components';
import {FavoriteDetails} from './Components';

//IMAGES
import {empty_search, empty_list, empty_fave} from 'toktokbills/assets/images';

//HELPER
import {moderateScale, getStatusbarHeight} from 'toktokbills/helper';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {
  GET_SEARCH_FAVORITE_BILLS,
  GET_FAVORITES_BILLS_ITEMS,
  PATCH_REMOVE_FAVORITE_BILL,
} from 'toktokbills/graphql/model';
import {usePrompt, useThrottle} from 'src/hooks';
import {useDebounce} from 'toktokwallet/hooks';

//FONTS & COLORS
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;
const {height} = Dimensions.get('screen');

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
  const [billFavorite, setBillFavorite] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});
  const [isMounted, setIsMounted] = useState(false);
  const headerHeight = useHeaderHeight();

  const [
    getFavoriteBillsPaginate,
    {loading: getFavoritesLoading, error: getFavoritesError, fetchMore: fetchMoreFavoriteBillsPaginate},
  ] = useLazyQuery(GET_FAVORITES_BILLS_ITEMS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
      setFavorites([]);
    },
    onCompleted: ({getFavoriteBillsPaginate}) => {
      setFavorites(getFavoriteBillsPaginate.edges);
      setPageInfo(getFavoriteBillsPaginate.pageInfo);
      setRefreshing(false);
    },
  });

  const [
    getSearchFavoriteBillsPaginate,
    {loading: getSearchBills, error: getSearchError, fetchMore: fetchMoreSearchFavoriteBillsPaginate},
  ] = useLazyQuery(GET_SEARCH_FAVORITE_BILLS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
      setSearchLoading(false);
    },
    onCompleted: ({getSearchFavoriteBillsPaginate}) => {
      setFilteredData(getSearchFavoriteBillsPaginate.edges);
      setPageInfo(getSearchFavoriteBillsPaginate.pageInfo);
      setRefreshing(false);
      setSearchLoading(false);
    },
  });

  // PATCH REMOVE FAVORITE BILL
  const [patchRemoveFavoriteBill, {loading: patchFavoriteLoading, error: patchFavoriteError}] = useMutation(
    PATCH_REMOVE_FAVORITE_BILL,
    {
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: error => {
        ErrorUtility.StandardErrorHandling({
          error,
          navigation,
          prompt,
        });
      },
      onCompleted: ({patchRemoveFavoriteBill}) => {
        if (search) {
          processFavorite();
        } else {
          handleGetFavoriteBills();
        }
        setRefreshing(true);
        setFavoriteModal({show: true, message: 'Removed from your Favorites'});
      },
    },
  );

  useEffect(() => {
    handleGetFavoriteBills();
    setIsMounted(true);
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
    console.log('sample');
    if (pageInfo.hasNextPage) {
      if (search) {
        fetchMoreSearchFavoriteBillsPaginate({
          variables: {
            input: {
              search,
              afterCursorId: pageInfo.endCursorId,
              afterCursorName: pageInfo.endCursorName,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            fetchMoreResult.getSearchFavoriteBillsPaginate.edges = [
              ...previousResult.getSearchFavoriteBillsPaginate.edges,
              ...fetchMoreResult.getSearchFavoriteBillsPaginate.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getSearchFavoriteBillsPaginate.pageInfo);
          setFilteredData(data.getSearchFavoriteBillsPaginate.edges);
        });
      } else {
        fetchMoreFavoriteBillsPaginate({
          variables: {
            input: {
              afterCursorId: pageInfo.endCursorId,
              afterCursorUpdatedAt: pageInfo.endCursorUpdatedAt,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            fetchMoreResult.getFavoriteBillsPaginate.edges = [
              ...previousResult.getFavoriteBillsPaginate.edges,
              ...fetchMoreResult.getFavoriteBillsPaginate.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getFavoriteBillsPaginate.pageInfo);
          setFavorites(data.getFavoriteBillsPaginate.edges);
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

  const onPressFavorite = (item, index) => {
    setBillFavorite({item, index});
    patchRemoveFavoriteBill({
      variables: {
        input: {
          id: item.node.id,
        },
      },
    });
  };

  const processFavorite = () => {
    filteredData.splice(billFavorite.index, 1);
    setFilteredData(filteredData);
    setRefreshing(false);
  };

  const ListFooterComponent = () => {
    return (
      <View style={{marginVertical: moderateScale(15)}}>
        <LoadingIndicator isLoading={pageInfo.hasNextPage} size="small" />
      </View>
    );
  };

  const ListEmptyComponent = () => {
    const emptyImage = search ? empty_search : empty_fave;
    const emptyText = search ? 'Try to search something similar' : 'Fill out your details and save it for easier transactions';
    const emptyLabel = search ? 'No Results Found' : "No Favorites";
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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <ToastModal visible={favoriteModal.show} setVisible={setFavoriteModal} title={favoriteModal.message} />
        {isMounted && favorites.length != 0 && (
          <SearchInput
            search={search}
            onChangeText={onSearchChange}
            onClear={() => {
              setSearch('');
            }}
            placeholder="Search Favorites"
          />
        )}
      </View>
      {(searchLoading && filteredData.length === 0) ||
      (getFavoritesLoading && favorites.length === 0 && !refreshing) ? (
        <LoadingIndicator isLoading={true} isFlex />
      ) : (
        <FlatList
          data={getData()}
          renderItem={({item, index}) => (
            <FavoriteDetails
              item={item}
              index={index}
              onRefreshFavorite={onRefreshFavorite}
              onPressFavorite={() => onPressFavorite(item, index)}
            />
          )}
          contentContainerStyle={getData().length === 0 ? styles.listContainer : {}}
          style={{flex: 1}}
          keyExtractor={(item, index) => index.toString()}
          extraData={[filteredData, favorites, pageInfo]}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshFavorite} />}
          onEndReachedThreshold={0.02}
          onEndReached={() => fetchMoreData()}
          ListFooterComponent={ListFooterComponent}
          getItemLayout={(data, index) => ({
            length: data.length,
            offset: data.length * index,
            index,
          })}
        />
      )}
    </View>
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
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(-50),
  },
});
