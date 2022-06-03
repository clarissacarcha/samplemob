/**
 * @format
 * @flow
 */

import React, {useEffect, useState, useCallback} from 'react';
import type {PropsType} from './types';
import {
  Container,
  AnimationContainer,
  BottomContainer,
  ButtonContainer,
  Button,
  AmountContainer,
  CustomModal,
  OrderDetailsHeader,
  HeaderContainer,
  Scroll,
  ModifiedContainer,
  Icon,
  ModifiedText,
} from './Styled';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {GET_ORDER_TRANSACTION_BY_REF_NUM, GET_RIDER_DETAILS} from 'toktokfood/graphql/toktokfood';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import Header from 'toktokfood/components/Header';
import Alert from 'toktokfood/components/Alert';
import Divider from 'toktokfood/components/Divider';
import StyledButton from 'toktokfood/components/StyledButton';
import {
  OrderAnimatedImage,
  OrderAnimatedText,
  OrderAddresses,
  OrderAmount,
  OrderReferenceNumber,
  OrderDriverDetails,
  OrderInformation,
  OrderSummary,
  OrderNote,
  OrderDeliveryLogs,
} from 'toktokfood/compositions/Order';
import {useTheme} from 'styled-components';
import {useNavigation} from '@react-navigation/native';

const ToktokFoodOrder = (props: PropsType): React$Node => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const orderStatusFromRoute = route.params.orderStatus;
  const isCompletedOrCancelled = orderStatusFromRoute === 'c' || orderStatusFromRoute === 's';
  const theme = useTheme();
  const navigation = useNavigation();
  const [state, setState] = useState({});
  const [riderDetails, setRiderDetails] = useState({});
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [polled, setPolled] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  //fetch order details
  const [getOrderDetails, {startPolling, stopPolling}] = useLazyQuery(GET_ORDER_TRANSACTION_BY_REF_NUM, {
    fetchPolicy: 'cache-and-network',
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: error => console.log('getOrderDetails', error),
    onCompleted: ({getTransactionByRefNum}) => {
      const {orderStatus, orderIsfor, tDeliveryId} = getTransactionByRefNum;
      const isDelivery = orderIsfor === 1;
      const isOrderCompletedOrCancelled = orderStatus === 'c' || orderStatus === 's';
      if (isOrderCompletedOrCancelled) {
        stopPolling();
        if (polled) {
          setIsAlertVisible(true);
        }
      } else {
        startPolling(10000);
        setPolled(true);
        console.log('fetching orders...', orderStatus);
      }
      setState(getTransactionByRefNum);
      if (isDelivery && tDeliveryId) {
        fetchRiderDetails(tDeliveryId);
      }
    },
  });

  const [getToktokFoodRiderDetails] = useLazyQuery(GET_RIDER_DETAILS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getDeliveryDetails}) => {
      setRiderDetails(getDeliveryDetails);
    },
  });

  const fetchOrderDetails = useCallback(
    referenceNum => {
      getOrderDetails({variables: {input: {referenceNum}}});
    },
    [getOrderDetails],
  );

  const fetchRiderDetails = useCallback(
    deliveryId => {
      getToktokFoodRiderDetails({variables: {input: {deliveryId}}});
    },
    [getToktokFoodRiderDetails],
  );

  useEffect(() => {
    if (isFocused && route.params) {
      const {referenceNum, orderStatus} = route.params;
      if (orderStatus === 'c' || orderStatus === 's') {
        setShowOrderDetails(true);
      }
      fetchOrderDetails(referenceNum);
    }
  }, [fetchOrderDetails, isFocused, route.params]);

  const onBackOrderDetails = () => {
    if (state?.orderStatus === 'c' || state?.orderStatus === 's') {
      navigation.pop();
    } else {
      setShowOrderDetails(false);
    }
  };

  const isOrderModified = () => {
    if (state?.orderDetails) {
      const orderDetailsItems = state?.orderDetails;
      const evalEditResult = orderDetailsItems.filter(items => items.isModified === true); // true means modified
      const evalRemovedResult = orderDetailsItems.filter(items => items.status === 0); // zero means removed

      return evalRemovedResult.length > 0 || evalEditResult.length > 0;
    }
    return false;
  };

  const renderModifiedTextComponent = (adjustSpacing = false) => {
    return (
      isOrderModified() && (
        <ModifiedContainer adjustSpacing={adjustSpacing}>
          <Icon name="info" size={14} color={theme.color.orange} />
          <ModifiedText>
            {state?.paymentMethod.toLowerCase() === 'toktokwallet'
              ? 'This order has been modified by merchant. Total refund amount for updated order should be credited to your toktokwallet account.'
              : 'Total amount for this order has been updated.'}
          </ModifiedText>
        </ModifiedContainer>
      )
    );
  };

  const renderAlertComponent = () => (
    <Alert
      isVisible={isAlertVisible}
      type="success"
      title="Order Delivered"
      subtitle="Yay! Craving satisfied. Thank you for ordering in toktokfood!"
      onPress={() => navigation.pop()}
    />
  );

  const renderAnimationComponent = () => {
    if (!isCompletedOrCancelled) {
      return (
        <React.Fragment>
          <Header hasBack />
          <Container>
            {/* Animation Part */}
            <AnimationContainer>
              <OrderAnimatedImage state={{...state, riderDetails}} />
              <OrderAnimatedText state={{...state, riderDetails}} />
            </AnimationContainer>

            {/* Bottom Part */}
            <BottomContainer>
              {/* Shop and customer address */}
              <OrderAddresses state={state} />
              <Divider />
              {renderModifiedTextComponent()}
              {/* Amount and its breakdown */}
              <AmountContainer>
                <OrderAmount state={state} />
              </AmountContainer>
              {/* Buttons for order details and cancel order */}
              <ButtonContainer>
                <Button orderStatus={state?.orderStatus} onPress={() => setShowOrderDetails(true)}>
                  See Order Details
                </Button>
                {state?.orderStatus === 'p' && (
                  <StyledButton type="secondary" onPress={() => console.log('cancel')}>
                    Cancel
                  </StyledButton>
                )}
              </ButtonContainer>
            </BottomContainer>
          </Container>
        </React.Fragment>
      );
    }
  };

  const renderModalComponent = () => {
    const animationIn = isCompletedOrCancelled ? 'slideInRight' : 'slideInUp';
    return (
      <CustomModal isVisible={showOrderDetails} customBackdrop={<Container />} flex={1} animationIn={animationIn}>
        <HeaderContainer>
          <OrderDetailsHeader hasBack backButtonFn={onBackOrderDetails} />
        </HeaderContainer>
        <Scroll>
          <OrderReferenceNumber state={state} />
          {riderDetails?.driver && <OrderDriverDetails state={riderDetails} />}
          <Divider height={8} />
          <OrderInformation state={{...state, riderDetails}} />
          {renderModifiedTextComponent(true)}
          <OrderSummary state={state?.orderDetails} />
          {state?.notes?.length > 0 && <OrderNote state={state} />}
          <OrderAddresses state={state} />
          <Divider />
          {/* Amount and its breakdown */}
          <AmountContainer marginBottom={20}>
            <OrderAmount state={state} />
          </AmountContainer>
          <Divider height={8} />
          <OrderDeliveryLogs state={state} />
        </Scroll>
        {renderAlertComponent()}
      </CustomModal>
    );
  };

  return (
    <React.Fragment>
      {renderAnimationComponent()}
      {renderModalComponent()}
      {renderAlertComponent()}
    </React.Fragment>
  );
};

export default ToktokFoodOrder;
