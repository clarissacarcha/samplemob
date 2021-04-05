import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {COLOR, LIGHT, ORANGE} from '../../../../../res/constants';

import {WhiteButton, BlackButton} from '../../../../../revamp';

//SELF IMPORTS
import Greeting from './Greeting';

const ToktokDelivery = ({navigation, session}) => {
  const INITIAL_ORDER_DATA = {
    hash: '',
    consumerId: session.user.consumer.id,
    price: 0,
    discount: 0,
    distance: 0,
    duration: 0,
    directions: null,
    collectPaymentFrom: 'SENDER',
    isCashOnDelivery: false,
    cashOnDelivery: 0,
    isExpress: false,
    cargo: '',
    notes: '',
    promoCode: '',
    orderType: 'ASAP',
    scheduledDate: moment().format('YYYY-MM-DD').toString(),
    senderStop: {
      latitude: null,
      longitude: null,
      formattedAddress: '',
      name: `${session.user.person.firstName} ${session.user.person.lastName}`,
      mobile: session.user.username.replace('+63', ''),
      landmark: '',
      orderType: 'ASAP',
      scheduledFrom: null,
      scheduledTo: null,
    },
    recipientStop: [
      {
        latitude: null,
        longitude: null,
        formattedAddress: '',
        name: '',
        mobile: '',
        landmark: '',
        orderType: 'ASAP',
        scheduledFrom: null,
        scheduledTo: null,
      },
    ],
  };

  const [orderData, setOrderData] = useState(INITIAL_ORDER_DATA);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Toktok', 'Delivery']} />,
  });

  const bottomSheetRef = useRef();

  const snapPoints = useMemo(() => [0, 200], []);

  const onSenderConfirm = (value) => {
    console.log('ON SENDER CONFIRM');
    console.log(value);

    setOrderData({
      ...orderData,
      senderStop: value,
    });
  };

  const onRecipientConfirm = (value) => {
    console.log('ON SENDER CONFIRM');
    console.log(value);

    setOrderData({
      ...orderData,
      recipientStop: [value],
    });
  };

  return (
    <View style={styles.screenBox}>
      <Greeting />

      <WhiteButton
        label="Pick Up Time"
        prefixSet="Material"
        prefixName="access-time"
        suffixSet="Material"
        suffixName="arrow-forward"
        onPress={() => {
          bottomSheetRef.current.expand();
        }}
      />
      <View style={{marginTop: 20, borderWidth: 1, borderColor: COLOR, borderRadius: 5}}>
        <WhiteButton
          label={orderData.senderStop.formattedAddress ? orderData.senderStop.formattedAddress : 'Pick Up Location'}
          description={`${orderData.senderStop.name} | +63${orderData.senderStop.mobile}`}
          prefixSet="Material"
          prefixName="timer"
          borderless
          onPress={() => {
            navigation.push('StopDetails', {stopData: orderData.senderStop, onStopConfirm: onSenderConfirm});
          }}
          style={{paddingLeft: 10}}
        />
        <View
          style={{
            marginHorizontal: 10,
            borderColor: LIGHT,
            borderStyle: 'dashed',
            borderRadius: 1,
            borderWidth: 1,
            borderTopWidth: 0,
          }}
        />
        <WhiteButton
          label={
            orderData.recipientStop[0].formattedAddress
              ? orderData.recipientStop[0].formattedAddress
              : 'Drop Off Location'
          }
          prefixSet="Material"
          prefixName="timer"
          borderless
          onPress={() => {
            navigation.push('StopDetails', {
              stopData: orderData.recipientStop[0],
              onStopConfirm: onRecipientConfirm,
            });
          }}
          style={{paddingLeft: 10}}
        />
      </View>
      <View style={{flex: 1}} />
      <BlackButton
        label="Next"
        onPress={() => {
          navigation.push('DeliveryDetails');
        }}
      />
      <View style={{height: 10}} />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        handleComponent={() => (
          <View
            style={{
              height: 20,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              borderTopWidth: 3,
              borderRightWidth: 2,
              borderLeftWidth: 2,
              borderColor: ORANGE,
              marginHorizontal: -2,
            }}
          />
        )}
        backdropComponent={BottomSheetBackdrop}>
        <View style={styles.contentContainer}>
          <Text>Pick Up Time</Text>
          <View style={{height: 10}} />
          <WhiteButton label="ASAP" prefixSet="Material" prefixName="timer" borderless onPress={() => {}} />
          <WhiteButton
            label="Scheduled"
            prefixSet="MaterialCommunity"
            prefixName="calendar-month"
            borderless
            onPress={() => {}}
          />
          <View style={{height: 10}} />
          <BlackButton label="Confirm" onPress={() => {}} />
        </View>
      </BottomSheet>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokDelivery);

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
