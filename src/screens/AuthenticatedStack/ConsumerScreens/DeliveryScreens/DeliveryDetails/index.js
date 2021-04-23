import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {connect} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
import {COLOR, LIGHT, ORANGE, onError} from '../../../../../res/constants';
import {GET_DELIVERY_PRICE_AND_DIRECTIONS} from '../../../../../graphql';
import {WhiteButton, BlackButton} from '../../../../../revamp';

//SELF IMPORTS
import {PaymentForm, PaymentSheet} from './PaymentForm';
import ExpressForm from './ExpressForm';
import {ItemForm, ItemSheet} from './ItemForm';
import NotesForm from './NotesForm';
import PabiliForm from './PabiliForm';
import PromoForm from './PromoForm';

const DeliveryDetails = ({navigation, route, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Delivery', 'Details']} />,
  });

  const [collectPaymentFrom, setCollectPaymentFrom] = useState(route.params.orderData.collectPaymentFrom);
  const [itemDescription, setItemDescription] = useState(route.params.orderData.cargo);
  const [notes, setNotes] = useState(route.params.orderData.notes);
  const [isExpress, setIsExpress] = useState(route.params.orderData.isExpress);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(route.params.orderData.isCashOnDelivery);
  const [cashOnDelivery, setCashOnDelivery] = useState(route.params.orderData.cashOnDelivery);

  const paymentSheetRef = useRef();
  const itemSheetRef = useRef();

  const [getDeliveryPriceAndDirections, {loading}] = useLazyQuery(GET_DELIVERY_PRICE_AND_DIRECTIONS, {
    fetchPolicy: 'no-cache',
    onError: onError,
    onCompleted: (data) => {
      console.log(JSON.stringify(data.getDeliveryPriceAndDirections, null, 4));
      const {hash, pricing, directions} = data.getDeliveryPriceAndDirections;
      const {price, distance, duration, discount, expressFee} = pricing;
      // const updatedBookingData = {
      //   ...bookingData,
      //   hash,
      //   price,
      //   discount,
      //   distance,
      //   duration,
      //   directions,
      // };
      // navigation.navigate('ConsumerMap', {callbackData: updatedBookingData});
      navigation.push('DeliverySummary', {
        orderData: {
          ...route.params.orderData,
          collectPaymentFrom,
          cargo: itemDescription,
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

  const onNext = () => {
    route.params.setOrderData({
      ...route.params.orderData,
      collectPaymentFrom,
      itemDescription,
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
          promoCode: '',
          // promoCode: bookingData.promoCode,
          isExpress: isExpress,
          isCashOnDelivery: isCashOnDelivery,
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
    <View style={styles.screenBox}>
      <AlertOverlay visible={loading} />
      <View style={{height: 10}} />
      <PaymentForm value={collectPaymentFrom === 'SENDER' ? 'Sender' : 'Recipient'} bottomSheetRef={paymentSheetRef} />
      <ItemForm value={itemDescription} bottomSheetRef={itemSheetRef} />

      <NotesForm value={notes} onChange={setNotes} />

      <PromoForm />

      <ExpressForm value={isExpress} onChange={setIsExpress} />
      <PabiliForm
        value={isCashOnDelivery}
        amount={cashOnDelivery}
        onChange={setIsCashOnDelivery}
        onAmountChange={setCashOnDelivery}
      />
      <Text>{}</Text>
      <View style={{flex: 1}} />
      <BlackButton label="Next" onPress={onNext} />
      <View style={{height: 10}} />
      <PaymentSheet onChange={setCollectPaymentFrom} ref={paymentSheetRef} />
      <ItemSheet onChange={setItemDescription} ref={itemSheetRef} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(DeliveryDetails);

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    // alignItems: 'center',
    // backgroundColor: 'blue',
  },
});
