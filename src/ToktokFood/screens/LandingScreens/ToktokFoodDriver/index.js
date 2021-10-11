import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Alert} from 'react-native';

// Components
import Loader from 'toktokfood/components/Loader';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {DriverAnimationView, DriverDetailsView, PickUpDetailsView, CancelOrder, RiderMapView} from './components';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT, CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTION_BY_REF_NUM, GET_RIDER_DETAILS} from 'toktokfood/graphql/toktokfood';
import {useSelector, useDispatch} from 'react-redux';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {useIsFocused} from '@react-navigation/native';
import {removeRiderDetails} from 'toktokfood/helper/showRiderDetails';
import DialogMessage from 'toktokfood/components/DialogMessage';
import moment from 'moment';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodDriver = ({route, navigation}) => {
  const referenceNum = route.params ? route.params.referenceNum : '';
  const [seconds, setSeconds] = useState(0);
  const [riderSeconds, setRiderSeconds] = useState(0);
  const [preparingOrderSeconds, setPreparingOrderSeconds] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
  const [showDialogMessage, setShadowDialogMessage] = useState({
    title: '',
    message: '',
    show: false,
    type: ''
  });
  const checkOrderResponse5mins = useRef(null);
  const getRiderDetailsInterval = useRef(null);
  const preparingOrderInterval = useRef(null);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const {location} = useSelector((state) => state.toktokFood);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      clearInterval(checkOrderResponse5mins.current);
      clearInterval(getRiderDetailsInterval.current);
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
    getTransactionByRefNum();
  }, []);

  useEffect(() => {
    handleOrderProcess();
    return () => {
      clearInterval(checkOrderResponse5mins.current);
    };
  }, [seconds, transaction]);

  useEffect(() => {
    handleMapRider();
    return () => {
      clearInterval(getRiderDetailsInterval.current);
    };
  }, [riderSeconds]);

  const handleMapRider = () => {
    if (transaction.tDeliveryId && riderDetails != null) {
      riderRefetch({
        variables: {
          input: {
            deliveryId: transaction.tDeliveryId ,
          },
        },
      });
    }
    getRiderDetailsInterval.current = setInterval(() => setRiderSeconds(seconds - 20), 20000);
    console.log('Rider Details Updated ' + riderSeconds);
  };

  const checkIfNoResponse = () => {
    let start = moment(transaction.dateOrderProcessed).format('hh:mm');
    let end = moment().format('hh:mm');
    let duration = moment(transaction.dateOrderProcessed).add(30, 'minutes').format('hh:mm');
    // let diff = end.diff(duration)
    // var time3 = moment(diff).format('hh:mm:ss'); 
    console.log(end, duration)
    if(end >= duration){
      setShadowDialogMessage({
        title: `Delay`,
        message: `We couldn't find you a driver as of this moment. Please try again.`,
        show: true,
        type: 'warning'
      });
    }
  }

  const handleOrderProcess = async () => {
    if (transaction && Object.keys(transaction).length > 0) {
      if (transaction.orderStatus == 's') {
        let message = transaction.orderIsfor == 1 ? 'Your order has been delivered successfully.' : 'You have successfully picked up your order.'
        clearInterval(checkOrderResponse5mins.current);
        clearInterval(getRiderDetailsInterval.current);
        await removeRiderDetails(referenceNum);
        setShadowDialogMessage({
          title: 'Order Complete',
          message,
          show: true,
          type: 'success'
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
                    deliveryId: transaction.tDeliveryId ,
                  },
                },
              });
            }
          } else {
            refetch({variables: {input: {referenceNum: referenceNum}}});
          }
          checkOrderResponse5mins.current = setInterval(() => setSeconds(seconds - 5), 5000);
          // checkIfNoResponse()
        } else {
          if (riderDetails == null) {
            clearInterval(checkOrderResponse5mins.current);
            clearInterval(getRiderDetailsInterval.current);
            if (transaction.orderStatus == 'p') {
              setShadowDialogMessage({
                title: 'No Response from Merchant',
                message: `Merchant hasn't confirmed your order.\nPlease try again.`,
                show: true,
                type: 'warning'
              });
            } else {
              if (transaction.orderIsfor == 1) {
                // setShadowDialogMessage({
                //   title: `Couldn't Find Driver`,
                //   message: `We couldn't find you a driver as of this moment. Please try again.`,
                //   show: true,
                //   type: 'warning'
                // });
              }
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
    }
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
    <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
      <HeaderImageBackground searchBox={false}>
        <HeaderTitle />
      </HeaderImageBackground>
      <Loader visibility={showLoader} message="Canceling order..." />
      <DialogMessage
        type={showDialogMessage.type}
        title={showDialogMessage.title}
        messages={showDialogMessage.message}
        visibility={showDialogMessage.show}
        onCloseModal={() => { onCloseModal() }}
      />
      <CancelOrder
        onProcess={() => setShowLoader(true)}
        onCloseSheet={() => {
          setShowCancel(false);
          setSeconds(300);
        }}
        failedCancel={() => {
          setShowLoader(false)
          setTimeout(() => {
            Alert.alert('', 'Toktokwallet error. Unable to return the money.')
          }, 100)
        }}
        visibility={showCancel}
        referenceOrderNumber={referenceNum}
      />
      {(transactionLoading && transaction && Object.keys(transaction).length == 0) ||
      transaction && Object.keys(transaction).length == 0 ||
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
              <DriverDetailsView
                onCancel={() => {
                  setShowCancel(true);
                  clearTimeout(checkOrderResponse5mins.current);
                }}
                riderDetails={riderDetails}
                transaction={transaction}
                referenceNum={referenceNum}
              />
            ) : (
              <PickUpDetailsView
                onCancel={() => {
                  setShowCancel(true);
                  clearTimeout(checkOrderResponse5mins.current);
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
