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
import {removeRiderDetails} from 'toktokfood/helper/ShowRiderDetails';
import {useIsFocused} from '@react-navigation/native';
import DialogMessage from 'toktokfood/components/DialogMessage';

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
  const [transaction, setTransaction] = useState({});
  const [riderDetails, setRiderDetails] = useState(null);
  const checkOrderResponse5mins = useRef(null);
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

  const getToktokFoodRiderDetails = async () => {
    try {
      const API_RESULT = await axios({
        url: 'https://dev.toktok.ph:2096/graphql',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          query: `
            query {
              getDeliveryDriver(input: {
                deliveryId: "${transaction?.tDeliveryId}"
              }) {
                driver {
                  id
                  status
                  licenseNumber
                  isOnline
                  location {
                    latitude
                    longitude
                    lastUpdate
                  }
                user {
                  id
                  username
                  status
                  person {
                    firstName
                    middleName
                    lastName
                    mobileNumber
                    emailAddress
                    avatar
                    avatarThumbnail
                  }
                }
                vehicle {
                  plateNumber
                  brand {
                    brand
                  }
                  model {
                    model
                  }
                }
              }
            }
          }`,
        },
      });
      const res = API_RESULT.data.data.getDeliveryDriver;
      // console.log(JSON.stringify(res));
      setRiderDetails(res.driver);
    } catch (error) {
      console.log(error);
    }
  };

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
    if (isFocus) {
      setSeconds(300);
    }
  }, [isFocus]);

  useEffect(() => {
    handleOrderProcess();
    return () => {
      clearInterval(checkOrderResponse5mins.current);
    };
  }, [seconds, transaction]);

  const handleOrderProcess = async() => {
    if(transaction && Object.entries(transaction).length > 0 && orderStatus == undefined){
      if(transaction.orderStatus == 's'){
        let message = transaction.orderIsfor == 1 ? 'Your order has been delivered successfully.' : 'You have successfully picked up your order.'
        clearInterval(checkOrderResponse5mins.current);
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
            if (transaction.tDeliveryId) {
              // getRiderDetails();
              getToktokFoodRiderDetails();
            }
          } else {
            refetch({variables: { input: { referenceNum: referenceNum }}});
          }
          checkOrderResponse5mins.current = setInterval(() => setSeconds(seconds - 5), 5000);
        } else {
          if (riderDetails == null) {
            clearInterval(checkOrderResponse5mins.current);
            if (transaction.orderStatus == 'p') {
              setShadowDialogMessage({
                title: 'No Response from Merchant',
                message: `Merchant hasn't confirmed your order.\nPlease try again.`,
                show: true,
                type: 'warning'
              });
            } else {
              if (transaction.orderIsfor == 1) {
                setShadowDialogMessage({
                  title: `Couldn't Find Driver`,
                  message: `We couldn't find you a driver as of this moment. Please try again.`,
                  show: true,
                  type: 'warning'
                });
              }
            }
          } else {
            setSeconds(300);
          }
        }
      } else {
        setShadowDialogMessage({
          title: 'OOPS!',
          message: 'Your order has been declined.',
          show: true,
          type: 'warning'
        });
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

  const onCloseModal = () => {
    let { title } = showDialogMessage
    setShadowDialogMessage(prev => ({ ...prev, show: false }))
    if(title == 'Order Complete' || title == 'OOPS!'){
      navigation.navigate('ToktokFoodOrderTransactions')
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
          <OrderFee data={transaction} forDelivery={transaction.orderIsfor == 1} />
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
