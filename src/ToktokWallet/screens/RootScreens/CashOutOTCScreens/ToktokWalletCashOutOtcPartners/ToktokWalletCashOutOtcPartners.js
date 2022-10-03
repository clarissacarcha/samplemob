/**
 * @format
 * @flow
 */

import React, {useState, useMemo, useRef} from 'react';
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
  CheckIdleState,
} from 'toktokwallet/components';
import {CashOutOtcPartnerDetails} from 'toktokwallet/compositions';
import _ from 'lodash';
import {useDebounce} from 'toktokwallet/hooks';

//GRAPHQL & HOOKS
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CASH_OUT_PROVIDER_PARTNERS, GET_CASH_OUT_SEARCH_PROVIDER_PARTNERS} from 'toktokwallet/graphql';

const ToktokWalletCashOutOtcPartners = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'OTC Partners'} />,
  });

  const onEndReachedCalledDuringMomentum = useRef(null);
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
      const groupData = _(data.getCashOutProviderPartners)
        .sortBy(item => item.description)
        .groupBy(item => (item.category === 2 ? 'Bank Partners' : 'Non-bank Partners'))
        .value();

      setCashOutProviderPartners([
        {'Bank Partners': groupData['Bank Partners']},
        {'Non-bank Partners': groupData['Non-bank Partners']},
      ]);
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

  const onRefreshCashOut = () => {
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
          renderItem={({item, index}) => <CashOutOtcPartnerDetails item={item} title={Object.keys(item)[0]} />}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshCashOut} />}
          extraData={[filteredData, cashOutProviderPartners, pageInfo]}
        />
      );
    } else {
      return (
        <List
          data={filteredData}
          renderItem={({item, index}) => <CashOutOtcPartnerDetails item={item.node} isSearch />}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={filteredData.length === 0 && {flexGrow: 1}}
          keyExtractor={(item, index) => index.toString()}
          extraData={[filteredData, cashOutProviderPartners, pageInfo]}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshCashOut} />}
          onEndReachedThreshold={0.03}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current) {
              fetchMoreData();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          ListFooterComponent={ListFooterComponent}
          getItemLayout={
            filteredData.length <= 30
              ? (data, index) => ({
                  length: filteredData.length,
                  offset: filteredData.length * index,
                  index,
                })
              : undefined
          }
        />
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashOutProviderPartners, filteredData, refreshing, search, fetchMoreData, ListFooterComponent]);

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
    <CheckIdleState>
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
    </CheckIdleState>
  );
};

export default ToktokWalletCashOutOtcPartners;
