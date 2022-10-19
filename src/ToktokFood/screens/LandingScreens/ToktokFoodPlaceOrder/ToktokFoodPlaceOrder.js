/**
 * @format
 * @flow
 */

import React, {useState, useRef} from 'react';
import type {PropsType} from './types';
import {
  Container,
  ComponentContainer,
  HeaderContainer,
  PlaceOrderHeader,
  DividerContainer,
  PabiliTCContainer,
} from './Styled';
import {
  CartEmpty,
  CartIconText,
  CartServiceType,
  CartVoucher,
  CartPaymentMethod,
  CartAmount,
  CartDriverNote,
  CartPlaceOrder,
} from 'toktokfood/compositions/Cart';
import {OrderSummary} from 'toktokfood/compositions/Order';
import Divider from 'toktokfood/components/Divider';
import {location_pin_ic, carbon_user_filled, carbon_marker_filled} from 'toktokfood/assets/images';
import {useGetCartItems, useGetShopDetails} from 'toktokfood/hooks';
import StyledText from 'toktokfood/components/StyledText';
import {useTheme} from 'styled-components';
import {TouchableOpacity, Animated} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';

const ToktokFoodPlaceOrder = (props: PropsType): React$Node => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [cartServiceType, setCartServiceType] = useState('Delivery');
  const [errorVoucherMessage, setErrorVoucherMessage] = useState('');
  const [cartPaymentMethod, setCartPaymentMethod] = useState('toktokwallet');
  const [cartDriverNote, setCartDriverNote] = useState('');
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartDeliveryInfo, setCartDeliveryInfo] = useState({});
  const [userWallet, setUserWallet] = useState({});
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [cartPaymentMethodCoordinates, setCartPaymentMethodCoordinates] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  const scrollViewRef = useRef(null);
  const {cartData, cartRefetch, deliveryReceiver, receiverContact, receiverAddress, receiverLandmark} =
    useGetCartItems();
  const {shopDetails} = useGetShopDetails(cartData?.items[0]?.shopid);

  const renderCartIconTextComponent = (
    id = 1,
    source = null,
    title = '',
    text = '',
    landmark = '',
    contactNumber = '',
    name = '',
  ) => {
    return (
      <CartIconText
        id={id}
        source={source}
        title={title}
        text={text}
        landmark={landmark}
        contactNumber={contactNumber}
        name={name}
        cartRefetch={cartRefetch}
      />
    );
  };

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const endAnimation = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const renderCustomerInfoComponent = () => (
    <React.Fragment>
      {renderCartIconTextComponent(
        1,
        location_pin_ic,
        shopDetails?.getShopDetails?.shopname,
        shopDetails?.getShopDetails?.address,
      )}
      {cartServiceType === 'Delivery' &&
        renderCartIconTextComponent(
          2,
          carbon_marker_filled,
          'Delivery Address',
          receiverAddress,
          receiverLandmark,
          receiverContact,
          deliveryReceiver,
        )}
    </React.Fragment>
  );

  const renderOrderListComponent = () => {
    return (
      <React.Fragment>
        <ComponentContainer flexDirection="row" justifyContent="space-between">
          <StyledText mode="semibold">My Orders</StyledText>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ToktokFoodShopOverview', {item: shopDetails?.getShopDetails})}>
            <StyledText color={theme.color.orange}>Add Items</StyledText>
          </TouchableOpacity>
        </ComponentContainer>
        <DividerContainer>
          <Divider />
        </DividerContainer>
        <OrderSummary state={cartData?.items} cartRefetch={cartRefetch} />
      </React.Fragment>
    );
  };

  if (cartData?.items?.length > 0) {
    return (
      <Container>
        <HeaderContainer>
          <PlaceOrderHeader hasBack title="Cart" />
        </HeaderContainer>
        <KeyboardAwareScrollView ref={scrollViewRef}>
          <ComponentContainer>
            {renderCustomerInfoComponent()}
            <Divider />
            <CartServiceType
              cartServiceType={cartServiceType}
              setCartServiceType={setCartServiceType}
              allowPickup={shopDetails?.getShopDetails?.allowPickup}
              isPabiliMerchant={cartData?.pabiliShopDetails?.isShopPabiliMerchant}
            />
          </ComponentContainer>
          <Divider height={8} />
          {renderOrderListComponent()}
          <Divider height={8} />
          <CartVoucher
            paymentMethod={cartPaymentMethod}
            cartItems={cartData?.items}
            totalAmount={cartData?.totalAmountWithAddons}
            deliveryFee={cartDeliveryInfo?.price}
            errorVoucherMessage={errorVoucherMessage}
            setErrorVoucherMessage={setErrorVoucherMessage}
          />
          <Divider height={8} />
          <CartPaymentMethod
            cartPaymentMethod={cartPaymentMethod}
            setCartPaymentMethod={setCartPaymentMethod}
            setCartPaymentMethodCoordinates={setCartPaymentMethodCoordinates}
            animation={animation}
            setUserWallet={setUserWallet}
            isInsufficientBalance={isInsufficientBalance}
            amountText={cartTotalAmount}
            setErrorVoucherMessage={setErrorVoucherMessage}
          />
          <Divider height={8} />
          <CartAmount
            subTotal={cartData?.totalAmountWithAddons}
            paymentMethod={cartPaymentMethod}
            cartItems={cartData?.items}
            shippingType={cartServiceType}
            totalAmount={cartData?.totalAmount}
            srpTotalAmount={cartData?.srpTotalAmount}
            pabiliShopDetails={cartData?.pabiliShopDetails}
            setCartTotalAmount={setCartTotalAmount}
            setCartDeliveryInfo={setCartDeliveryInfo}
            pabiliShopServiceFee={cartData?.pabiliShopServiceFee}
            pabiliShopResellerDiscount={cartData?.pabiliShopResellerDiscount}
          />
          {cartServiceType === 'Delivery' && (
            <React.Fragment>
              <Divider height={8} />
              <CartDriverNote cartDriverNote={cartDriverNote} setCartDriverNote={setCartDriverNote} />
            </React.Fragment>
          )}
          {cartData?.pabiliShopDetails?.isShopPabiliMerchant && (
            <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ToktokFoodTermsAndConditions')}>
              <PabiliTCContainer>
                <StyledText color={theme.color.darkgray} fontSize={11}>
                  Prices and availability are subject to change without prior notice. By placing this order, you agree
                  with{' '}
                  <StyledText fontSize={11} color={theme.color.orange}>
                    Terms & Conditions.
                  </StyledText>
                </StyledText>
              </PabiliTCContainer>
            </TouchableOpacity>
          )}
        </KeyboardAwareScrollView>
        <CartPlaceOrder
          amountText={cartTotalAmount}
          cartData={cartData}
          paymentMethod={cartPaymentMethod}
          scroll={scrollViewRef.current}
          cartPaymentMethodCoordinates={cartPaymentMethodCoordinates}
          startAnimation={startAnimation}
          endAnimation={endAnimation}
          deliveryReceiver={deliveryReceiver}
          receiverContact={receiverContact}
          receiverLandmark={receiverLandmark}
          cartServiceType={cartServiceType}
          cartDriverNote={cartDriverNote}
          cartDeliveryInfo={cartDeliveryInfo}
          userWallet={userWallet}
          setIsInsufficientBalance={setIsInsufficientBalance}
          cartRefetch={cartRefetch}
        />
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <PlaceOrderHeader hasBack title="Cart" />
      </HeaderContainer>
      <CartEmpty />
    </Container>
  );
};

export default ToktokFoodPlaceOrder;
