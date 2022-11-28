import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, FlatList, Dimensions, RefreshControl} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

//COMPONENTS
import {
  HeaderBack,
  HeaderTitle,
  SearchInput,
  LoadingIndicator,
  EmptyList,
  SomethingWentWrong,
  ToastModal,
} from 'toktokbills/components';
import {FavoriteDetails} from './Components';
import {AlertOverlay} from 'src/components';
//IMAGES
import {empty_search, empty_fave} from 'toktokbills/assets/images';
//HELPER
import {moderateScale} from 'toktokbills/helper';
//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';

import {GET_FAVORITES_PAGINATE, GET_SEARCH_FAVORITES, PATCH_REMOVE_FAVORITE} from 'toktokwallet/graphql';
import {usePrompt} from 'src/hooks';
import {useDebounce} from 'toktokwallet/hooks';
import {TransactionUtility} from 'toktokwallet/util';

export const ToktokWalletSendMoneyFavorites = ({navigation, route}) => {
  const prompt = usePrompt();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'Favorites'} />,
  });

  const onEndReachedCalledDuringMomentum = useRef(null);
  const onRefreshHomeFavorite = route.params?.onRefreshHomeFavorite ? route.params.onRefreshHomeFavorite : null;

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [billFavorite, setBillFavorite] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});
  const [isMounted, setIsMounted] = useState(false);
  const onSelectItem = route.params.onSelectItem;

  const [
    getFavoritesPaginate,
    {loading: getFavoritesLoading, error: getFavoritesError, fetchMore: fetchMoreFavoritePaginate},
  ] = useLazyQuery(GET_FAVORITES_PAGINATE, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
      setFavorites([]);
    },
    onCompleted: ({getFavoritesPaginate}) => {
      setFavorites(getFavoritesPaginate.edges);
      setPageInfo(getFavoritesPaginate.pageInfo);
      setRefreshing(false);
    },
  });

  const [getSearchFavorites, {loading: getSearchLoading, error: getSearchError, fetchMore: fetchMoreSearchFavorites}] =
    useLazyQuery(GET_SEARCH_FAVORITES, {
      fetchPolicy: 'network-only',
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
        setSearchLoading(false);
      },
      onCompleted: ({getSearchFavorites}) => {
        setFilteredData(getSearchFavorites.edges);
        setPageInfo(getSearchFavorites.pageInfo);
        setRefreshing(false);
        setSearchLoading(false);
      },
    });

  // PATCH REMOVE FAVORITE
  const [patchRemoveFavorite, {loading: patchFavoriteLoading}] = useMutation(PATCH_REMOVE_FAVORITE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        onPress: () => {},
      });
    },
    onCompleted: ({patchRemoveFavorite}) => {
      if (onRefreshHomeFavorite) {
        onRefreshHomeFavorite();
      }
      if (search) {
        processFavorite();
      } else {
        handleGetFavorite();
      }
      setRefreshing(true);
      setFavoriteModal({show: true, message: 'Removed from your Favorites'});
    },
  });

  useEffect(() => {
    handleGetFavorite();
    setIsMounted(true);
  }, []);

  const handleGetFavorite = () => {
    getFavoritesPaginate({
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
      handleGetFavorite();
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
    search ? processSearch(search) : handleGetFavorite();
  };

  const fetchMoreData = () => {
    if (pageInfo.hasNextPage) {
      if (search) {
        fetchMoreSearchFavorites({
          variables: {
            input: {
              search,
              afterCursorId: pageInfo.endCursorId,
              afterCursorUpdatedAt: pageInfo.endCursorUpdatedAt,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult || (fetchMoreResult && fetchMoreResult.getSearchFavorites.edges.length > 10)) {
              return previousResult;
            }
            fetchMoreResult.getSearchFavorites.edges = [
              ...previousResult.getSearchFavorites.edges,
              ...fetchMoreResult.getSearchFavorites.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getSearchFavorites.pageInfo);
          setFilteredData(data.getSearchFavorites.edges);
        });
      } else {
        fetchMoreFavoritePaginate({
          variables: {
            input: {
              afterCursorId: pageInfo.endCursorId,
              afterCursorUpdatedAt: pageInfo.endCursorUpdatedAt,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult || (fetchMoreResult && fetchMoreResult.getFavoritesPaginate.edges.length > 10)) {
              return previousResult;
            }
            fetchMoreResult.getFavoritesPaginate.edges = [
              ...previousResult.getFavoritesPaginate.edges,
              ...fetchMoreResult.getFavoritesPaginate.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getFavoritesPaginate.pageInfo);
          setFavorites(data.getFavoritesPaginate.edges);
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
    getSearchFavorites({
      variables: {
        input: {
          search: value,
          afterCursorId: null,
          afterCursorUpdatedAt: null,
        },
      },
    });
  };

  const onPressFavorite = (item, index) => {
    setBillFavorite({item, index});
    patchRemoveFavorite({
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
    const emptyText = search
      ? 'Try to search something similar'
      : 'Fill out your details and save it for easier transactions.';
    const emptyLabel = search ? 'No Results Found' : 'No Favorites';
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
      <AlertOverlay visible={patchFavoriteLoading} />
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
              onSelectItem={onSelectItem}
            />
          )}
          contentContainerStyle={getData().length === 0 ? styles.listContainer : {}}
          style={{flex: 1}}
          keyExtractor={(item, index) => index.toString()}
          extraData={[filteredData, favorites, pageInfo]}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshFavorite} />}
          onEndReachedThreshold={0.03}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current || search === '') {
              fetchMoreData();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          ListFooterComponent={ListFooterComponent}
          getItemLayout={
            getData().length <= 30
              ? (data, index) => ({
                  length: getData().length,
                  offset: getData().length * index,
                  index,
                })
              : undefined
          }
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
