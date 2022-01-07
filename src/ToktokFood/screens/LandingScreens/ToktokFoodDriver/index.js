import { useLazyQuery } from '@apollo/react-hooks';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { useDispatch, useSelector } from 'react-redux';
import { CLIENT, TOKTOK_FOOD_GRAPHQL_CLIENT } from 'src/graphql';
import DialogMessage from 'toktokfood/components/DialogMessage';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
// Components
import Loader from 'toktokfood/components/Loader';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { GET_ORDER_TRANSACTION_BY_REF_NUM, GET_RIDER_DETAILS } from 'toktokfood/graphql/toktokfood';
// Utils
import { removeEstimatedDeliveryTime } from 'toktokfood/helper/estimatedDeliveryTime';
import { CancelOrder, DriverAnimationView, DriverDetailsView, PickUpDetailsView, RiderMapView } from './components';


const ToktokFoodDriver = ({route, navigation}) => {
  const referenceNum = route.params ? route.params.referenceNum : '';
  const [seconds, setSeconds] = useState(0);
  const [riderSeconds, setRiderSeconds] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
  const [showDialogMessage, setShowDialogMessage] = useState({
    title: '',
    message: '',
    show: false,
    type: '',
    reasons: ''
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
    message: '',
  });


  // data fetching for tsransaction
  const [getTransactionByRefNum, {error: transactionError, loading: transactionLoading}] = useLazyQuery(
    GET_ORDER_TRANSACTION_BY_REF_NUM,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onError: () => {
        checkOrderResponse5mins.current = BackgroundTimer.setInterval(() => setSeconds(seconds - 5), 5000);
      },
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
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onCompleted: ({getDeliveryDetails}) => {
        setRiderDetails(getDeliveryDetails.driver);
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
      setSeconds(300);
    }
  }, [isFocus]);

  const clearCart = () => {
    dispatch({type: 'SET_TOKTOKFOOD_CART_ITEMS', payload: []});
  };

  useEffect(() => {
    handleGetTransactionByRefNum();
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

  const handleGetTransactionByRefNum = () => {
    getTransactionByRefNum({
      variables: {
        input: {
          referenceNum: referenceNum,
        },
      },
    });
  }

  const handleMapRider = () => {
    if (transaction.tDeliveryId && riderDetails != null) {
      if(riderSeconds > 0){
        riderRefetch({
          variables: {
            input: {
              deliveryId: transaction.tDeliveryId,
            },
          },
        });
        getRiderDetailsInterval.current = BackgroundTimer.setInterval(() => setRiderSeconds(riderSeconds - 20), 20000);
      } else {
        console.log('jsjs')
        setRiderSeconds(300)
      }
    } 
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
              if(riderSeconds == 0){ setRiderSeconds(300) }
            }
          } else {
            handleGetTransactionByRefNum();
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
        let declineNote = `Sorry, your order has been declined and cannot be processed by ${transaction.shopDetails.shopname} due to the following reason/s:`
        let cancelNote = `Your order has been cancelled and cannot be processed by ${transaction.shopDetails.shopname} due to the following reason/s:`
        setShowDialogMessage({
          title: isValidDate ? 'Order Cancelled' : 'OOPS! Order Declined!',
          message: isValidDate ? cancelNote : declineNote,
          reasons: transaction.declinedNote,
          show: true,
          type: 'warning',
        });
        await removeEstimatedDeliveryTime(referenceNum)
      }
    } else {
      checkOrderResponse5mins.current = BackgroundTimer.setInterval(() => setSeconds(seconds - 5), 5000);
    }
  };

  const selectedTab = (title) => {
    switch (title) {
      case 'Order Complete':
        return 2;
      case 'OOPS! Order Declined!':
      case 'Order Cancelled':
        return 3;
      default:
        return 1;
    }
  };

  const onCloseModal = () => {
    let { title } = showDialogMessage
    setShowDialogMessage(prev => ({ ...prev, show: false }))
    if(title == 'Order Complete' || title == 'OOPS! Order Declined!' || title == 'Order Cancelled'){
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
      <Loader loadingIndicator visibility={showLoader} hasImage={false} message="Cancelling Order" />
      <DialogMessage
        visibility={cancelDialogMessage.show}
        title={cancelDialogMessage.title}
        messages={cancelDialogMessage.message}
        type={cancelDialogMessage.type}
        onCloseModal={() => {
          if (cancelDialogMessage.type == 'success') {
            navigation.navigate('ToktokFoodOrderTransactions', {tab: 3});
          }
          setCancelDialogMessage({show: false, type: '', title: '', message: ''});
        }}
      />
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
          setShowDialogMessage((prev) => ({...prev, show: false}));
          navigation.navigate('ToktokFoodHome');
        }}
        onCloseBtn2={() => {
          onCloseModal();
        }}
        btn1Title={`Browse${'\n'}Restaurant`}
        btn2Title="OK"
        hasTwoButtons={
          showDialogMessage.title !== 'Order Complete' && showDialogMessage.title !== 'No Response from Merchant'
        }
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
        failedCancel={() => {
          setShowLoader(false);
          setTimeout(() => {
            setCancelDialogMessage({show: true, type: 'warning', title: 'Something went wrong!'}); 
          }, 500);
        }}
        onCallBackResult={(cancelOrder) => {
          setShowLoader(false);
          setTimeout(() => {
            if (cancelOrder.status == 200) {
              setCancelDialogMessage({
                show: true,
                type: 'success',
                title: 'Order Cancelled',
                message:
                  'Your order has been successfully cancelled. Cancelling orders multiple times will cause your next orders longer to be accepted by the merchant.',
              });
            } else {
              setCancelDialogMessage({show: true, type: 'warning', title: 'Something went wrong!'});
            }
          }, 500);
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
