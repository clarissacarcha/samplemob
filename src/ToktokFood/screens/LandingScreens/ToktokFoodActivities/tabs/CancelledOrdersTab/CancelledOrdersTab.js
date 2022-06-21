/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {RefreshControl} from 'react-native';
import type {PropsType} from './types';
import {Container, LoaderContainer} from './Styled';
import {useGetActivities} from 'toktokfood/hooks';
import {OrderList, OrderCard} from 'toktokfood/compositions/Activities';
import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components';
import {useIsFocused, useRoute} from '@react-navigation/native';

const CancelledOrdersTab = (props: PropsType): React$Node => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const {customerInfo} = useSelector(s => s.toktokFood);
  const theme = useTheme();
  const [tempState, setTempState] = useState([]);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [pendingProcess, setPendingProcess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [reloading, setReloading] = useState(false);
  const orderStatus = 'c';
  const {data, refetch, loading, fetchMore} = useGetActivities(orderStatus);

  useEffect(() => {
    if (page !== 0 && data?.getTransactions.length > 0) {
      fetchMore({
        variables: {
          input: {
            userId: `${customerInfo.userId}`,
            orderStatus: orderStatus,
            page: page,
            limit: 10,
          },
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return {getTransactions: [...previousResult.getTransactions, ...fetchMoreResult.getTransactions]};
        },
      });
    }
  }, [page]);

  useEffect(() => {
    if (data) {
      if (JSON.stringify(data) !== JSON.stringify(tempState)) {
        setTempState(data);
        setPendingProcess(true);
      } else {
        setPendingProcess(false);
      }
      setTimeout(() => {
        setLoadMore(false);
      }, 3000);
    }
  }, [data, page]);

  useEffect(() => {
    if (isFocused && route.params?.orderStatus && refetch) {
      setReloading(true);
      onRefresh();
    }
  }, [isFocused, refetch]);

  const processTransactions = () => {
    setTempState([]);
    setPage(0);
    refetch({
      variables: {
        input: {
          userId: `${customerInfo.userId}`,
          orderStatus,
          page: 0,
          limit: 10,
        },
      },
    });
    setReloading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    processTransactions();
  };

  const handleLoadMore = () => {
    if (!loadMore && pendingProcess) {
      setPage(prev => prev + 1);
      setLoadMore(true);
    }
  };

  const renderLoaderComponent = (isFooter = false) => (
    <LoaderContainer isFooter={isFooter}>
      <OrderCard />
    </LoaderContainer>
  );

  if ((loading && tempState.length === 0) || reloading) {
    return (
      <Container>
        {renderLoaderComponent()}
        {renderLoaderComponent()}
      </Container>
    );
  }

  return (
    <Container>
      <OrderList
        data={data ? data?.getTransactions : []}
        extraData={{loadMore, data}}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={() => handleLoadMore()}
        ListFooterComponent={loadMore && renderLoaderComponent(true)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.color.orange} />}
      />
    </Container>
  );
};

export default CancelledOrdersTab;
