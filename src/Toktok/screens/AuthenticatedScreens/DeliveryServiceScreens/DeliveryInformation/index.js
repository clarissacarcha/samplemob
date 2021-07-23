import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text, TextInput, Alert} from 'react-native';
import {connect} from 'react-redux';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import InputScrollView from 'react-native-input-scroll-view';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
import {COLOR, LIGHT, ORANGE} from '../../../../../res/constants';
import {GET_DELIVERY_PRICE_AND_DIRECTIONS, GET_TOKTOK_WALLET_BALANCE} from '../../../../../graphql';
import {WhiteButton, BlackButton, YellowButton} from '../../../../../revamp';
import {onErrorAlert} from '../../../../../util/ErrorUtility';
import {useAlert} from '../../../../../hooks';
import {numberFormat} from '../../../../../helper/numberFormat';

//SELF IMPORTS
import {PaymentForm, PaymentSheet} from './PaymentForm';
import {PaymentMethodForm, PaymentMethodSheet} from './PaymentMethod';
import ExpressForm from './ExpressForm';
import {ItemForm, ItemSheet} from './ItemForm';
import NotesForm from './NotesForm';
import PabiliForm from './PabiliForm';

import PromoForm from './PromoForm';

const DeliveryDetails = ({navigation, route, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Delivery', 'Information']} />,
  });

  const AlertHook = useAlert();

  const [collectPaymentFrom, setCollectPaymentFrom] = useState(route.params.orderData.collectPaymentFrom);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [itemDescription, setItemDescription] = useState(route.params.orderData.cargo);
  const [otherItem, setOtherItem] = useState('');
  const [notes, setNotes] = useState(route.params.orderData.notes);
  const [isExpress, setIsExpress] = useState(route.params.orderData.isExpress);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(route.params.orderData.isCashOnDelivery);
  const [cashOnDelivery, setCashOnDelivery] = useState(route.params.orderData.cashOnDelivery);
  const {data: balanceData, loading: balanceLoading, error: balanceError} = useQuery(GET_TOKTOK_WALLET_BALANCE, {
    fetchPolicy: 'network-only',
  });

  let balanceText = '';
  let hasWallet = false;

  if (balanceError) {
    balanceText = 'Failed to retrieve balance.';
  }

  if (balanceLoading) {
    balanceText = 'Retrieving balance...';
  }

  if (balanceData) {
    balanceText = `PHP ${numberFormat(balanceData.getToktokWalletBalance.balance)}`;

    hasWallet = balanceData.getToktokWalletBalance.hasWallet;
  }

  console.log({balanceText, hasWallet});

  const paymentMethodSheetRef = useRef();
  const paymentSheetRef = useRef();
  const itemSheetRef = useRef();

  const [getDeliveryPriceAndDirections, {loading}] = useLazyQuery(GET_DELIVERY_PRICE_AND_DIRECTIONS, {
    fetchPolicy: 'no-cache',
    onError: (error) => {
      onErrorAlert({alert: AlertHook, error});
    },
    onCompleted: (data) => {
      const {hash, pricing, directions} = data.getDeliveryPriceAndDirections;
      const {price, distance, duration, discount, expressFee} = pricing;

      let finalItemDescription = itemDescription;

      if (itemDescription === 'Others') {
        finalItemDescription = otherItem;
      }

      navigation.push('DeliverySummary', {
        orderData: {
          ...route.params.orderData,
          collectPaymentFrom,
          paymentMethod,
          cargo: finalItemDescription,
          notes,
          isExpress,
          isCashOnDelivery,
          cashOnDelivery,
          hash,
          price,
          discount,
          distance,
          duration,
          directions,
        },
      });
    },
  });

  const onIsCashOnDeliveryChange = (isCashOnDeliveryValue) => {
    setIsCashOnDelivery(isCashOnDeliveryValue);

    if (isCashOnDeliveryValue) {
      setCollectPaymentFrom('RECIPIENT');
    }

    // console.log({collectPaymentFrom});
  };

  const onCollectPaymentFromChange = (collectPaymentFromValue) => {
    if (isCashOnDelivery && collectPaymentFromValue === 'SENDER') {
      AlertHook({message: 'Cannot collect payment from sender on cash on deliveries.'});
      return;
    }
    setCollectPaymentFrom(collectPaymentFromValue);
  };

  const onPaymentMethodChange = (paymentMethodValue) => {
    // if (isCashOnDelivery && collectPaymentFromValue === 'SENDER') {
    //   AlertHook({message: 'Cannot collect payment from sender on cash on deliveries.'});
    //   return;
    // }
    setPaymentMethod(paymentMethodValue);
  };

  const onConfirmDeliveryInformation = () => {
    // if (!bookingData.recipientStop[0].formattedAddress) {
    //   Alert.alert('', 'Please enter recipient details');
    //   return;
    // }

    let finalItemDescription = itemDescription;

    if (!itemDescription) {
      AlertHook({message: 'Please select item description'});
      return;
    }

    if (itemDescription === 'Others' && otherItem === '') {
      AlertHook({message: 'Please describe your item.'});
      return;
    }

    if (itemDescription === 'Others') {
      finalItemDescription = otherItem;
    }

    // if (bookingData.orderType === 'SCHEDULED' && bookingData.promoCode !== '') {
    //   Alert.alert('', 'Promo Codes can only be used on As Soon As Possible Order Type.');
    //   return;
    // }

    if (isCashOnDelivery && !cashOnDelivery) {
      AlertHook({message: 'Please input Cash on Delivery amount.'});
      return;
    }

    if (isCashOnDelivery && cashOnDelivery < 1) {
      AlertHook({message: 'Cash on Delivery amount must be greater than or equal to PHP 1.00'});
      return;
    }

    route.params.setOrderData({
      ...route.params.orderData,
      collectPaymentFrom,
      paymentMethod,
      itemDescription: finalItemDescription,
      notes,
      isExpress,
      isCashOnDelivery,
      cashOnDelivery,
    });

    const orderData = route.params.orderData;

    getDeliveryPriceAndDirections({
      variables: {
        input: {
          consumerId: session.user.consumer.id,
          vehicleTypeId: orderData.vehicleTypeId,
          promoCode: '',
          // promoCode: bookingData.promoCode,
          isExpress: isExpress,
          isCashOnDelivery: isCashOnDelivery,
          paymentMethod,
          origin: {
            latitude: orderData.senderStop.latitude,
            longitude: orderData.senderStop.longitude,
          },
          destinations: [
            {
              latitude: orderData.recipientStop[0].latitude,
              longitude: orderData.recipientStop[0].longitude,
            },
          ],
        },
      },
    });
  };

  return (
    <>
      <View style={styles.screenBox}>
        <View style={{flex: 1}}>
          <InputScrollView>
            <AlertOverlay visible={loading} />
            <View style={{height: 10}} />
            {/* <PaymentMethodForm
              value={paymentMethod === 'CASH' ? 'Cash' : 'toktokwallet'}
              bottomSheetRef={paymentMethodSheetRef}
            /> */}
            {paymentMethod === 'CASH' && (
              <PaymentForm
                value={collectPaymentFrom === 'SENDER' ? 'Sender' : 'Recipient'}
                bottomSheetRef={paymentSheetRef}
              />
            )}

            <ItemForm
              value={itemDescription}
              bottomSheetRef={itemSheetRef}
              onOtherItemChange={setOtherItem}
              otherItem={otherItem}
            />

            <NotesForm value={notes} onChange={setNotes} />

            <PromoForm />

            <ExpressForm value={isExpress} onChange={setIsExpress} />
            <PabiliForm
              value={isCashOnDelivery}
              amount={cashOnDelivery}
              onChange={onIsCashOnDeliveryChange}
              onAmountChange={setCashOnDelivery}
            />
          </InputScrollView>
        </View>
        <View style={{backgroundColor: '#F7F7FA', marginHorizontal: -16}}>
          <YellowButton
            label="Confirm Delivery Information"
            onPress={onConfirmDeliveryInformation}
            style={{margin: 16}}
          />
        </View>
      </View>
      <PaymentSheet onChange={onCollectPaymentFromChange} ref={paymentSheetRef} />
      <PaymentMethodSheet
        onChange={onPaymentMethodChange}
        ref={paymentMethodSheetRef}
        balanceText={balanceText}
        hasWallet={hasWallet}
      />
      <ItemSheet onChange={setItemDescription} ref={itemSheetRef} />
    </>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export const DeliveryInformation = connect(mapStateToProps, null)(DeliveryDetails);

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flex: 1,
  },
});
