import React, { useEffect, useState, useRef } from 'react';
import {View, StyleSheet, Alert} from 'react-native';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {DriverAnimationView, DriverDetailsView, PickUpDetailsView} from './components';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import { getDistance, convertDistance } from 'geolib';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT, AUTH_CLIENT, CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTION_BY_ID, GET_RIDER, GET_RIDER_DETAILS} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { useIsFocused } from '@react-navigation/native';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodDriver = ({ route, navigation }) => {

  const appSalesOrderId = route.params ? route.params.id : ''
  const [seconds, setSeconds] = useState(0);
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
  const checkOrderResponse5mins = useRef(null);
  const isFocus = useIsFocused();
  const {location} = useSelector((state) => state.toktokFood);

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

   // data fetching for rider details
   const [getRiderDetails, {error: riderDetailsError, loading: riderDetailsLoading }] = useLazyQuery(GET_RIDER_DETAILS, {
    variables: {
      input: {
        deliveryId: transaction?.tDeliveryId
      }
    },
    client: CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({ getDeliveryDriver }) => {
      console.log(getDeliveryDriver.driver.user.person, 'sadasd')
      setRiderDetails(getDeliveryDriver.driver)
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
        if(transaction.orderStatus != 'p' && transaction?.orderIsfor == 1){
          getTransactionById()
          if(transaction.tDeliveryId){ getRiderDetails() }
        } else {
          getTransactionById()
        }
        checkOrderResponse5mins.current = setInterval(() => setSeconds(seconds - 5), 5000);
      } else {
        if(riderDetails == null){
          clearTimeout(checkOrderResponse5mins.current)
          if(transaction.orderStatus == 'p'){
            alertPrompt('No Response', 'It takes some time for the merchant to confirm your order')
          } else {
            alertPrompt('No Driver found', 'It takes some time for the drivers to confirm your booking')
          }
        } else {
          setSeconds(300)
        }
      } 
    }
    return () => { clearInterval(checkOrderResponse5mins.current) }
  }, [seconds, transaction, riderDetails]);

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
            <DriverAnimationView
              orderStatus={transaction.orderStatus}
              riderDetails={riderDetails}
              orderIsfor={transaction.orderIsfor}
            />
            <View style={styles.driverWrapper}>
              { transaction.orderIsfor == 1 ? (
                <DriverDetailsView
                  riderDetails={riderDetails}
                  transaction={transaction}
                  appSalesOrderId={appSalesOrderId}
                />
              ) : (
                <PickUpDetailsView
                  riderDetails={riderDetails}
                  transaction={transaction}
                  appSalesOrderId={appSalesOrderId}
                />
              )}
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
