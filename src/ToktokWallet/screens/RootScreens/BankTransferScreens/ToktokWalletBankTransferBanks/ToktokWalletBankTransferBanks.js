/**
 * @format
 * @flow
 */

import React, {useState, useMemo} from 'react';
import {useEffect} from 'react';

import type {PropsType} from './types';
import {Container, SearchContainer, List, LoadMoreContainer} from './Styled';
import {RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
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
import {GET_CASH_OUT_PROVIDER_PARTNERS, GET_CASH_OUT_SEARCH_PROVIDER_PARTNERS} from 'toktokwallet/graphql';

const ToktokWalletBankTransferBanks = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Banks'} />,
  });

  const [cashOutProviderPartners, setCashOutProviderPartners] = useState([]);
  const [search, setSearch] = useState('');
  const [isMounted, setIsMounted] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [
    getCashOutProviderPartners,
    {loading: getCashOutProviderPartnersLoading, error: getCashOutProviderPartnersError},
  ] = useLazyQuery(GET_CASH_OUT_PROVIDER_PARTNERS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      setRefreshing(false);
      console.log(error);
    },
    onCompleted: data => {
      setCashOutProviderPartners(data.getCashOutProviderPartners);
      setRefreshing(false);
    },
  });

  const [
    getCashOutSearchProviderPartners,
    {error: getCashOutSearchProviderPartnersError, fetchMore: fetchMoreCashOutSearchProviderPartners},
  ] = useLazyQuery(GET_CASH_OUT_SEARCH_PROVIDER_PARTNERS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      console.log(error);
      setRefreshing(false);
      setSearchLoading(false);
    },
    onCompleted: data => {
      setPageInfo(data.getCashOutSearchProviderPartners.pageInfo);
      setFilteredData(data.getCashOutSearchProviderPartners.edges);
      setRefreshing(false);
      setSearchLoading(false);
    },
  });

  useEffect(() => {
    getCashOutProviderPartners();
    setIsMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefreshFavorite = () => {
    setRefreshing(true);
    search ? processSearch(search) : getCashOutProviderPartners();
  };

  const ListEmptyComponent = () => {
    const type = search !== '' ? 'search' : 'data';
    const emptyText = search !== '' ? 'Try to search something similar.' : '';
    const emptyLabel = search ? 'No Results Found' : 'No OTC Partners';
    if (searchLoading || getCashOutProviderPartnersLoading) {
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
    getCashOutSearchProviderPartners({
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
        fetchMoreCashOutSearchProviderPartners({
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
            fetchMoreResult.getCashOutSearchProviderPartners.edges = [
              ...previousResult.getCashOutSearchProviderPartners.edges,
              ...fetchMoreResult.getCashOutSearchProviderPartners.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getCashOutSearchProviderPartners.pageInfo);
          setFilteredData(data.getCashOutSearchProviderPartners.edges);
        });
      }
    }
  };

  const ListFooterComponent = () => {
    return (
      <LoadMoreContainer>
        <LoadingIndicator isLoading={pageInfo.hasNextPage} size="small" />
      </LoadMoreContainer>
    );
  };

  const DisplayContent = useMemo(() => {
    if (search === '') {
      return (
        <List
          data={cashOutProviderPartners}
          renderItem={({item, index}) => <BankTransferAllBanks item={item} title={Object.keys(item)[index]} />}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshFavorite} />}
          extraData={cashOutProviderPartners}
        />
      );
    } else {
      return (
        <List
          data={filteredData}
          renderItem={({item, index}) => <BankTransferAllBanks item={item.node} isSearch />}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={filteredData.length === 0 && {flexGrow: 1}}
          keyExtractor={(item, index) => index.toString()}
          extraData={[filteredData, cashOutProviderPartners, pageInfo]}
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
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashOutProviderPartners, filteredData, refreshing, search]);

  if (getCashOutProviderPartnersError || getCashOutSearchProviderPartnersError) {
    return (
      <Container>
        <SomethingWentWrong
          onRefetch={getCashOutProviderPartners}
          error={getCashOutProviderPartnersError ?? getCashOutSearchProviderPartnersError}
        />
      </Container>
    );
  }
  return (
    <Container>
      <SearchContainer>
        {isMounted && cashOutProviderPartners.length !== 0 && (
          <SearchInput
            search={search}
            onChangeText={onSearchChange}
            onClear={() => {
              setSearch('');
            }}
            placeholder="Search OTC Partner"
          />
        )}
      </SearchContainer>
      {(searchLoading && filteredData.length === 0) ||
      (getCashOutProviderPartnersLoading && cashOutProviderPartners.length === 0 && !refreshing) ? (
        <LoadingIndicator isLoading={true} isFlex />
      ) : (
        DisplayContent
      )}
    </Container>
  );
};

export default ToktokWalletBankTransferBanks;
