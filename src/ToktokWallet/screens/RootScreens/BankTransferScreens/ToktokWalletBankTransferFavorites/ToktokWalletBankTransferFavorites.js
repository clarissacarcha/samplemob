/**
 * @format
 * @flow
 */

import React, {useEffect, useState, useMemo} from 'react';

import type {PropsType} from './types';
import {Container, SearchContainer, List} from './Styled';

import {View, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';

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
import {BankTransferAllFavorites} from 'toktokwallet/compositions';
import {AlertOverlay} from 'src/components';

//IMAGES
import {empty_search, empty_fave} from 'toktokbills/assets/images';

//HELPER & UTIL
import {moderateScale} from 'toktokbills/helper';
import {TransactionUtility} from 'toktokwallet/util';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BANK_ACCOUNTS_PAGINATE, GET_SEARCH_BANK_ACCOUNT_PAGINATE, PATCH_REMOVE_ACCOUNT} from 'toktokwallet/graphql';
import {usePrompt} from 'src/hooks';
import {useDebounce} from 'toktokwallet/hooks';

const ToktokWalletBankTransferFavorites = (props: PropsType): React$Node => {
  const prompt = usePrompt();
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'Favorites'} />,
  });

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [billFavorite, setBillFavorite] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});
  const [isMounted, setIsMounted] = useState(false);

  const [
    getBankAccountsPaginate,
    {loading: getFavoritesLoading, error: getFavoritesError, fetchMore: fetchMoreFavoriteBillsPaginate},
  ] = useLazyQuery(GET_BANK_ACCOUNTS_PAGINATE, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
    },
    onCompleted: data => {
      setRefreshing(false);
      setPageInfo(data.getBankAccountsPaginate.pageInfo);
      setFavorites(data.getBankAccountsPaginate.edges);
    },
  });

  const [getSearchBankAccountPaginate, {error: getSearchError, fetchMore: fetchMoreSearchBankAccountPaginate}] =
    useLazyQuery(GET_SEARCH_BANK_ACCOUNT_PAGINATE, {
      fetchPolicy: 'network-only',
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
        setSearchLoading(false);
      },
      onCompleted: data => {
        setFilteredData(data.getSearchBankAccountPaginate.edges);
        setPageInfo(data.getSearchBankAccountPaginate.pageInfo);
        setRefreshing(false);
        setSearchLoading(false);
      },
    });

  // PATCH REMOVE FAVORITE BILL
  const [patchRemoveAccount, {loading: patchRemoveAccountLoading}] = useMutation(PATCH_REMOVE_ACCOUNT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        isPop: false,
      });
    },
    onCompleted: () => {
      processFavorite();
      setFavoriteModal({show: true, message: 'Removed from your Favorites'});
    },
  });

  useEffect(() => {
    handleGetFavoriteBills();
    setIsMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetFavoriteBills = () => {
    getBankAccountsPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorName: null,
        },
      },
    });
  };

  useEffect(() => {
    if (!search) {
      handleGetFavoriteBills();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        fetchMoreSearchBankAccountPaginate({
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
            fetchMoreResult.getSearchBankAccountPaginate.edges = [
              ...previousResult.getSearchBankAccountPaginate.edges,
              ...fetchMoreResult.getSearchBankAccountPaginate.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getSearchBankAccountPaginate.pageInfo);
          setFilteredData(data.getSearchBankAccountPaginate.edges);
        });
      } else {
        fetchMoreFavoriteBillsPaginate({
          variables: {
            input: {
              afterCursorId: pageInfo.endCursorId,
              afterCursorName: pageInfo.endCursorName,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            fetchMoreResult.getBankAccountsPaginate.edges = [
              ...previousResult.getBankAccountsPaginate.edges,
              ...fetchMoreResult.getBankAccountsPaginate.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getBankAccountsPaginate.pageInfo);
          setFavorites(data.getBankAccountsPaginate.edges);
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
    getSearchBankAccountPaginate({
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
    patchRemoveAccount({
      variables: {
        input: {
          accountId: +item.node.id,
        },
      },
    });
  };

  const processFavorite = () => {
    const data = search !== '' ? filteredData : favorites;
    const newVar = [...data];

    newVar.splice(billFavorite.index, 1);
    search !== '' ? setFilteredData(newVar) : setFavorites(newVar);
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

  const DisplayContent = useMemo(() => {
    return (
      <List
        data={getData()}
        renderItem={({item, index}) => (
          <BankTransferAllFavorites
            item={item}
            index={index}
            onRefreshFavorite={onRefreshFavorite}
            onPressFavorite={() => onPressFavorite(item, index)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={getData().length === 0 ? {flexGrow: 1} : {}}
        extraData={[filteredData, favorites, pageInfo]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshFavorite} />}
        onEndReachedThreshold={0.02}
        onEndReached={() => fetchMoreData()}
        ListFooterComponent={ListFooterComponent}
        getItemLayout={(data, index) => ({
          length: getData().length,
          offset: getData().length * index,
          index,
        })}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites, filteredData, refreshing, search, pageInfo, onRefreshFavorite, fetchMoreData]);

  if (getFavoritesError || getSearchError) {
    return (
      <Container>
        <SomethingWentWrong onRefetch={handleGetFavoriteBills} error={getFavoritesError || getSearchError} />
      </Container>
    );
  }
  return (
    <Container>
      <AlertOverlay visible={patchRemoveAccountLoading} />
      <ToastModal visible={favoriteModal.show} setVisible={setFavoriteModal} title={favoriteModal.message} />
      <SearchContainer>
        {isMounted && favorites.length !== 0 && (
          <SearchInput
            search={search}
            onChangeText={onSearchChange}
            onClear={() => {
              setSearch('');
            }}
            placeholder="Search Favorites"
          />
        )}
      </SearchContainer>
      {(searchLoading && filteredData.length === 0) ||
      (getFavoritesLoading && favorites.length === 0 && !refreshing) ? (
        <LoadingIndicator isLoading={true} isFlex />
      ) : (
        DisplayContent
        // <FlatList
        //   data={getData()}
        //   renderItem={({item, index}) => (
        //     <FavoriteDetails
        //       item={item}
        //       index={index}
        //       onRefreshFavorite={onRefreshFavorite}
        //       onPressFavorite={() => onPressFavorite(item, index)}
        //     />
        //   )}
        //   contentContainerStyle={getData().length === 0 ? styles.listContainer : {}}
        //   style={{flex: 1}}
        //   keyExtractor={(item, index) => index.toString()}
        //   extraData={[filteredData, favorites, pageInfo]}
        //   ListEmptyComponent={ListEmptyComponent}
        //   refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshFavorite} />}
        //   onEndReachedThreshold={0.02}
        //   onEndReached={() => fetchMoreData()}
        //   ListFooterComponent={ListFooterComponent}
        //   getItemLayout={(data, index) => ({
        //     length: data.length,
        //     offset: data.length * index,
        //     index,
        //   })}
        // />
      )}
    </Container>
  );
};

export default ToktokWalletBankTransferFavorites;
