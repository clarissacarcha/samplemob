import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text, TextInput, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
import {LIGHT, FONT_MEDIUM, onError, FONT_REGULAR} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {GET_DELIVERY_PRICE_AND_DIRECTIONS} from '../../../../../graphql';
import {WhiteButton, BlackButton} from '../../../../../revamp';
//SELF IMPORTS
import {PaymentForm, PaymentSheet} from './PaymentForm';
import ExpressForm from './ExpressForm';
import {ItemDescriptionForm, ItemSheet} from './ItemDescriptionForm';
import {
  PartnerBranchItemDescriptionForm,
  PartnerBranchItemDescriptionBottomSheet,
} from './PartnerBranchItemDescriptionForm';
import {PartnerBranchTenantForm, PartnerBranchTenantBottomSheet} from './PartnerBranchTenantForm';
import NotesForm from './NotesForm';
import PabiliForm from './PabiliForm';
import PromoForm from './PromoForm';
import ItemsToPurchaseForm from './ItemsToPurchaseForm';
import {string} from 'prop-types';

const FORM_DATA = {description: '', quantity: ''};

const PabiliDetails = ({navigation, route, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Pabili', 'Information']} />,
  });

  const [collectPaymentFrom, setCollectPaymentFrom] = useState(route.params.orderData.collectPaymentFrom);
  const [itemDescription, setItemDescription] = useState(route.params.orderData.cargo);
  const [notes, setNotes] = useState(route.params.orderData.notes);
  const [isExpress, setIsExpress] = useState(route.params.orderData.isExpress);
  // const [isCashOnDelivery, setIsCashOnDelivery] = useState(route.params.orderData.isCashOnDelivery);
  const [cashOnDelivery, setCashOnDelivery] = useState(route.params.orderData.cashOnDelivery);
  const [itemsToPurchase, setItemsToPurchase] = useState([FORM_DATA]);
  const [selectedTenant, setSelectedTenant] = useState({name: ''});
  const [tenants, setTenants] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stringDescription, setStringDescription] = useState(null);

  const partnerBranch = route.params.partnerBranch;

  const paymentSheetRef = useRef();
  const partnerItemSheefRef = useRef();
  const itemSheetRef = useRef();
  const tenantSheetRef = useRef();

  const [getDeliveryPriceAndDirections, {loading}] = useLazyQuery(GET_DELIVERY_PRICE_AND_DIRECTIONS, {
    fetchPolicy: 'no-cache',
    onError: onError,
    onCompleted: (data) => {
      // console.log(JSON.stringify(data.getDeliveryPriceAndDirections, null, 4));
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
          description: stringDescription,
          isExpress,
          isCashOnDelivery: true,
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

  const cleanEmptyItemsToPurchase = (value) => {
    return value.filter((item) => item.description || item.quantity);
  };

  const verifyItemsToPurchase = (value) => {
    let verified = true;

    value.map((item) => {
      if (!item.description) verified = false;
      if (!item.quantity) verified = false;
    });

    return verified;
  };

  const formatItemsToPurchase = (value) => {
    return value.map((item) => `${item.quantity} - ${item.description}`);
  };

  const onConfirmPabiliInformation = () => {
    const cleanedItems = cleanEmptyItemsToPurchase(itemsToPurchase);

    if (cleanedItems.length < 1) {
      alert('Add item to purchase.');
      return;
    }

    const isItemsVerified = verifyItemsToPurchase(cleanedItems);

    if (!isItemsVerified) {
      alert('Complete item to purchase information.');
      return;
    }

    if (!cashOnDelivery) {
      alert('Enter estimated price.');
      return;
    }

    if (!itemDescription) {
      alert('Select item description.');
      return;
    }

    const formattedItems = formatItemsToPurchase(cleanedItems);

    const stringifiedItems = JSON.stringify({orders: formattedItems});

    setStringDescription(stringifiedItems);

    // console.log({stringifiedItems});

    route.params.setOrderData({
      ...route.params.orderData,
      collectPaymentFrom,
      itemDescription,
      notes,
      isExpress,
      isCashOnDelivery: true,
      cashOnDelivery,
      description: stringifiedItems,
    });

    const orderData = route.params.orderData;

    console.log({
      partnerBranchOrderId: selectedOrder.id,
      partnerBranchTenantId: selectedTenant.id,
    });

    getDeliveryPriceAndDirections({
      variables: {
        input: {
          consumerId: session.user.consumer.id,
          promoCode: '',
          // promoCode: bookingData.promoCode,
          isExpress: isExpress,
          isCashOnDelivery: true,
          partnerBranchOrderId: selectedOrder.id,
          partnerBranchTenantId: selectedTenant.id,
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

  const onPartnerBranchOrderSelect = (order) => {
    setItemDescription(order.cargo.type);
    setTenants(order.cargo.tenants);
    setSelectedOrder(order);
  };

  return (
    <>
      <ScrollView style={styles.screenBox} showsVerticalScrollIndicator={false}>
        <AlertOverlay visible={loading} />
        <View style={{height: 20}} />
        {/* <PromoForm /> */}
        {/* <PaymentForm value={collectPaymentFrom === 'SENDER' ? 'Sender' : 'Recipient'} bottomSheetRef={paymentSheetRef} /> */}
        {!partnerBranch && <ItemDescriptionForm value={itemDescription} bottomSheetRef={itemSheetRef} />}
        {partnerBranch && (
          <PartnerBranchItemDescriptionForm value={itemDescription} bottomSheetRef={partnerItemSheefRef} />
        )}
        {partnerBranch && <PartnerBranchTenantForm value={selectedTenant.name} bottomSheetRef={tenantSheetRef} />}

        {/* <Text> {JSON.stringify(partnerBranch, null, 4)}</Text> */}
        <ItemsToPurchaseForm initialData={itemsToPurchase} onDataChange={setItemsToPurchase} />
        <View style={{marginTop: 20}}>
          <Text style={{fontFamily: FONT.BOLD}}>Estimated Price of Items</Text>
          <View style={styles.spacing} />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={setCashOnDelivery}
            placeholder="Maximum: 2,000"
            placeholderTextColor={LIGHT}
          />
        </View>
        <NotesForm value={notes} onChange={setNotes} />
        <ExpressForm value={isExpress} onChange={setIsExpress} />
        {/* <PabiliForm
        value={isCashOnDelivery}
        amount={cashOnDelivery}
        onChange={setIsCashOnDelivery}
        onAmountChange={setCashOnDelivery}
      /> */}
      </ScrollView>
      <View style={{backgroundColor: 'white'}}>
        <View style={{backgroundColor: COLOR.ATHENS_GRAY, padding: 10}}>
          <BlackButton label="Confirm Pabili Information" onPress={onConfirmPabiliInformation} />
        </View>
      </View>
      <PaymentSheet onChange={setCollectPaymentFrom} ref={paymentSheetRef} />
      <ItemSheet onChange={setItemDescription} ref={itemSheetRef} />
      {partnerBranch && (
        <PartnerBranchItemDescriptionBottomSheet
          partnerOrders={partnerBranch.orders}
          onChange={onPartnerBranchOrderSelect}
          ref={partnerItemSheefRef}
        />
      )}

      {partnerBranch && (
        <PartnerBranchTenantBottomSheet tenants={tenants} ref={tenantSheetRef} onChange={setSelectedTenant} />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(PabiliDetails);

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    // alignItems: 'center',
    // backgroundColor: 'blue',
  },
  input: {
    height: 50,
    backgroundColor: COLOR.ATHENS_GRAY,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  spacing: {height: 2},
});
