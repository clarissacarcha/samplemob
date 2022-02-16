import React, {useCallback, useMemo, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TextInput, Modal, Image, TouchableOpacity, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import InputScrollView from 'react-native-input-scroll-view';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';
import {FONT_FAMILY} from '../../../../../res/constants';
import {COLOR, FONT} from '../../../../../res/variables';
import {GET_DELIVERY_PRICE_AND_DIRECTIONS, GET_TOKTOK_WALLET_BALANCE} from '../../../../../graphql';
import {WhiteButton, BlackButton, YellowButton} from '../../../../../revamp';
import {onErrorAlert} from '../../../../../util/ErrorUtility';
import {useAlert} from '../../../../../hooks';
import {numberFormat} from '../../../../../helper/numberFormat';

import ModalImage from '../../../../../assets/toktokwallet-assets/error.png';

const {width, height} = Dimensions.get('window');

const modalWidth = width - 120;

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

  const [walletBalance, setWalletBalance] = useState(0);
  const [balanceText, setBalanceText] = useState('');
  const [hasWallet, setHasWallet] = useState(null);

  const [initialPrice, setInitialPrice] = useState(route.params.quotation.pricing.price);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const quotationHash = route.params.quotation.hash;
  const quotationDirections = route.params.quotation.directions;

  const [getToktokWalletBalance] = useLazyQuery(GET_TOKTOK_WALLET_BALANCE, {
    fetchPolicy: 'network-only',
    onCompleted: res => {
      console.log({walletBalance: res.getToktokWalletBalance.balance});

      setHasWallet(res.getToktokWalletBalance.hasWallet);
      setBalanceText(numberFormat(res.getToktokWalletBalance.balance));
      setWalletBalance(res.getToktokWalletBalance.balance);
    },
  });

  useEffect(() => {
    if (parseFloat(balanceText.replace(/,/g, '')) < parseFloat(initialPrice)) {
      if (paymentMethod === 'TOKTOKWALLET') {
        setPaymentMethod('CASH');
        setIsModalVisible(true);
      }
    }
  }, [initialPrice, balanceText]);

  useEffect(() => {
    getToktokWalletBalance();

    console.log(JSON.stringify({params: route.params.quotation.hash}, null, 4));
  }, []);

  // const {
  //   data: balanceData,
  //   loading: balanceLoading,
  //   error: balanceError,
  // } = useQuery(GET_TOKTOK_WALLET_BALANCE, {
  //   fetchPolicy: 'network-only',
  //   onError: error => {
  //     console.log({retrieveBalanceError: error});
  //   },
  // });

  // let balanceText = '';
  // let hasWallet = false;

  // if (balanceError) {
  //   balanceText = 'Failed to retrieve balance.';
  //   // setBalanceText('Failed to retrieve balance.');
  // }

  // if (balanceLoading) {
  //   balanceText = 'Retrieving balance...';
  //   // setBalanceText('Retrieving balance...');
  // }

  // if (balanceData) {
  //   balanceText = balanceData.getToktokWalletBalance.balance;
  //   hasWallet = balanceData.getToktokWalletBalance.hasWallet;
  //   // setBalanceText(`${numberFormat(balanceData.getToktokWalletBalance.balance)}`);
  //   // setHasWallet(balanceData.getToktokWalletBalance.hasWallet);
  // }

  // useEffect(() => {
  //   if (balanceData) {
  //     setWalletBalance(balanceData.getToktokWalletBalance.balance);
  //   }
  // }, [balanceData]);

  const paymentMethodSheetRef = useRef();
  const paymentSheetRef = useRef();
  const itemSheetRef = useRef();

  const [getDeliveryPriceAndDirections, {loading}] = useLazyQuery(GET_DELIVERY_PRICE_AND_DIRECTIONS, {
    fetchPolicy: 'no-cache',
    onError: error => {
      onErrorAlert({alert: AlertHook, error});
    },
    onCompleted: data => {
      const {hash, pricing, directions} = data.getDeliveryPriceAndDirections;
      const {price, distance, duration, discount, expressFee} = pricing;

      let finalItemDescription = itemDescription;

      if (itemDescription === 'Others') {
        finalItemDescription = otherItem;
      }

      const routeParams = {
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
        walletBalance: walletBalance,
      };

      routeParams.orderData.directions = quotationDirections;

      navigation.push('DeliverySummary', routeParams);
    },
  });

  const [recomputeQuotation, {loading: recomputeLoading}] = useLazyQuery(GET_DELIVERY_PRICE_AND_DIRECTIONS, {
    fetchPolicy: 'no-cache',
    onError: error => {
      onErrorAlert({alert: AlertHook, error});
    },
    onCompleted: data => {
      setInitialPrice(data.getDeliveryPriceAndDirections.pricing.price);
    },
  });

  const onIsCashOnDeliveryChange = isCashOnDeliveryValue => {
    setIsCashOnDelivery(isCashOnDeliveryValue);

    if (isCashOnDeliveryValue) {
      setCollectPaymentFrom('RECIPIENT');
    }

    recomputeCashOnDelivery({isCashOnDelivery: isCashOnDeliveryValue});
  };

  const onCollectPaymentFromChange = collectPaymentFromValue => {
    if (isCashOnDelivery && collectPaymentFromValue === 'SENDER') {
      AlertHook({message: 'Cannot collect payment from sender on cash on deliveries.'});
      return;
    }
    setCollectPaymentFrom(collectPaymentFromValue);
  };

  const onPaymentMethodChange = paymentMethodValue => {
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
          quotationHash,
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

  const recomputeExpressDelivery = args => {
    const orderData = route.params.orderData;

    recomputeQuotation({
      variables: {
        input: {
          quotationHash,
          consumerId: session.user.consumer.id,
          vehicleTypeId: orderData.vehicleTypeId,
          promoCode: '',
          // promoCode: bookingData.promoCode,
          isExpress: args.isExpress,
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

  const recomputeCashOnDelivery = args => {
    const orderData = route.params.orderData;

    recomputeQuotation({
      variables: {
        input: {
          quotationHash,
          consumerId: session.user.consumer.id,
          vehicleTypeId: orderData.vehicleTypeId,
          promoCode: '',
          // promoCode: bookingData.promoCode,
          isExpress: isExpress,
          isCashOnDelivery: args.isCashOnDelivery,
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

  const onIsExpressChange = value => {
    setIsExpress(value);
    recomputeExpressDelivery({isExpress: value});
  };

  return (
    <>
      <View style={styles.screenBox}>
        <Modal visible={isModalVisible} transparent={true}>
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0,0,0,0.75)'}}>
            <View
              style={{
                width: modalWidth,
                borderRadius: 5,
                backgroundColor: 'white',
                padding: 20,
                alignItems: 'center',
              }}>
              <Image style={{height: 80, width: 80, marginBottom: 10}} source={ModalImage} />
              <Text style={{marginVertical: 10, fontFamily: FONT.BOLD, fontSize: 17}}>Insufficient Funds</Text>
              <Text style={{textAlign: 'center'}}>
                Please cash in to continue using toktokwallet. Payment method will be changed into cash.
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={{
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  width: 100,
                  backgroundColor: COLOR.YELLOW,
                  borderRadius: 5,
                }}>
                <Text style={{fontFamily: FONT_FAMILY.BOLD}}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{flex: 1}}>
          <InputScrollView showsVerticalScrollIndicator={false}>
            <AlertOverlay visible={loading || recomputeLoading} />
            <View style={{height: 10}} />
            <PaymentMethodForm
              value={paymentMethod === 'CASH' ? 'Cash' : 'toktokwallet'}
              bottomSheetRef={paymentMethodSheetRef}
            />
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

            <ExpressForm value={isExpress} onChange={onIsExpressChange} />
            <PabiliForm
              value={isCashOnDelivery}
              amount={cashOnDelivery}
              onChange={onIsCashOnDeliveryChange}
              onAmountChange={setCashOnDelivery}
            />
          </InputScrollView>
        </View>
        <View style={{backgroundColor: 'white', marginHorizontal: -16}}>
          <View style={{height: 5, backgroundColor: '#F7F7FA'}} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 15}}>
            <Text style={{color: COLOR.YELLOW, fontFamily: FONT.BOLD}}>Total</Text>
            {/* {!loading && !loadingInitial && (
              <Text style={{color: COLOR.YELLOW, fontFamily: FONT.BOLD}}>
                {initialPrice ? `PHP ${numberFormat(initialPrice - (selectedOrder === null ? 40 : 0))}` : ''}
              </Text>
            )} */}
            <Text style={{color: COLOR.YELLOW, fontFamily: FONT.BOLD}}>
              {initialPrice ? `PHP ${numberFormat(initialPrice)}` : ''}
            </Text>
          </View>
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
        // price={quotation.pricing.price}
        price={initialPrice}
        getWalletBalance={getToktokWalletBalance}
      />
      <ItemSheet onChange={setItemDescription} ref={itemSheetRef} />
    </>
  );
};

const mapStateToProps = state => ({
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
