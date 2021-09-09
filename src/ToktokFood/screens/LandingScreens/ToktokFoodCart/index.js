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
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

import {COLOR} from 'res/variables';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodCart = () => {
  const route = useRoute();

  const {amount} = route.params;
  const {location, customerInfo, shopLocation} = useSelector((state) => state.toktokFood);

  useSelector((state) => console.log(JSON.stringify(state.toktokFood)));

  const [riderNotes, setRiderNotes] = useState('');
  const [delivery, setDeliveryInfo] = useState(null);
  const [wallet, setWallet] = useState({message: '', requestTakeMoneyId: '', validator: ''});

  const [getDeliverFee, {data}] = useLazyQuery(GET_SHIPPING_FEE, {
    variables: {
      input: {
        shopid: 55, // Must get SHOP ID
        date_today: '2021-09-09',
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

  const roundNumber = (number, decimals) => {
    var newnumber = new Number(number + '').toFixed(parseInt(decimals));
    return parseFloat(newnumber);
  };

  const requestToktokWalletCredit = async () => {
    const {data} = await CheckOutOrderHelper.requestTakeMoneyId(400);
    if (data.postRequestTakeMoney.success === 1) {
      setWallet(data.postRequestTakeMoney.data);
    }
  };

  const [postCustomerOrder] = useMutation(PATCH_PLACE_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: (error) => console.log(`LOCATION LOG ERROR: ${error}`),
    onCompleted: (r) => console.log(r),
  });

  const placeCustomerOrder = () => {
    requestToktokWalletCredit().then(async () => {
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
      };
      // roundNumber(delivery.price + totalAmount.price)
      const ORDER = {
        total_amount: 311.0,
        notes: riderNotes,
        order_isfor: 1,
        order_type: 2,
        payment_method: 'TOKTOKWALLET',
        order_logs: [
          {
            sys_shop: 55, // Must get SHOP ID
            branchid: 0,
            hash_delivery_amount: delivery.hash_price,
            delivery_amount: delivery.price,
            daystoship: 0,
            daystoship_to: 0,
            items: [
              {
                sys_shop: 55, // Must get SHOP ID
                product_id: '1e33caf73047401db1cb96438abd6ca1',
                quantity: 1,
                amount: 150.0,
                srp_amount: 150.0,
                srp_totalamount: 150.0,
                total_amount: 150.0,
                order_type: 1,
                notes: 'Add extra tissue',
                addons: [{addon_id: 31, addon_name: 'Nata', addon_price: 20}],
              },
              {
                sys_shop: 55, // Must get SHOP ID
                product_id: '42697a20e82e40ef8031aa5ebee2d434',
                quantity: 1,
                amount: 140.0,
                srp_amount: 140.0,
                srp_totalamount: 140.0,
                total_amount: 140.0,
                order_type: 1,
                notes: 'Add extra tissue',
                addons: [
                  {addon_id: 54, addon_name: 'White Pearl', addon_price: 15},
                  {addon_id: 53, addon_name: 'Nata', addon_price: 15},
                  {addon_id: 54, addon_name: 'Venti', addon_price: 150},
                ],
              },
            ],
          },
        ],
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
    });
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
        <AlsoOrder />
        {delivery === null ? (
          <View style={[styles.sectionContainer, styles.totalContainer]}>
            <ActivityIndicator color={COLOR.ORANGE} />
          </View>
        ) : (
          <OrderTotal subtotal={amount} deliveryFee={delivery.price} />
        )}
        <PaymentDetails />
        <RiderNotes
          notes={riderNotes}
          onNotesChange={(n) => setRiderNotes(n)}
          onPlaceOrder={() => placeCustomerOrder()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ToktokFoodCart;
