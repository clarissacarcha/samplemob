import React, {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, View} from 'react-native';

import Loader from 'toktokfood/components/Loader';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import OrderTypeSelection from 'toktokfood/components/OrderTypeSelection';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

import styles from './styles';
import {COLOR} from 'res/variables';
import {ReceiverLocation, MyOrderList, OrderTotal, PaymentDetails, RiderNotes} from './components';

import {useDispatch, useSelector} from 'react-redux';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import CheckOutOrderHelper from 'toktokfood/helper/CheckOutOrderHelper';
import {GET_SHIPPING_FEE, PATCH_PLACE_CUSTOMER_ORDER} from 'toktokfood/graphql/toktokfood';

import moment from 'moment';
import 'moment-timezone';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodCart = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const nowDate = moment().format('YYYY-DD-YYYY');

  const {amount} = route.params;
  const {location, customerInfo, shopLocation, cart} = useSelector((state) => state.toktokFood);

  const [riderNotes, setRiderNotes] = useState('');
  const [delivery, setDeliveryInfo] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showOrderType, setShowrderType] = useState(true);
  const [orderType, setOrderType] = useState(true);

  const merge = (o) => {
    const arr = [];
    const k = Object.keys(o);
    for (let i = 0; i < k.length; i++) {
      arr.push(o[k[i]]);
    }
    return [].concat.apply([], arr);
  };

  const fixAddOns = () => {
    for (let c = 0; c < cart[0]['items'].length; c++) {
      const {addons} = cart[0]['items'][c];
      cart[0].items[c].addons = merge(addons);
    }
  };

  const [getDeliverFee, {data}] = useLazyQuery(GET_SHIPPING_FEE, {
    variables: {
      input: {
        shopid: cart[0]['sys_shop'],
        date_today: nowDate,
        origin_lat: location.latitude,
        origin_lng: location.longitude,
        des_lat: shopLocation.latitude,
        des_lng: shopLocation.longitude,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getShippingFee}) => {
      setDeliveryInfo(getShippingFee);
    },
  });

  const requestToktokWalletCredit = () => {
    return new Promise(async (resolve, reject) => {
      const WALLET_REQUEST = parseInt(amount) + parseInt(delivery.price ? delivery.price : 0);
      const {data} = await CheckOutOrderHelper.requestTakeMoneyId(WALLET_REQUEST);
      if (data.postRequestTakeMoney.success === 1) {
        resolve(data.postRequestTakeMoney.data);
      } else {
        reject();
      }
    });
  };

  const [postCustomerOrder] = useMutation(PATCH_PLACE_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: (error) => console.log(`LOCATION LOG ERROR: ${error}`),
    onCompleted: ({checkoutOrder}) => {
      navigation.replace('ToktokFoodDriver', {referenceNum: checkoutOrder.referenceNum});
    },
  });

  const placeCustomerOrder = () => {
    if (delivery !== null) {
      setShowLoader(true);

      const CUSTOMER_CART = [...cart];

      CUSTOMER_CART[0]['delivery_amount'] = delivery.price ? delivery.price : 0;
      CUSTOMER_CART[0]['hash_delivery_amount'] = delivery.hash_price;

      requestToktokWalletCredit()
        .then(async (wallet) => {
          const WALLET = {
            pin: '123456',
            request_id: wallet.requestTakeMoneyId,
            pin_type: wallet.validator,
          };

          const CUSTOMER = {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            contactnumber: customerInfo.conno,
            email: customerInfo.email,
            address: customerInfo.address1,
            user_id: customerInfo.id,
            latitude: location.latitude,
            longitude: location.longitude,
            regCode: '0',
            provCode: '0',
            citymunCode: '0',
          };

          const ORDER = {
            total_amount: amount,
            srp_totalamount: amount,
            notes: riderNotes,
            order_isfor: 1, // 1 Delivery | 2 Pick Up Status
            order_type: 2,
            payment_method: 'TOKTOKWALLET',
            order_logs: CUSTOMER_CART,
          };

          postCustomerOrder({
            variables: {
              input: {
                ...WALLET,
                ...CUSTOMER,
                ...ORDER,
              },
            },
          });
        })
        .catch(() => {
          // Show dialog error about toktokwallet request failed.
          console.log('ERROR ON PLACING CART');
        });
    }
  };

  useEffect(() => {
    getDeliverFee();
    fixAddOns();
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle showAddress={false} title="Order Details" />
      </HeaderImageBackground>
      <Loader visibility={showLoader} message="Placing order..." />
      <ScrollView
        bounces={false}
        contentContainerStyle={{paddingBottom: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70)}}>
        <ReceiverLocation />
        <MyOrderList />
        {/* <AlsoOrder /> */}
        {delivery === null ? (
          <View style={[styles.sectionContainer, styles.totalContainer]}>
            <ActivityIndicator color={COLOR.ORANGE} />
          </View>
        ) : (
          <OrderTotal subtotal={amount} deliveryFee={delivery.price} />
        )}
        <PaymentDetails />
        <RiderNotes
          showPlaceOrder={delivery !== null}
          notes={riderNotes}
          onNotesChange={(n) => setRiderNotes(n)}
          onPlaceOrder={() => placeCustomerOrder()}
        />
        <OrderTypeSelection
          value={orderType}
          visibility={showOrderType}
          date={moment().format('MMM DD, YYYY')}
          onValueChange={(type) => setOrderType(type)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ToktokFoodCart;
