import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Dimensions, View, Alert} from 'react-native';
import {connect} from 'react-redux';

import InputScrollView from 'react-native-input-scroll-view';
import {useLazyQuery} from '@apollo/react-hooks';

import {GET_DELIVERY_PRICE_AND_DIRECTIONS} from '../../../../../graphql';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
import {COLOR, DARK, MEDIUM} from '../../../../../res/constants';
import {onError} from '../../../../../util/ErrorUtility';

import {
  BlackButton,
  CollectPaymentFromInput,
  CashOnDeliveryInput,
  ExpressFeeSwitch,
  ItemDescriptionInput,
  LabelTextInput,
  OrderTypeInput,
} from '../../../../../components/forms';

//SELF IMPORTS
import SenderDetailsCard from './SenderDetailsCard';
import RecipientDetailsCard from './RecipientDetailsCard';

const width = Dimensions.get('window').width;
const itemDimension = (width - 120) / 5;

const DeliveryDetails = ({navigation, route, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Order', 'Details']} />,
  });
  const scrollRef = useRef(null);
  const [bookingData, setBookingData] = useState(route.params.bookingData);

  const [getDeliveryPriceAndDirections, {loading}] = useLazyQuery(GET_DELIVERY_PRICE_AND_DIRECTIONS, {
    fetchPolicy: 'no-cache',

    onError: onError,
    onCompleted: (data) => {
      const {hash, pricing, directions} = data.getDeliveryPriceAndDirections;

      const {price, distance, duration, discount, expressFee} = pricing;

      console.log({hash});

      const updatedBookingData = {
        ...bookingData,
        hash,
        price,
        discount,
        distance,
        duration,
        directions,
      };

      navigation.navigate('ConsumerMap', {callbackData: updatedBookingData});
    },
  });

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollRef.current.scrollToEnd();
    }, 50);
  };

  const onBookingDataChange = (value) => {
    setBookingData((prevState) => ({...prevState, ...value}));
  };

  const onUpdatedSenderStop = (value) => {
    const updatedSenderStop = {
      ...bookingData,
      senderStop: value,
    };

    setBookingData(updatedSenderStop);
  };

  const onUpdatedRecipientStop = ({recipientStop, index}) => {
    const updatedRecipientStop = {
      ...bookingData,
    };
    updatedRecipientStop.recipientStop[index] = recipientStop;
    setBookingData(updatedRecipientStop);
  };

  // See changes in bookingData
  // useEffect(() => {
  //   const dx = {...bookingData};
  //   delete dx.directions;
  //   console.log(JSON.stringify(dx, null, 4));
  // }, [bookingData]);

  //Handles navigating back with data
  useEffect(() => {
    const {updatedSenderStop, updatedRecipientStop} = route.params;

    console.log(JSON.stringify({SENDER: route.params.updatedSenderStop}, null, 4));
    console.log(JSON.stringify({RECIPIENT: route.params.updatedRecipientStop}, null, 4));

    if (updatedSenderStop) {
      onUpdatedSenderStop(updatedSenderStop);
    }

    if (updatedRecipientStop) {
      onUpdatedRecipientStop(updatedRecipientStop);
    }
  }, [route.params]);

  const onOrderTypeChange = ({orderType, scheduledDate}) => {
    const updatedBookingData = {...bookingData, orderType, scheduledDate};
    if (orderType === 'SCHEDULED') {
      updatedBookingData.senderStop.scheduledFrom = `${scheduledDate} 00:00:00`;
      updatedBookingData.senderStop.scheduledTo = `${scheduledDate} 23:59:59`;
      updatedBookingData.recipientStop[0].scheduledFrom = `${scheduledDate} 00:00:00`;
      updatedBookingData.recipientStop[0].scheduledTo = `${scheduledDate} 23:59:59`;
    }
    if (orderType === 'ASAP') {
      updatedBookingData.senderStop.scheduledFrom = null;
      updatedBookingData.senderStop.scheduledTo = null;
      updatedBookingData.recipientStop[0].scheduledFrom = null;
      updatedBookingData.recipientStop[0].scheduledTo = null;
    }
    updatedBookingData.senderStop.orderType = orderType;
    updatedBookingData.recipientStop[0].orderType = orderType;
    setBookingData(updatedBookingData);
  };

  const onConfirm = () => {
    if (!bookingData.recipientStop[0].formattedAddress) {
      Alert.alert('', 'Please enter recipient details');
      return;
    }

    if (!bookingData.cargo) {
      Alert.alert('', 'Please select item description');
      return;
    }

    if (bookingData.orderType === 'SCHEDULED' && bookingData.promoCode !== '') {
      Alert.alert('', 'Promo Codes can only be used on As Soon As Possible Order Type.');
      return;
    }

    getDeliveryPriceAndDirections({
      variables: {
        input: {
          consumerId: session.user.consumer.id,
          senderNumber: bookingData.senderStop.mobile,
          referralCode: session.user.consumer.referralCode ? session.user.consumer.referralCode : '',
          promoCode: bookingData.promoCode,
          isExpress: bookingData.isExpress,
          origin: {
            latitude: bookingData.senderStop.latitude,
            longitude: bookingData.senderStop.longitude,
          },
          destinations: [
            {
              latitude: bookingData.recipientStop[0].latitude,
              longitude: bookingData.recipientStop[0].longitude,
            },
          ],
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={loading} />
      <InputScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardOffset={20}
        contentContainerStyle={styles.scrollView}>
        <SenderDetailsCard bookingData={bookingData} marginBottom />

        <RecipientDetailsCard bookingData={bookingData} marginBottom />

        <OrderTypeInput
          initialData={{orderType: bookingData.orderType, scheduledDate: bookingData.scheduledDate}}
          onChange={onOrderTypeChange}
          marginBottom
        />

        <CollectPaymentFromInput
          initialValue={bookingData.collectPaymentFrom}
          isCashOnDelivery={bookingData.isCashOnDelivery}
          onChange={(value) => onBookingDataChange({collectPaymentFrom: value})}
          marginBottom
        />

        <ExpressFeeSwitch
          initialValue={bookingData.isExpress}
          onChange={(value) => onBookingDataChange({isExpress: value})}
          marginBottom
        />

        <CashOnDeliveryInput
          initialValue={bookingData.cashOnDelivery}
          onSwitchChange={(value) => onBookingDataChange({isCashOnDelivery: value})}
          onAmountChange={(value) => onBookingDataChange({cashOnDelivery: value})}
          marginBottom
        />

        {/*-------------------- ITEM DESCRIPTION --------------------*/}
        <ItemDescriptionInput
          onChange={(value) => onBookingDataChange({cargo: value})}
          initialValue={bookingData.cargo}
          scrollToEnd={scrollToEnd}
          marginBottom
        />

        {/*-------------------- NOTES --------------------*/}
        <LabelTextInput
          label="Notes"
          value={bookingData.notes}
          onChange={(value) => onBookingDataChange({notes: value})}
          placeholder="Notes to rider"
          marginBottom
        />

        {/*-------------------- PROMO CODE --------------------*/}
        <LabelTextInput
          label="Promo Code"
          value={bookingData.promoCode}
          onChange={(value) => onBookingDataChange({promoCode: value})}
          placeholder="Enter Promo Code"
          marginBottom
        />

        {/*-------------------- CONFIRM --------------------*/}
        <BlackButton onPress={onConfirm} label="Next" containerStyle={styles.blackButton} />
      </InputScrollView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(DeliveryDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  blackButton: {
    marginTop: 0,
  },
  scrollView: {
    padding: 20,
  },
  map: {
    flex: 1,
  },
  addressBox: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: COLOR,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    height: 50,
    color: DARK,
    backgroundColor: 'white',
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  itemType: {
    height: itemDimension,
    width: itemDimension,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
