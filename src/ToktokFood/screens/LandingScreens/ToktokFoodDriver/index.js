import axios from 'axios';
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';

// Components
import Loader from 'toktokfood/components/Loader';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {DriverAnimationView, DriverDetailsView, PickUpDetailsView, CancelOrder, RiderMapView} from './components';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import DialogMessage from 'toktokfood/components/DialogMessage';
import TimerModal from 'toktokfood/components/TimerModal';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';
import {removeRiderDetails} from 'toktokfood/helper/showRiderDetails';
import { removeEstimatedDeliveryTime } from 'toktokfood/helper/estimatedDeliveryTime';

import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT, CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTION_BY_REF_NUM, GET_RIDER_DETAILS} from 'toktokfood/graphql/toktokfood';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';


const ToktokFoodDriver = ({route, navigation}) => {
  const referenceNum = route.params ? route.params.referenceNum : '';
  const [seconds, setSeconds] = useState(0);
  const [riderSeconds, setRiderSeconds] = useState(0);
  const [preparingOrderSeconds, setPreparingOrderSeconds] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
  const [showDialogMessage, setShowDialogMessage] = useState({
    title: '',
    message: '',
    show: false,
    type: '',
  });
  const checkOrderResponse5mins = useRef(null);
  const getRiderDetailsInterval = useRef(null);
  const preparingOrderInterval = useRef(null);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const {location} = useSelector((state) => state.toktokFood);
  const [cancelDialogMessage, setCancelDialogMessage] = useState({
    show: false,
    type: '',
    title: '',
    message: ''
  });

  // data fetching for tsransaction
  const [getTransactionByRefNum, {error: transactionError, loading: transactionLoading, refetch}] = useLazyQuery(
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
    if (isFocus) {
      setSeconds(300);
    }
  }, [isFocus]);

  const clearCart = () => {
    dispatch({type: 'SET_TOKTOKFOOD_CART_ITEMS', payload: []});
  };

  useEffect(() => {
    getTransactionByRefNum();
  }, []);

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
      riderRefetch({
        variables: {
          input: {
            deliveryId: transaction.tDeliveryId,
          },
        },
      });
    }
    getRiderDetailsInterval.current = BackgroundTimer.setInterval(() => setRiderSeconds(seconds - 20), 20000);
    console.log('Rider Details Updated ' + riderSeconds);
  };

  const handleOrderProcess = async () => {
    if (transaction && Object.keys(transaction).length > 0) {
      if (transaction.orderStatus == 's') {
        let message = transaction.orderIsfor == 1 ? 'Your order has been delivered successfully.' : 'You have successfully picked up your order.'
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
      if (transaction.isdeclined == 0) {
        if (seconds > 0) {
          if (transaction.orderStatus != 'p' && transaction?.orderIsfor == 1) {
            refetch({variables: {input: {referenceNum: referenceNum}}});
            if (transaction.tDeliveryId != null && riderDetails == null) {
              getToktokFoodRiderDetails({
                variables: {
                  input: {
                    deliveryId: transaction.tDeliveryId,
                  },
                },
              });
            }
          } else {
            refetch({variables: {input: {referenceNum: referenceNum}}});
          }
          checkOrderResponse5mins.current = BackgroundTimer.setInterval(() => setSeconds(seconds - 5), 5000);
        } else {
          if (riderDetails == null) {
            BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
            BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
            if (transaction.orderStatus == 'p') {
              setShowDialogMessage({
                title: 'No Response from Merchant',
                message: `Merchant hasn't confirmed your order.\nPlease try again.`,
                show: true,
                type: 'warning',
              });
            } else {
              setSeconds(300);
            }
          } else {
            setSeconds(300);
          }
        }
      } else {
        BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
        BackgroundTimer.clearInterval(getRiderDetailsInterval.current);
        let isValidDate = moment(transaction.dateOrderProcessed).isValid();
        setShowDialogMessage({
          title: isValidDate ? 'Order Cancelled by Merchant' : 'OOPS!',
          message: transaction.declinedNote ? transaction.declinedNote :
            isValidDate ? 'Your order was cancelled by merchant.' : 'Your order has been declined.',
          show: true,
          type: 'warning',
        });
        await removeEstimatedDeliveryTime(referenceNum)
      }
    }
  };

  const selectedTab = (title) => {
    switch (title) {
      case 'Order Complete':
        return 2;
      case 'OOPS!':
      case 'Order Cancelled by Merchant':
        return 3;
      default:
        return 1;
    }
  };

  const onCloseModal = () => {
    let { title } = showDialogMessage
    setShowDialogMessage(prev => ({ ...prev, show: false }))
    if(title == 'Order Complete' || title == 'OOPS!' || title == 'Order Cancelled by Merchant'){
      let tab = selectedTab(title)
      navigation.navigate('ToktokFoodOrderTransactions', { tab })
    } else {
      setSeconds(300);
    }
  };

  const displayDeliveryDetailsView = useMemo(() => {
    return(
      <DriverDetailsView
        onCancel={() => {
          setShowCancel(true);
          BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
        }}
        riderDetails={riderDetails}
        transaction={transaction}
        referenceNum={referenceNum}
      />
    )
  }, [transaction, riderDetails, referenceNum])

  return (
    <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
      <HeaderImageBackground searchBox={false}>
        <HeaderTitle />
      </HeaderImageBackground>
      <Loader visibility={showLoader} message="Canceling order..." />
      <DialogMessage
        visibility={cancelDialogMessage.show}
        title={cancelDialogMessage.title}
        messages={cancelDialogMessage.message}
        type={cancelDialogMessage.type}
        onCloseModal={() => {
          if(cancelDialogMessage.type == 'success'){
            navigation.navigate('ToktokFoodOrderTransactions', { tab: 3 })
          }
          setCancelDialogMessage({ show: false, type: '', title: '', message: '' })
        }}
      />
      <DialogMessage
        type={showDialogMessage.type}
        title={showDialogMessage.title}
        messages={showDialogMessage.message}
        visibility={showDialogMessage.show}
        onCloseModal={() => {
          onCloseModal();
        }}
      />
      <CancelOrder
        setShowLoader={setShowLoader}
        onCloseSheet={() => {
          setShowCancel(false);
          setSeconds(300);
        }}
        visibility={showCancel}
        setShowCancel={setShowCancel}
        referenceOrderNumber={referenceNum}
        cancelDialogMessage={cancelDialogMessage}
        setCancelDialogMessage={setCancelDialogMessage}
        onCallBackResult={(cancelOrder) => {
          setShowLoader(false)
          setTimeout(() => {
            if (cancelOrder.status == 200) {
              setCancelDialogMessage({ show: true, type: 'success', title: 'Successful!', message: 'Order has been cancelled.' })
            } else {
              setCancelDialogMessage({ show: true, type: 'warning', title: 'Something went wrong!' })
            }
          }, 500)
        }}
      />
      {(transactionLoading && transaction && Object.keys(transaction).length == 0) ||
      (transaction && Object.keys(transaction).length == 0) ||
      transactionError ? (
        <LoadingIndicator isFlex isLoading={true} />
      ) : (
        <>
          {riderDetails != null && (transaction.orderStatus == 'f' || transaction.orderStatus == 's') ? (
            <RiderMapView riderCoordinates={riderDetails.location} customerCoordinates={transaction} />
          ) : (
            <DriverAnimationView
              orderStatus={transaction.orderStatus}
              riderDetails={riderDetails}
              orderIsfor={transaction.orderIsfor}
              referenceNum={referenceNum}
            />
          )}
          <View style={styles.driverWrapper}>
            {transaction.orderIsfor == 1 ? (
              displayDeliveryDetailsView
            ) : (
              <PickUpDetailsView
                onCancel={() => {
                  setShowCancel(true);
                  BackgroundTimer.clearInterval(checkOrderResponse5mins.current);
                }}
                riderDetails={riderDetails}
                transaction={transaction}
                referenceNum={referenceNum}
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
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});

export default ToktokFoodDriver;
