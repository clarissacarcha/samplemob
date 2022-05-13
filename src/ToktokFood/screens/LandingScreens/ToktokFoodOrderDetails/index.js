/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {ScrollView, StyleSheet, View, Alert, Text, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';
import BackgroundTimer from 'react-native-background-timer';

import {info_ic} from 'toktokfood/assets/images';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import DialogMessage from 'toktokfood/components/DialogMessage';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import Separator from 'toktokfood/components/Separator';
import {
  OrderAddress,
  OrderFee,
  OrderList,
  OrderLogs,
  OrderNote,
  OrderRider,
  OrderTitle,
  OrderShippingVoucher,
} from './components';

// Queries
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTION_BY_REF_NUM, GET_RIDER_DETAILS} from 'toktokfood/graphql/toktokfood';

// Utils
import {removeEstimatedDeliveryTime} from 'toktokfood/helper/estimatedDeliveryTime';
import {useIsFocused} from '@react-navigation/native';

import moment from 'moment';

const ToktokFoodOrderDetails = ({route, navigation}) => {
  const {minutesRemaining, showError, duration} = useSelector(state => state.toktokFood.exhaust);
  const referenceNum = route.params ? route.params.referenceNum : '';
  const orderStatus = route.params ? route.params.orderStatus : '';

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [riderSeconds, setRiderSeconds] = useState(0);
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
  const checkOrderResponse5mins = useRef(null);
  const getRiderDetailsInterval = useRef(null);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [showDialogMessage, setShowDialogMessage] = useState({
    title: '',
    message: '',
    show: false,
    type: '',
  });

  const timerRef = useRef(null);
  const fetchingRef = useRef(null);

  const [getTransactionByRefNum, {error: transactionError, loading: transactionLoading, refetch}] = useLazyQuery(
    GET_ORDER_TRANSACTION_BY_REF_NUM,
    {
      variables: {
        input: {
          referenceNum: referenceNum,
        },
      },
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'cache-and-network',
      onError: () => {
        checkOrderResponse5mins.current = BackgroundTimer.setInterval(() => setSeconds(seconds - 5), 5000);
      },
      onCompleted: ({getTransactionByRefNum}) => {
        // console.log(getTransactionByRefNum);
        // if (JSON.stringify(getTransactionByRefNum) != JSON.stringify(transaction)) {
        setTransaction(getTransactionByRefNum);
        const {orderIsfor, tDeliveryId, orderStatus} = getTransactionByRefNum;
        console.log('fetching orders...', getTransactionByRefNum);
        if (orderIsfor === 1 && tDeliveryId) {
          getToktokFoodRiderDetails({
            variables: {
              input: {
                deliveryId: tDeliveryId,
              },
            },
          });
        }
        if (orderStatus !== 's' || orderStatus !== 'c') {
          handleGetTransactionByRefNum();
        }
      },
    },
  );

  const [getToktokFoodRiderDetails, {error: riderError, loading: riderLoading, refetch: riderRefetch}] = useLazyQuery(
    GET_RIDER_DETAILS,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'cache-and-network',
      onCompleted: ({getDeliveryDetails}) => {
        setRiderDetails(getDeliveryDetails);
      },
    },
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
      BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (isFocus) {
      getTransactionByRefNum({
        variables: {
          input: {
            referenceNum: referenceNum,
          },
        },
      });
    }
  }, [isFocus]);

  // useEffect(() => {
  //   if (isFocus) {
  //     setSeconds(300);
  //   }
  // }, [isFocus]);

  useEffect(() => {
    if (transaction?.orderStatus === 'p' && minutes === 0) {
      setMinutes(5);
    } else if (transaction?.orderStatus === 'po' || transaction?.orderStatus === 'rp') {
      const dateProcessed = moment(transaction?.dateOrderProcessed).add(45, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      const remainingMinutes = moment(dateProcessed).diff(moment(), 'minutes');
      console.log('remainingMinutes', remainingMinutes);
      const payload = {minutesRemaining: remainingMinutes, showError: remainingMinutes <= 0, duration: 0};
      dispatch({type: 'SET_TOKTOKFOOD_EXHAUST', payload});
      setMinutes(remainingMinutes);
    } else if (transaction?.orderStatus === 'f') {
      if (riderDetails && duration === 0) {
        const {duration: riderDuration} = riderDetails;
        const remainingMinutes = riderDuration + 5;
        console.log('remainingMinutes', remainingMinutes);
        const payload = {minutesRemaining: remainingMinutes, showError: false, duration: 1};
        dispatch({type: 'SET_TOKTOKFOOD_EXHAUST', payload});
        setMinutes(remainingMinutes);
      }
    }
  }, [transaction]);

  useEffect(() => {
    if (minutes > 0) {
      timerRef.current = setTimeout(() => {
        setMinutes(minutes - 1);
        const payload = {minutesRemaining: minutes - 1, showError: false};
        dispatch({type: 'SET_TOKTOKFOOD_EXHAUST', payload, duration});
      }, 60000);
    }

    if (minutes === 0 && transaction?.orderStatus === 'p') {
      setShowDialogMessage({
        title: 'No Response from Merchant',
        message: "Merchant hasn't confirmed your order.\nPlease try again.",
        show: true,
        type: 'warning',
      });
    }
    if (
      minutesRemaining <= 0 &&
      !showError &&
      (transaction?.orderStatus === 'po' || transaction?.orderStatus === 'rp')
    ) {
      setShowDialogMessage({
        title: 'Still Preparing Order',
        message: 'Sorry, your order seems to be taking too long to prepare. Thank you for patiently waiting.',
        show: true,
        type: 'warning',
      });
    }
    if (minutesRemaining <= 0 && !showError && transaction?.orderStatus === 'f') {
      const payload = {minutesRemaining: minutes, showError: true, duration};
      dispatch({type: 'SET_TOKTOKFOOD_EXHAUST', payload});
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [minutes]);

  useEffect(() => {
    handleOrderProcess();
    return () => {
      BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
    };
  }, [seconds, transaction]);

  // useEffect(() => {
  //   handleMapRider();
  //   return () => {
  //     BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
  //   };
  // }, [riderSeconds]);

  const handleGetTransactionByRefNum = () => {
    fetchingRef.current = setTimeout(() => {
      getTransactionByRefNum({
        variables: {
          input: {
            referenceNum: referenceNum,
          },
        },
      });
    }, 10000);
    return () => {
      if (fetchingRef.current) {
        clearTimeout(fetchingRef.current);
      }
    };
  };

  const handleMapRider = () => {
    if (transaction.tDeliveryId && riderDetails != null) {
      if (riderSeconds > 0) {
        riderRefetch({
          variables: {
            input: {
              deliveryId: transaction.tDeliveryId,
            },
          },
        });
        getRiderDetailsInterval.current = BackgroundTimer.setInterval(() => setRiderSeconds(riderSeconds - 20), 20000);
      } else {
        setRiderSeconds(300);
      }
    }
    // console.log('Rider Details Updated ' + riderSeconds);
  };

  const handleOrderProcess = async () => {
    if (transaction && Object.entries(transaction).length > 0) {
      if (orderStatus == undefined) {
        if (transaction.orderStatus == 's') {
          let message =
            transaction.orderIsfor == 1
              ? 'Your order has been delivered successfully.'
              : 'You have successfully picked up your order.';
          BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
          BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
          await removeEstimatedDeliveryTime(referenceNum);
          setShowDialogMessage({
            title: 'Order Complete',
            message,
            show: true,
            type: 'success',
          });
          return;
        }
        if (transaction.isdeclined != 1) {
          if (seconds > 0) {
            if (transaction.orderStatus != 'p' && transaction.orderIsfor == 1) {
              handleGetTransactionByRefNum();
              if (transaction.tDeliveryId != null && riderDetails == null) {
                getToktokFoodRiderDetails({
                  variables: {
                    input: {
                      deliveryId: transaction.tDeliveryId,
                    },
                  },
                });
              } else {
                if (riderSeconds == 0) {
                  setRiderSeconds(300);
                }
              }
            } else {
              handleGetTransactionByRefNum();
            }
            checkOrderResponse5mins.current = BackgroundTimer.setInterval(() => setSeconds(seconds - 5), 5000);
          } else {
            if (riderDetails == null) {
              // BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
              // BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
              // if (transaction.orderStatus === 'p' && !showDialogMessage.show) {
              //   setShowDialogMessage({
              //     title: 'No Response from Merchant',
              //     message: "Merchant hasn't confirmed your order.\nPlease try again.",
              //     show: true,
              //     type: 'warning',
              //   });
              // } else {
              //   setSeconds(300);
              // }
            } else {
              setSeconds(300);
            }
          }
        } else {
          BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
          BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
          let isValidDate = moment(transaction.dateOrderProcessed).isValid();
          let declineNote = `Sorry, your order has been declined and cannot be processed by ${transaction.shopDetails.shopname} due to the following reason/s:`;
          let cancelNote = `Your order has been cancelled and cannot be processed by ${transaction.shopDetails.shopname} due to the following reason/s:`;
          setShowDialogMessage({
            title: isValidDate ? 'Order Cancelled' : 'OOPS! Order Declined!',
            message: isValidDate ? cancelNote : declineNote,
            reasons: transaction.declinedNote,
            show: true,
            type: 'warning',
          });
          await removeEstimatedDeliveryTime(referenceNum);
        }
      } else {
        if (transaction.tDeliveryId) {
          getToktokFoodRiderDetails({
            variables: {
              input: {
                deliveryId: transaction.tDeliveryId,
              },
            },
          });
        }
      }
    } else {
      checkOrderResponse5mins.current = BackgroundTimer.setInterval(() => setSeconds(seconds - 5), 5000);
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

  const selectedTab = title => {
    switch (title) {
      case 'Order Complete':
        return 2;
      case 'OOPS! Order Declined!':
        return 3;
      case 'Order Cancelled':
        return 3;
      default:
        return 1;
    }
  };

  const onCloseModal = () => {
    let {title} = showDialogMessage;
    setShowDialogMessage(prev => ({...prev, show: false}));
    if (title === 'No Response from Merchant') {
      setSeconds(300);
      setMinutes(5);
    } else if (title === 'Still Preparing Order') {
      const payload = {minutesRemaining: minutes, showError: true, duration: 0};
      dispatch({type: 'SET_TOKTOKFOOD_EXHAUST', payload});
    } else {
      if (title !== 'Order Complete' || title !== 'OOPS! Order Declined!' || title !== 'Order Cancelled') {
        let tab = selectedTab(title);
        navigation.navigate('ToktokFoodOrderTransactions', {tab});
        setSeconds(300);
        setMinutes(5);
      }
    }
  };

  const displayOrderTitle = useMemo(() => {
    return <OrderTitle transaction={transaction} riderDetails={riderDetails} referenceNum={referenceNum} />;
  }, [transaction, riderDetails]);

  const OrderListComponent = useMemo(() => {
    return <OrderList orderDetails={transaction.orderDetails} />;
  }, [transaction?.orderStatus]);

  const ModifiedAlert = (
    <View style={styles.modifiedWrapper}>
      <Image resizeMode="stretch" source={info_ic} style={styles.modifiedIcon} />
      <Text style={styles.modifiedText}>
        This order has been modified by merchant. You will be receiving refund amount upon completion of delivery.
      </Text>
    </View>
  );

  const isItemModified = () => {
    const orderDetailsItems = transaction?.orderDetails;
    const evalEditResult = orderDetailsItems.filter(items => items.isModified === true);
    const evalRemovedResult = orderDetailsItems.filter(items => items.status === 0);

    return evalRemovedResult.length > 0 || evalEditResult.length > 0;
  };

  return (
    <View style={styles.container}>
      <DialogMessage
        type={showDialogMessage.type}
        title={showDialogMessage.title}
        messages={showDialogMessage.message}
        reasons={showDialogMessage.reasons}
        visibility={showDialogMessage.show}
        onCloseModal={() => {
          onCloseModal();
        }}
        onCloseBtn1={() => {
          setShowDialogMessage(prev => ({...prev, show: false}));
          // if (showDialogMessage.title === 'OOPS! Order Declined!' || showDialogMessage.title === 'Order Cancelled') {
          // navigation.navigate('ToktokFoodHome');
          // navigation.navigate('ToktokFoodRestaurantOverview', {item});
          navigation.navigate('ToktokFoodRestaurantOverview', {item: {id: transaction.sysShop}});
          // } else {
          //   navigation.navigate('ToktokFoodHome');
          // }
        }}
        onCloseBtn2={() => {
          setShowDialogMessage(prev => ({...prev, show: false}));
          navigation.navigate('ToktokFoodHome');
          // onCloseModal();
        }}
        btn1Title={`Browse${'\n'}Restaurant`}
        btn2Title="OK"
        hasTwoButtons={
          showDialogMessage.title !== 'Order Complete' &&
          showDialogMessage.title !== 'No Response from Merchant' &&
          showDialogMessage.title !== 'Still Preparing Order'
        }
      />
      <HeaderImageBackground searchBox={false}>
        <HeaderTitle backOnly />
      </HeaderImageBackground>
      {(transactionLoading && Object.entries(transaction).length == 0) ||
      Object.entries(transaction).length == 0 ||
      transactionError ? (
        <LoadingIndicator isFlex isLoading={true} />
      ) : (
        <ScrollView bounces={false} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          {displayOrderTitle}
          <Separator />
          <OrderAddress transaction={transaction} riderDetails={riderDetails} />
          <Separator />
          {transaction.notes != '' && (
            <>
              <OrderNote title="Note" label={transaction.notes} />
              <Separator />
            </>
          )}
          {riderDetails?.driver != null && (
            <>
              <OrderRider riderDetails={riderDetails} transaction={transaction} />
              <Separator />
            </>
          )}
          {/* <OrderList orderDetails={transaction.orderDetails} /> */}
          {isItemModified() && ModifiedAlert}
          {OrderListComponent}
          <Separator />
          {transaction?.promoDetails && transaction?.orderIsfor === 1 && (
            <>
              <OrderShippingVoucher data={transaction} forDelivery={transaction.orderIsfor === 1} />
              <Separator />
            </>
          )}
          <OrderFee data={transaction} forDelivery={transaction.orderIsfor === 1} />
          <Separator />
          <OrderNote
            title="Payment Method"
            label={transaction.paymentMethod == 'COD' ? 'Cash On Delivery' : transaction.paymentMethod}
          />
          <Separator />
          <OrderLogs transaction={transaction} riderDetails={riderDetails} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFF'},
  scrollView: {paddingBottom: 10},
  modifiedWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFCF4',
    height: 80,
    paddingHorizontal: 12,
  },
  modifiedIcon: {height: 16, width: 16, marginRight: 8, marginLeft: 5},
  modifiedText: {fontSize: 12, color: '#F6841F', maxWidth: '95%'},
});

export default ToktokFoodOrderDetails;
