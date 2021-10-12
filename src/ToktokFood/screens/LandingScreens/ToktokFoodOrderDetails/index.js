import axios from 'axios';
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
import {removeRiderDetails} from 'toktokfood/helper/showRiderDetails';
import {useIsFocused} from '@react-navigation/native';
import DialogMessage from 'toktokfood/components/DialogMessage';
import BackgroundTimer from 'react-native-background-timer';

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

  const [seconds, setSeconds] = useState(0);
  const [riderSeconds, setRiderSeconds] = useState(0);
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
  const checkOrderResponse5mins = useRef(null);
  const getRiderDetailsInterval = useRef(null);
  const isFocus = useIsFocused();
  const [showDialogMessage, setShadowDialogMessage] = useState({
    title: '',
    message: '',
    show: false,
    type: ''
  });

  const [getTransactionByRefNum, {error: transactionError, loading: transactionLoading, refetch}] = useLazyQuery(
    GET_ORDER_TRANSACTION_BY_REF_NUM,
    {
      variables: { input: { referenceNum: referenceNum }},
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onCompleted: ({getTransactionByRefNum}) => {
        if(JSON.stringify(getTransactionByRefNum) != JSON.stringify(transaction)) {
          setTransaction(getTransactionByRefNum);
        }
      },
    },
  );

  const [getToktokFoodRiderDetails, {error: riderError, loading: riderLoading, refetch: riderRefetch}] = useLazyQuery(
    GET_RIDER_DETAILS,
    {
      client: CLIENT,
      fetchPolicy: 'network-only',
      onCompleted: ({getDeliveryDriver}) => {
        setRiderDetails(getDeliveryDriver.driver);
      },
    },
  );

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     clearInterval(checkOrderResponse5mins.current);
  //     clearInterval(getRiderDetailsInterval.current);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  useEffect(() => {
    getTransactionByRefNum();
  }, []);

  useEffect(() => {
    if (isFocus) {
      setSeconds(300);
    }
  }, [isFocus]);

  useEffect(() => {
    handleOrderProcess();
    return () => {
      BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
    };
  }, [seconds, transaction]);

  useEffect(() => {
    handleMapRider();
    return () => {
      BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
    };
  }, [riderSeconds]);

  const handleMapRider = () => {
    if (transaction.tDeliveryId && riderDetails != null) {
      getToktokFoodRiderDetails({
        variables: {
          input: {
            deliveryId: transaction.tDeliveryId ,
          },
        },
      });
    }
    getRiderDetailsInterval.current = BackgroundTimer.setInterval(() => setRiderSeconds(seconds - 20), 20000);
    console.log('Rider Details Updated ' + riderSeconds);
  };

  const handleOrderProcess = async() => {
    if(transaction && Object.entries(transaction).length > 0){
      if(orderStatus == undefined){
        if(transaction.orderStatus == 's'){
          let message = transaction.orderIsfor == 1 ? 'Your order has been delivered successfully.' : 'You have successfully picked up your order.'
          BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
          BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
          await removeRiderDetails(referenceNum)
          setShadowDialogMessage({
            title: 'Order Complete',
            message,
            show: true,
            type: 'success'
          });
          return;
        }
        if (transaction.isdeclined != 1) {
          if (seconds > 0) {
            if (transaction.orderStatus != 'p' && transaction.orderIsfor == 1) {
              refetch({variables: { input: { referenceNum: referenceNum }}});
              if (transaction.tDeliveryId != null && riderDetails == null) {
                getToktokFoodRiderDetails({
                  variables: {
                    input: {
                      deliveryId: transaction.tDeliveryId ,
                    },
                  },
                });
              }
            } else {
              refetch({variables: { input: { referenceNum: referenceNum }}});
            }
            checkOrderResponse5mins.current = BackgroundTimer.setInterval(() => setSeconds(seconds - 5), 5000);
          } else {
            if (riderDetails == null) {
              BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
              BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
              if (transaction.orderStatus == 'p') {
                setShadowDialogMessage({
                  title: 'No Response from Merchant',
                  message: `Merchant hasn't confirmed your order.\nPlease try again.`,
                  show: true,
                  type: 'warning'
                });
              } else {
                setSeconds(300);
                // if (transaction.orderIsfor == 1) {
                  // setShadowDialogMessage({
                  //   title: `Couldn't Find Driver`,
                  //   message: `We couldn't find you a driver as of this moment. Please try again.`,
                  //   show: true,
                  //   type: 'warning'
                  // });
                // }
              }
            } else {
              setSeconds(300);
            }
          }
        } else {
          setShadowDialogMessage({
            title: transaction.declinedNote ? 'Order Cancelled by Merchant' : 'OOPS!',
            message: transaction.declinedNote ? transaction.declinedNote : 'Your order has been declined.',
            show: true,
            type: 'warning'
          });
        }
      } else {
        if(transaction.tDeliveryId){
          getToktokFoodRiderDetails({
            variables: {
              input: {
                deliveryId: transaction.tDeliveryId ,
              },
            },
          });
        }
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

  const selectedTab = (title) => {
    switch(title){
      case 'Order Complete': 
        return 2
      case 'OOPS!':
      case 'Order Cancelled by Merchant':
        return 3
      default:
        return 1
    }
  }

  const onCloseModal = () => {
    let { title } = showDialogMessage
    setShadowDialogMessage(prev => ({ ...prev, show: false }))
    if(title == 'Order Complete' || title == 'OOPS!' || title == 'Order Cancelled by Merchant'){
      let tab = selectedTab(title)
      console.log(title, tab)
      navigation.navigate('ToktokFoodOrderTransactions', { tab })
    } else {
      setSeconds(300)
    }
  }
 
  return (
    <View style={styles.container}>
      <DialogMessage
        type={showDialogMessage.type}
        title={showDialogMessage.title}
        messages={showDialogMessage.message}
        visibility={showDialogMessage.show}
        onCloseModal={() => { onCloseModal() }}
      />
      <HeaderImageBackground searchBox={false}>
        <HeaderTitle />
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
          {transaction.notes != '' && (
            <>
              <OrderNote title="Note" label={transaction.notes} />
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
          <OrderFee data={transaction} forDelivery={transaction.orderIsfor == 1} />
          <Separator />
          <OrderNote
            title="Payment Method"
            label={transaction.paymentMethod == 'COD' ? 'Cash-On-Delivery' : transaction.paymentMethod}
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
