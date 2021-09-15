import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Alert} from 'react-native';

// Components
import Loader from 'toktokfood/components/Loader';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {DriverAnimationView, DriverDetailsView, PickUpDetailsView, CancelOrder} from './components';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT, CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTION_BY_REF_NUM, GET_RIDER_DETAILS} from 'toktokfood/graphql/toktokfood';
import {useSelector, useDispatch} from 'react-redux';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {useIsFocused} from '@react-navigation/native';
import {removeRiderDetails} from 'toktokfood/helper/ShowRiderDetails';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodDriver = ({route, navigation}) => {
  const referenceNum = route.params ? route.params.referenceNum : '';
  const [seconds, setSeconds] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
  const checkOrderResponse5mins = useRef(null);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const {location} = useSelector((state) => state.toktokFood);

  // data fetching for tsransaction
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
        console.log(getTransactionByRefNum);
        // if (JSON.stringify(getTransactionByRefNum) != JSON.stringify(transaction)) {
        //   setTransaction(getTransactionByRefNum);
        // }
        setTransaction(getTransactionByRefNum);
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
  }, [seconds, transaction, riderDetails]);

  const handleOrderProcess = async () => {
    if (Object.keys(transaction).length > 0) {
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
          checkOrderResponse5mins.current = setInterval(() => setSeconds(seconds - 5), 5000);
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
    <View style={{flex: 1, backgroundColor: '#FFFF'}}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle title="Place Order" />
      </HeaderImageBackground>
      <Loader visibility={showLoader} message="Canceling order..." />
      <CancelOrder
        onProcess={() => setShowLoader(true)}
        onCloseSheet={() => {
          setShowCancel(false);
          setSeconds(300);
        }}
        failedCancel={() => console.log('Failed to cancel')}
        visibility={showCancel}
        referenceOrderNumber={referenceNum}
      />
      {(transactionLoading && Object.entries(transaction).length == 0) ||
      Object.entries(transaction).length == 0 ||
      transactionError ? (
        <LoadingIndicator isFlex isLoading={true} />
      ) : (
        <>
          <DriverAnimationView
            orderStatus={transaction.orderStatus}
            riderDetails={riderDetails}
            orderIsfor={transaction.orderIsfor}
            referenceNum={referenceNum}
          />
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
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});

export default ToktokFoodDriver;
