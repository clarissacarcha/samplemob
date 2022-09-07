import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions, RefreshControl, ScrollView} from 'react-native';
//GRAPHQL
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_PAYMENT_CHART} from 'toktokwallet/graphql';
//COMPONENTS
import {
  HeaderBack,
  HeaderTitleRevamp,
  CheckIdleState,
  LoadingIndicator,
  SomethingWentWrong,
} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import {CustomTable} from './Components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const ToktokWalletPaymentChart = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Payment Chart'} />,
  });

  const [paymentChart, setPaymentChart] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [getPaymentChartList, {date, error, loading}] = useLazyQuery(GET_PAYMENT_CHART, {
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
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong error={error} />
      </View>
    );
  }
  return (
    // <CheckIdleState>
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <CustomTable
        data={paymentChart}
        headerData={['Partner', 'Payment Range', 'OTC Fee', 'Online Bank Fee', 'Payment through mobile']}
      />
    </ScrollView>
    // </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
});
