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
import {GET_ORDER_TRANSACTION_BY_ID, GET_RIDER, GET_RIDER_DETAILS} from 'toktokfood/graphql/toktokfood';
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
  const orderStatus = route.params ? route.params.orderStatus : ''

  const [iShowSuccess, setShowSuccess] = useState(false);

  const [seconds, setSeconds] = useState(300);
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
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
    getTransactionById()
  }, [])

  useEffect(() => {
    if(Object.entries(transaction).length > 0 && orderStatus == undefined && riderDetails == null){
      if (seconds > 0) {
        if(transaction.orderStatus != 'p' && transaction.orderIsfor == 1){
          getTransactionById()
          if(transaction.tDeliveryId){ getRiderDetails() }
        } else {
          getTransactionById()
        }
        checkOrderResponse5mins.current = setTimeout(() => setSeconds(seconds - 5), 5000);
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
  }, [seconds, transaction, riderDetails]);

  useEffect(() => {
    setShowSuccess(riderDetails != null);
  }, [riderDetails]);

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
        onCloseModal={() => setShowSuccess(false)}
        btnTitle="Ok"
        imgSrc={riderDetails?.user.person.avatar}
        rating={0}
        readOnly
      >
        <Text style={styles.messageTitle}>{`${riderDetails?.user.person.firstName} ${riderDetails?.user.person.lastName}`}</Text>
        <Text style={styles.messageContent}>{riderDetails?.user.person.mobileNumber}</Text>
        <Text style={styles.messageContent}>{
          `${riderDetails?.vehicle.brand.brand} ${riderDetails?.vehicle.model.model} - ${riderDetails?.vehicle.plateNumber}`
        }</Text>
      </RatingModal>
      {((transactionLoading && Object.entries(transaction).length == 0) || Object.entries(transaction).length == 0 || transactionError) ? (
          <LoadingIndicator isFlex isLoading={true} />
      ) : (
        <ScrollView bounces={false} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <OrderTitle transaction={transaction} riderDetails={riderDetails} />
          <Separator />
          <OrderAddress transaction={transaction} riderDetails={riderDetails} />
          <Separator />
          { transaction.deliveryNotes &&
            <>
              <OrderNote title="Note" label={transaction.deliveryNotes} />
              <Separator />
            </>
          }
          { riderDetails != null && (
            <>
              <OrderRider riderDetails={riderDetails} />
              <Separator />
            </>
          )}
          <OrderList orderDetails={transaction.orderDetails} />
          <Separator />
          <OrderFee data={transaction} />
          <Separator />
          <OrderNote
            title="Payment Method"
            label={transaction.paymentMethod == "COD" ? "Cash On Delivery" : transaction.paymentMethod }
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
