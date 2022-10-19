/**
 * @format
 * @flow
 */

import React, {useState, useMemo, useRef} from 'react';
import {useEffect} from 'react';

import type {PropsType} from './types';
import {Container, SearchContainer, List, LoadMoreContainer} from './Styled';
import {RefreshControl} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CheckIdleState,
  HeaderBack,
  HeaderTitleRevamp,
  SomethingWentWrong,
  SearchInput,
  LoadingIndicator,
  NoData,
} from 'toktokwallet/components';
import {BankTransferAllBanks} from 'toktokwallet/compositions';
import {useDebounce} from 'toktokwallet/hooks';

//GRAPHQL & HOOKS
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BANKS_PAGINATE, GET_SEARCH_BANKS_PAGINATE} from 'toktokwallet/graphql';

const ToktokWalletBankTransferBanks = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const route = useRoute();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Banks'} />,
  });

  const onEndReachedCalledDuringMomentum = useRef(null);
  const [banks, setBanks] = useState([]);
  const [search, setSearch] = useState('');
  const [isMounted, setIsMounted] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const onRefreshFavorite = route.params?.onRefreshFavorite ? route.params.onRefreshFavorite : null;

  const [
    getBanksPaginate,
    {loading: getBanksPaginateLoading, error: getBanksPaginateError, fetchMore: fetchMoreBanks},
  ] = useLazyQuery(GET_BANKS_PAGINATE, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      setRefreshing(false);
    },
    onCompleted: data => {
      setBanks(data.getBanksPaginate.edges);
      setPageInfo(data.getBanksPaginate.pageInfo);
      setRefreshing(false);
    },
  });

  const [getSearchBanksPaginate, {error: getSearchBanksPaginateError, fetchMore: fetchMoreSearchBanksPaginate}] =
    useLazyQuery(GET_SEARCH_BANKS_PAGINATE, {
      fetchPolicy: 'network-only',
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onError: error => {
        setRefreshing(false);
        setSearchLoading(false);
      },
      onCompleted: data => {
        setPageInfo(data.getSearchBanksPaginate.pageInfo);
        setFilteredData(data.getSearchBanksPaginate.edges);
        setRefreshing(false);
        setSearchLoading(false);
      },
    });

  useEffect(() => {
    handleGetBanks();
    setIsMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!search) {
      handleGetBanks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onRefresh = () => {
    setRefreshing(true);
    search ? processSearch(search) : handleGetBanks();
  };

  const handleGetBanks = () => {
    getBanksPaginate({
      variables: {
        input: {
          afterCursorId: null,
          afterCursorName: null,
        },
      },
    });
  };

  const ListEmptyComponent = () => {
    const type = search !== '' ? 'search' : 'data';
    const emptyText = search !== '' ? 'Try to search something similar.' : '';
    const emptyLabel = search ? 'No Results Found' : 'No OTC Partners';
    if (searchLoading || getBanksPaginateLoading) {
      return null;
    }
    return <NoData type={type} title={emptyLabel} label={emptyText} />;
  };

  const onSearchChange = value => {
    setFilteredData([]);
    setSearchLoading(value.length > 0);
    setSearch(value);
    debounceProcessSearch(value);
  };

  const debounceProcessSearch = useDebounce(value => processSearch(value), 1000);

  const processSearch = value => {
    getSearchBanksPaginate({
      variables: {
        input: {
          search: value,
          afterCursorId: null,
          afterCursorName: null,
        },
      },
    });
  };

  const fetchMoreData = () => {
    if (pageInfo.hasNextPage) {
      if (search) {
        fetchMoreSearchBanksPaginate({
          variables: {
            input: {
              search,
              afterCursorId: pageInfo.endCursorId,
              afterCursorName: pageInfo.endCursorName,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult || (fetchMoreResult && fetchMoreResult.getSearchBanksPaginate.edges.length > 10)) {
              return previousResult;
            }
            fetchMoreResult.getSearchBanksPaginate.edges = [
              ...previousResult.getSearchBanksPaginate.edges,
              ...fetchMoreResult.getSearchBanksPaginate.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getSearchBanksPaginate.pageInfo);
          setFilteredData(data.getSearchBanksPaginate.edges);
        });
      } else {
        fetchMoreBanks({
          variables: {
            input: {
              afterCursorId: pageInfo.endCursorId,
              afterCursorName: pageInfo.endCursorName,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult || (fetchMoreResult && fetchMoreResult.getBanksPaginate.edges.length > 10)) {
              return previousResult;
            }
            fetchMoreResult.getBanksPaginate.edges = [
              ...previousResult.getBanksPaginate.edges,
              ...fetchMoreResult.getBanksPaginate.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getBanksPaginate.pageInfo);
          setBanks(data.getBanksPaginate.edges);
        });
      }
    }
  };

  const getData = () => {
    if (search) {
      return filteredData.length > 0 ? filteredData : [];
    }
    return banks;
  };

  const ListFooterComponent = () => {
    return (
      <LoadMoreContainer>
        <LoadingIndicator isLoading={pageInfo.hasNextPage} size="small" />
      </LoadMoreContainer>
    );
  };

  const DisplayContent = useMemo(() => {
    return (
      <List
        data={search === '' ? banks : filteredData}
        renderItem={({item, index}) => <BankTransferAllBanks item={item.node} onRefreshFavorite={onRefreshFavorite} />}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={filteredData.length === 0 && {flexGrow: 1}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        extraData={[filteredData, search, banks]}
        onEndReachedThreshold={0.03}
        ListFooterComponent={ListFooterComponent}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current || search === '') {
            fetchMoreData();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
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
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banks, filteredData, refreshing, search, pageInfo, onRefresh, fetchMoreData, ListFooterComponent]);

  if (getBanksPaginateError || getSearchBanksPaginateError) {
    return (
      <Container>
        <SomethingWentWrong onRefetch={handleGetBanks} error={getBanksPaginateError ?? getSearchBanksPaginateError} />
      </Container>
    );
  }
  return (
    <CheckIdleState>
      <Container>
        <SearchContainer>
          {isMounted && banks.length !== 0 && (
            <SearchInput
              search={search}
              onChangeText={onSearchChange}
              onClear={() => {
                setSearch('');
              }}
              placeholder="Search Bank"
            />
          )}
        </SearchContainer>
        {(searchLoading && filteredData.length === 0) ||
        (getBanksPaginateLoading && banks.length === 0 && !refreshing) ? (
          <LoadingIndicator isLoading={true} isFlex />
        ) : (
          DisplayContent
        )}
      </Container>
    </CheckIdleState>
  );
};

export default ToktokWalletBankTransferBanks;
