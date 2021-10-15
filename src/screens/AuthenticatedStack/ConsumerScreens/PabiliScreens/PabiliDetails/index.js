import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {connect} from 'react-redux';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
import {LIGHT} from '../../../../../res/constants';
import {COLOR, FONT} from '../../../../../res/variables';
import {GET_DELIVERY_PRICE_AND_DIRECTIONS, GET_TOKTOK_WALLET_BALANCE} from '../../../../../graphql';
import {YellowButton} from '../../../../../revamp';
import InputScrollView from 'react-native-input-scroll-view';
import {onErrorAlert} from '../../../../../util/ErrorUtility';
import {numberFormat} from '../../../../../helper/numberFormat';
import {useAlert} from '../../../../../hooks';
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
import ItemsToPurchaseForm from './ItemsToPurchaseForm';
import {PaymentMethodForm, PaymentMethodSheet} from './PaymentMethod';

const FORM_DATA = {description: '', quantity: ''};

const PabiliDetails = ({navigation, route, session, constants}) => {
  navigation.setOptions({
    headerLeft: () => (
      <HeaderBack
        onBack={() => {
          const noSenderOrderData = {
            ...route.params.orderData,
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
          };

          route.params.setOrderData(noSenderOrderData);

          navigation.pop();
        }}
      />
    ),
    headerTitle: () => <HeaderTitle label={['Pabili', 'Information']} />,
  });

  const AlertHook = useAlert();
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [collectPaymentFrom, setCollectPaymentFrom] = useState(route.params.orderData.collectPaymentFrom);
  const [itemDescription, setItemDescription] = useState(route.params.orderData.cargo);
  const [otherItem, setOtherItem] = useState('');
  const [notes, setNotes] = useState(route.params.orderData.notes);
  const [isExpress, setIsExpress] = useState(route.params.orderData.isExpress);
  // const [isCashOnDelivery, setIsCashOnDelivery] = useState(route.params.orderData.isCashOnDelivery);
  const [cashOnDelivery, setCashOnDelivery] = useState(route.params.orderData.cashOnDelivery);
  const [itemsToPurchase, setItemsToPurchase] = useState([FORM_DATA]);
  const [selectedTenant, setSelectedTenant] = useState({name: ''});
  const [tenants, setTenants] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stringDescription, setStringDescription] = useState(null);
  const maxValue = constants.maxCashOnDelivery;
  const [partnerBranch, setPartnerBranch] = useState(null);
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

  useEffect(() => {
    if (route.params.partnerBranch) {
      const filteredOrders = route.params.partnerBranch.orders.filter((order) => {
        return order.cargo.tenants.length > 0;
      });

      const cleanPartner = {
        ...route.params.partnerBranch,
        orders: filteredOrders,
      };
      setPartnerBranch(cleanPartner);
    }
  }, []);

  const paymentMethodSheetRef = useRef();
  const paymentSheetRef = useRef();
  const partnerItemSheefRef = useRef();
  const itemSheetRef = useRef();
  const tenantSheetRef = useRef();

  const [getDeliveryPriceAndDirections, {loading}] = useLazyQuery(GET_DELIVERY_PRICE_AND_DIRECTIONS, {
    fetchPolicy: 'no-cache',
    onError: (error) => {
      onErrorAlert({alert: AlertHook, error});
    },
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

      let finalItemDescription = itemDescription;

      if (itemDescription === 'Others') {
        finalItemDescription = otherItem;
      }

      navigation.push('DeliverySummary', {
        orderData: {
          ...route.params.orderData,
          paymentMethod,
          collectPaymentFrom,
          cargo: finalItemDescription,
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
      if (!item.description) {
        verified = false;
      }
      if (!item.quantity) {
        verified = false;
      }
    });

    return verified;
  };

  const formatItemsToPurchase = (value) => {
    return value.map((item) => `${item.quantity} - ${item.description}`);
  };

  const onConfirmPabiliInformation = () => {
    const cleanedItems = cleanEmptyItemsToPurchase(itemsToPurchase);

    const isItemsVerified = verifyItemsToPurchase(cleanedItems);

    let finalItemDescription = itemDescription;

    if (!partnerBranch) {
      if (!itemDescription) {
        AlertHook({message: 'Select item description.'});
        return;
      }

      if (itemDescription === 'Others' && otherItem === '') {
        AlertHook({message: 'Describe your item.'});
        return;
      }

      if (itemDescription === 'Others') {
        finalItemDescription = otherItem;
      }
    }
    if (partnerBranch) {
      if (!selectedOrder) {
        AlertHook({message: 'Select service type.'});
        return;
      }

      if (!selectedTenant.name) {
        AlertHook({message: 'Select store.'});
        return;
      }
    }

    if (cleanedItems.length < 1) {
      AlertHook({message: 'Add item to purchase.'});
      return;
    }

    if (!isItemsVerified) {
      AlertHook({message: 'Complete item to purchase information.'});
      return;
    }

    if (!cashOnDelivery) {
      AlertHook({message: 'Enter estimated price of items.'});
      return;
    }

    if (cashOnDelivery < 1) {
      AlertHook({message: 'Enter estimated price of items must be greater than or equal to PHP 1.00'});
      return;
    }

    const formattedItems = formatItemsToPurchase(cleanedItems);

    const stringifiedItems = JSON.stringify({orders: formattedItems});

    setStringDescription(stringifiedItems);

    // console.log({stringifiedItems});

    route.params.setOrderData({
      ...route.params.orderData,
      paymentMethod,
      collectPaymentFrom,
      itemDescription: finalItemDescription,
      notes,
      isExpress,
      isCashOnDelivery: true,
      cashOnDelivery,
      description: stringifiedItems,
    });

    const orderData = route.params.orderData;

    getDeliveryPriceAndDirections({
      variables: {
        input: {
          consumerId: session.user.consumer.id,
          promoCode: '',
          // promoCode: bookingData.promoCode,
          isExpress: isExpress,
          isCashOnDelivery: true,
          paymentMethod,
          partnerBranchOrderId: selectedOrder ? selectedOrder.id : null,
          partnerBranchTenantId: selectedTenant ? selectedTenant.id : null,
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

  const onPaymentMethodChange = (paymentMethodValue) => {
    // if (isCashOnDelivery && collectPaymentFromValue === 'SENDER') {
    //   AlertHook({message: 'Cannot collect payment from sender on cash on deliveries.'});
    //   return;
    // }
    setPaymentMethod(paymentMethodValue);
  };

  const onPartnerBranchOrderSelect = (order) => {
    if (!selectedOrder) {
      setItemDescription(order.cargo.type);
      setTenants(order.cargo.tenants);
      setSelectedOrder(order);
      setSelectedTenant({name: ''});
    } else {
      if (selectedOrder.cargo.type != order.cargo.type) {
        setItemDescription(order.cargo.type);
        setTenants(order.cargo.tenants);
        setSelectedOrder(order);
        setSelectedTenant({name: ''});
      }
    }
  };

  const onCashOnDeliveryValueChange = (value) => {
    const decimal = value.split('.')[1];

    if (isNaN(value)) {
      AlertHook({message: 'Please enter a valid amount.'});

      setCashOnDelivery(''); //force clear
      return;
    }

    if (value && decimal) {
      if (decimal.toString().length > 2) {
        setCashOnDelivery(cashOnDelivery); //force no change
        return;
      }
    }

    if (parseFloat(value) >= parseFloat(maxValue)) {
      setCashOnDelivery(maxValue); //force max amount

      return;
    }

    setCashOnDelivery(value);
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}}>
          <InputScrollView contentContainerStyle={styles.screenBox} showsVerticalScrollIndicator={false}>
            <AlertOverlay visible={loading} />
            <View style={{height: 20}} />
            {/* <PromoForm /> */}
            {/* <PaymentMethodForm
              value={paymentMethod === 'CASH' ? 'Cash' : 'toktokwallet'}
              bottomSheetRef={paymentMethodSheetRef}
            /> */}
            {/* <PaymentForm value={collectPaymentFrom === 'SENDER' ? 'Sender' : 'Recipient'} bottomSheetRef={paymentSheetRef} /> */}
            {!partnerBranch && (
              <ItemDescriptionForm
                value={itemDescription}
                bottomSheetRef={itemSheetRef}
                otherItem={otherItem}
                onOtherItemChange={setOtherItem}
              />
            )}
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
                value={cashOnDelivery}
                keyboardType="number-pad"
                returnKeyType="done"
                onChangeText={onCashOnDeliveryValueChange}
                placeholder="Maximum: 2,000"
                placeholderTextColor={LIGHT}
              />
            </View>
            <NotesForm value={notes} onChange={setNotes} />
            <ExpressForm value={isExpress} onChange={setIsExpress} />
          </InputScrollView>
        </View>
        <View style={{backgroundColor: COLOR.LIGHT}}>
          <YellowButton label="Confirm Pabili Information" onPress={onConfirmPabiliInformation} style={{margin: 16}} />
        </View>
      </View>
      <PaymentMethodSheet
        onChange={onPaymentMethodChange}
        ref={paymentMethodSheetRef}
        balanceText={balanceText}
        hasWallet={hasWallet}
      />
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
  constants: state.constants,
});

export default connect(mapStateToProps, null)(PabiliDetails);

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingHorizontal: 10,
    // alignItems: 'center',
    // backgroundColor: 'blue',
  },
  input: {
    height: 50,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  spacing: {height: 2},
});
