import {useSelector} from 'react-redux';
import React, {useState, useEffect} from 'react';
import {KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, View} from 'react-native';

import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

import styles from './styles';
import {ReceiverLocation, AlsoOrder, MyOrderList, OrderTotal, PaymentDetails, RiderNotes} from './components';

import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SHIPPING_FEE, PATCH_PLACE_CUSTOMER_ORDER} from 'toktokfood/graphql/toktokfood';
import CheckOutOrderHelper from 'toktokfood/helper/CheckOutOrderHelper';

import {useRoute} from '@react-navigation/native';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

import {COLOR} from 'res/variables';

import moment from 'moment';
import 'moment-timezone';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodCart = () => {
  const route = useRoute();
  const nowDate = moment().format('YYYY-DD-YYYY');

  const {amount} = route.params;
  const {location, customerInfo, shopLocation, cart} = useSelector((state) => state.toktokFood);

  const [riderNotes, setRiderNotes] = useState('');
  const [delivery, setDeliveryInfo] = useState(null);

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
      const WALLET_REQUEST = parseInt(amount) + parseInt(delivery.price);
      const {data} = await CheckOutOrderHelper.requestTakeMoneyId(WALLET_REQUEST);
      data.postRequestTakeMoney.success === 1 ? resolve(data.postRequestTakeMoney.data) : reject();
    });
  };

  const [postCustomerOrder] = useMutation(PATCH_PLACE_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: (error) => console.log(`LOCATION LOG ERROR: ${error}`),
    onCompleted: (r) => console.log(r),
  });

  const placeCustomerOrder = () => {
    if (delivery !== null) {
      const CUSTOMER_CART = [...cart];

      CUSTOMER_CART[0]['delivery_amount'] = delivery.price;
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
            order_isfor: 2,
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
        });
    }
  };

  useEffect(() => {
    getDeliverFee();
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle showAddress={false} title="Order Details" />
      </HeaderImageBackground>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ToktokFoodCart;
