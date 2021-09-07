import React, { useEffect, useState, useRef } from 'react';
import {View, StyleSheet, Alert} from 'react-native';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {DriverAnimationView, DriverDetailsView} from './components';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTION_BY_ID, GET_RIDER} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { useIsFocused } from '@react-navigation/native';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodDriver = ({ route, navigation }) => {

  const appSalesOrderId = route.params ? route.params.id : ''
  const [seconds, setSeconds] = useState(300);
  const [transaction, setTransaction] = useState({});
  const [rider, setRider] = useState(
  //     {
  //   "id": "21",
  //   "riderName": "JERANIL LARONG",
  //   "riderConno": "+639163145136",
  //   "riderPlatenum": "1380-034"
  // }
    null
  );
  const checkOrderResponse5mins = useRef(null);
  const isFocus = useIsFocused();

  // data fetching for tsransaction
  const [getTransactionById, {error: transactionError, loading: transactionLoading }] = useLazyQuery(GET_ORDER_TRANSACTION_BY_ID, {
    variables: {
      input: {
        appSalesOrderId: appSalesOrderId
      }
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({ getTransactionById }) => {
      if(JSON.stringify(getTransactionById) != JSON.stringify(transaction)){
        setTransaction(getTransactionById)
      }
    }
  });

  // data fetching for transaction
  const [getRider, {error: riderError, loading: riderLoading }] = useLazyQuery(GET_RIDER, {
    variables: {
      input: {
        appSalesOrderId: appSalesOrderId
      }
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({ getRider }) => {
      if(rider && JSON.stringify(getRider) != JSON.stringify(getRider)){
        setRider(getRider)
      }
    }
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      clearInterval(checkOrderResponse5mins.current)
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if(isFocus){
      setSeconds(300)
    }
  }, [isFocus]);

  useEffect(() => {
    getTransactionById()
  }, [])

  useEffect(() => {
    if(Object.entries(transaction).length > 0){
      if (seconds > 0) {
        if(transaction.orderStatus != 'p'){
          getTransactionById()
          getRider()
        } else {
          getTransactionById()
        }
        checkOrderResponse5mins.current = setInterval(() => setSeconds(seconds - 5), 5000);
      } else {
        if(transaction.orderStatus == 'p'){
          alertPrompt('No Response', 'It takes some time to the merchant to confirm your order')
        } else {
          alertPrompt('No Driver found', 'It takes some time to the drivers to confirm your booking')
        }
      } 
    }
    return () => { clearInterval(checkOrderResponse5mins.current) }
  }, [seconds, transaction, rider]);

  const alertPrompt = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Retry", onPress: () => setSeconds(300) }
      ]
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#FFFF'}}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle title="Place Order" />
      </HeaderImageBackground>
      { ((transactionLoading && Object.entries(transaction).length == 0) || Object.entries(transaction).length == 0 || transactionError) ? (
          <LoadingIndicator isFlex isLoading={true} />
        ) : (
          <>
            <DriverAnimationView status={1} orderStatus={transaction.orderStatus} rider={rider} />
            <View style={styles.driverWrapper}>
              <DriverDetailsView
                status={1}
                rider={rider}
                transaction={transaction}
                appSalesOrderId={appSalesOrderId}
              />
            </View>
          </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  driverWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});

export default ToktokFoodDriver;
