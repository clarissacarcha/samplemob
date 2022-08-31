/**
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';

import type {PropsType} from './types';
import {Container, ScrollContainer} from './Styled';
import {RefreshControl} from 'react-native';
//GRAPHQL
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_PAYMENT_CHART} from 'toktokwallet/graphql';
import {useNavigation} from '@react-navigation/native';
//COMPONENTS
import {
  HeaderBack,
  HeaderTitleRevamp,
  CheckIdleState,
  LoadingIndicator,
  SomethingWentWrong,
} from 'toktokwallet/components';
//COMPOSITIONS
import {CustomTable} from 'toktokwallet/compositions';

const ToktokWalletPaymentChart = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Payment Chart'} />,
  });

  const [paymentChart, setPaymentChart] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [getPaymentChartList, {error, loading}] = useLazyQuery(GET_PAYMENT_CHART, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
    },
    onCompleted: data => {
      setPaymentChart(data.getPaymentChartList);
      setRefreshing(false);
    },
  });

  useEffect(() => {
    getPaymentChartList();
  }, [getPaymentChartList]);

  const onRefresh = () => {
    setRefreshing(true);
    getPaymentChartList();
  };

  if (loading) {
    return (
      <Container>
        <LoadingIndicator isLoading={true} isFlex />
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <SomethingWentWrong error={error} onRefetch={onRefresh} />
      </Container>
    );
  }
  return (
    <CheckIdleState>
      <ScrollContainer
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <CustomTable data={paymentChart} />
      </ScrollContainer>
    </CheckIdleState>
  );
};

export default ToktokWalletPaymentChart;
