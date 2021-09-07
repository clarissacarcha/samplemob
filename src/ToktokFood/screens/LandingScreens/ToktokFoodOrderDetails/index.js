import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, View, Alert, Text} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import Separator from 'toktokfood/components/Separator';
import {OrderAddress, OrderFee, OrderList, OrderLogs, OrderNote, OrderRider, OrderTitle} from './components';

import {useSelector} from 'react-redux';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTION_BY_ID, GET_RIDER} from 'toktokfood/graphql/toktokfood';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {rider1} from 'toktokfood/assets/images';
import RatingModal from 'toktokfood/components/RatingModal';

// Utils
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodOrderDetails = ({ route, navigation }) => {

  const {price} = useSelector((state) => state.toktokFood.totalAmount);
  const appSalesOrderId = route.params ? route.params.appSalesOrderId : ''
  const [iShowSuccess, setShowSuccess] = useState(false);

  const [seconds, setSeconds] = useState(300);
  const [transaction, setTransaction] = useState({});
  const [rider, setRider] = useState(
  //        {
  //   "id": "21",
  //   "riderName": "JERANIL LARONG",
  //   "riderConno": "+639163145136",
  //   "riderPlatenum": "1380-034"
  // }
    null
  );
  const checkOrderResponse5mins = useRef(null);

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
        checkOrderResponse5mins.current = setTimeout(() => setSeconds(seconds - 5), 5000);
      } else {
        clearTimeout(checkOrderResponse5mins.current)
        if(transaction.orderStatus == 'p'){
          alertPrompt('No Response', 'It takes some time to the merchant to confirm your order')
        } else {
          alertPrompt('No Driver found', 'It takes some time to the drivers to confirm your booking')
        }
      } 
    }
  }, [seconds, transaction, rider]);

  useEffect(() => {
    setShowSuccess(rider != null);
  }, [rider]);

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
    <View style={styles.container}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle title="Order Details" />
      </HeaderImageBackground>
      <RatingModal
        title={"We've found you a driver!"}
        visibility={iShowSuccess}
        onCloseModal={() => {
          setShowSuccess(false)
          navigation.goBack()
        }}
        btnTitle="Ok"
        imgSrc={rider1}
        rating={0}
        readOnly
      >
        <Text style={styles.messageTitle}>{rider?.riderName}</Text>
        <Text style={styles.messageContent}>{rider?.riderConno}</Text>
        <Text style={styles.messageContent}>{rider?.riderPlatenum}</Text>
      </RatingModal>
      {((transactionLoading && Object.entries(transaction).length == 0) || Object.entries(transaction).length == 0 || transactionError) ? (
          <LoadingIndicator isFlex isLoading={true} />
      ) : (
        <ScrollView bounces={false} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <OrderTitle transaction={transaction} rider={rider} />
          <Separator />
          <OrderAddress  transaction={transaction} rider={rider} />
          <Separator />
          { transaction.deliveryNotes &&
            <>
              <OrderNote title="Note" label={transaction.deliveryNotes} />
              <Separator />
            </>
          }
          { rider != null && (
            <>
              <OrderRider rider={rider} />
              <Separator />
            </>
          )}
          <OrderList orderDetails={transaction.orderDetails} />
          <Separator />
          <OrderFee data={transaction} />
          <Separator />
          <OrderNote title="Payment Method" label="Cash-on Delivery" />
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
