import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, View, Alert, Text} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import Separator from 'toktokfood/components/Separator';
import {OrderAddress, OrderFee, OrderList, OrderLogs, OrderNote, OrderRider, OrderTitle} from './components';

import {useSelector} from 'react-redux';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT, CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTION_BY_REF_NUM, GET_RIDER, GET_RIDER_DETAILS} from 'toktokfood/graphql/toktokfood';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {rider1} from 'toktokfood/assets/images';
import {removeRiderDetails} from 'toktokfood/helper/ShowRiderDetails';

// Utils
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodOrderDetails = ({route, navigation}) => {
  const {price} = useSelector((state) => state.toktokFood.totalAmount);
  const referenceNum = route.params ? route.params.referenceNum : '';
  const orderStatus = route.params ? route.params.orderStatus : '';

  const [seconds, setSeconds] = useState(300);
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
  const checkOrderResponse5mins = useRef(null);

  const [getTransactionByRefNum, {error: transactionError, loading: transactionLoading}] = useLazyQuery(
    GET_ORDER_TRANSACTION_BY_REF_NUM,
    {
      variables: {
        input: {
          referenceNum: referenceNum,
        },
      },
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onCompleted: ({getTransactionByRefNum}) => {
        if (JSON.stringify(getTransactionByRefNum) != JSON.stringify(transaction)) {
          setTransaction(getTransactionByRefNum);
        }
      },
    },
  );

  // data fetching for rider details
  const [getRiderDetails, {error: riderDetailsError, loading: riderDetailsLoading}] = useLazyQuery(GET_RIDER_DETAILS, {
    variables: {
      input: {
        deliveryId: transaction?.tDeliveryId,
      },
    },
    client: CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getDeliveryDriver}) => {
      console.log(getDeliveryDriver.driver.user.person, 'sadasd');
      setRiderDetails(getDeliveryDriver.driver);
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      clearInterval(checkOrderResponse5mins.current);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getTransactionByRefNum();
  }, []);

  useEffect(() => {
    handleOrderProcess();
    return () => {
      clearInterval(checkOrderResponse5mins.current);
    };
  }, [seconds, transaction, riderDetails]);

  const handleOrderProcess = async () => {
    if (transaction && Object.entries(transaction).length > 0) {
      if (transaction.orderStatus == 's') {
        await removeRiderDetails(referenceNum);
        return alertPrompt('Order Completed', 'Thank you for choosing, toktokfood!', 'Okay');
      }
      if (transaction.isdeclined != 1) {
        if (seconds > 0) {
          if (transaction.orderStatus != 'p' && transaction?.orderIsfor == 1) {
            getTransactionByRefNum();
            if (transaction.tDeliveryId) {
              getRiderDetails();
            }
          } else {
            getTransactionByRefNum();
          }
          checkOrderResponse5mins.current = setTimeout(() => setSeconds(seconds - 5), 5000);
        } else {
          if (riderDetails == null) {
            clearTimeout(checkOrderResponse5mins.current);
            if (transaction.orderStatus == 'p') {
              alertPrompt('No Response', 'It takes some time for the merchant to confirm your order', 'Retry');
            } else {
              if (transaction.orderIsfor == 1) {
                alertPrompt('No Driver found', 'It takes some time for the drivers to confirm your booking', 'Retry');
              }
            }
          } else {
            setSeconds(300);
          }
        }
      } else {
        alertPrompt('Order Declined', 'Your order has been declined by merchant', 'Okay');
      }
    }
  };

  const alertPrompt = (title, message, status) => {
    Alert.alert(title, message, [
      {
        text: status,
        onPress: () => (status == 'retry' ? setSeconds(300) : navigation.navigate('ToktokFoodOrderTransactions')),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle title="Order Details" />
      </HeaderImageBackground>
      {(transactionLoading && Object.entries(transaction).length == 0) ||
      Object.entries(transaction).length == 0 ||
      transactionError ? (
        <LoadingIndicator isFlex isLoading={true} />
      ) : (
        <ScrollView bounces={false} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <OrderTitle transaction={transaction} riderDetails={riderDetails} />
          <Separator />
          <OrderAddress transaction={transaction} riderDetails={riderDetails} />
          <Separator />
          {transaction.deliveryNotes && (
            <>
              <OrderNote title="Note" label={transaction.deliveryNotes} />
              <Separator />
            </>
          )}
          {riderDetails != null && (
            <>
              <OrderRider riderDetails={riderDetails} transaction={transaction} />
              <Separator />
            </>
          )}
          <OrderList orderDetails={transaction.orderDetails} />
          <Separator />
          <OrderFee data={transaction} />
          <Separator />
          <OrderNote
            title="Payment Method"
            label={transaction.paymentMethod == 'COD' ? 'Cash On Delivery' : transaction.paymentMethod}
          />
          <Separator />
          <OrderLogs transaction={transaction} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFF'},
  scrollView: {paddingBottom: 10},
});

export default ToktokFoodOrderDetails;
