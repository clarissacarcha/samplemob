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
  CancelledText,
  ReasonText,
} from './Styled';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {
  GET_ORDER_TRANSACTION_BY_REF_NUM,
  GET_RIDER_DETAILS,
  PATCH_CANCEL_CUSTOMER_ORDER,
} from 'toktokfood/graphql/toktokfood';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import Header from 'toktokfood/components/Header';
import Alert from 'toktokfood/components/Alert';
import Divider from 'toktokfood/components/Divider';
import StyledButton from 'toktokfood/components/StyledButton';
import StyledText from 'toktokfood/components/StyledText';
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
  OrderExhaustTimer,
  OrderCancellationModal,
} from 'toktokfood/compositions/Order';
import {useTheme} from 'styled-components';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
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
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [toCancelOrder, setToCancelOrder] = useState(false);
  const [isCancelledByCustomer, setIsCancelledByCustomer] = useState(false);

  //fetch order details
  const [getOrderDetails, {startPolling, stopPolling}] = useLazyQuery(GET_ORDER_TRANSACTION_BY_REF_NUM, {
    fetchPolicy: 'cache-and-network',
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: error => console.log('getOrderDetails', error),
    onCompleted: ({getTransactionByRefNum}) => {
      const {orderStatus, orderIsfor, tDeliveryId} = getTransactionByRefNum;
      const isDelivery = orderIsfor === 1;
      console.log(getTransactionByRefNum);
      setState(getTransactionByRefNum);
      const isOrderCompletedOrCancelled = orderStatus === 'c' || orderStatus === 's';
      if (isOrderCompletedOrCancelled) {
        stopPolling();
        if (polled && !isCancelledByCustomer) {
          setTimeout(() => setIsAlertVisible(true), 500);
        }
      } else {
        startPolling(10000);
        setPolled(true);
        if (orderStatus !== 'p') {
          toCancelOrder && setIsAlertVisible(false);
          setIsCancelModalVisible(false);
        }
        console.log('fetching orders...', orderStatus);
      }
      if (isDelivery && tDeliveryId) {
        fetchRiderDetails(tDeliveryId);
      }
    },
  });

  const [getToktokFoodRiderDetails] = useLazyQuery(GET_RIDER_DETAILS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
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

  // cancel order
  const [postCancelOrder] = useMutation(PATCH_CANCEL_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: error => console.log(error),
    onCompleted: ({cancelOrder}) => {
      setIsCancelledByCustomer(true);
      setTimeout(() => setIsAlertVisible(true), 500);
    },
  });

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
      setShowOrderDetails(false);
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

  const renderAlertComponent = () => {
    var title = '';
    var subtitle = '';
    var type;
    var buttonText = '';
    var buttonText2 = '';
    var onPress = () => {};
    var onPress2 = () => {};
    const isCancelled = state?.orderStatus === 'c';
    const isDeclined = !moment(state?.dateOrderProcessed).isValid();

    if (isCancelledByCustomer) {
      title = 'Order Cancelled';
      type = 'success';
      subtitle =
        'Your order has been successfully cancelled. Cancelling orders multiple times will cause your next orders longer to be accepted by the merchant.';
      buttonText = 'OK';
      onPress = () => navigation.navigate('ToktokFoodOrderTransactions');
    } else {
      if (toCancelOrder) {
        title = 'Cancel Order';
        subtitle = 'This order will be cancelled.\nWould you like to proceed?';
        type = 'question';
        buttonText = 'No';
        onPress = () => {
          setIsAlertVisible(false);
          setToCancelOrder(false);
        };
        buttonText2 = 'Yes';
        onPress2 = () => {
          setIsAlertVisible(false);
          setTimeout(() => setIsCancelModalVisible(true), 500);
        };
      } else {
        if (isCancelled) {
          title = isDeclined ? 'Order Declined' : 'Order Cancelled';
          type = 'warning';
          buttonText = 'Browse Menu';
          onPress = () => navigation.goBack();
          buttonText2 = 'OK';
          onPress2 = () => navigation.navigate('ToktokFoodHome');
        } else {
          title = state?.orderIsfor === 1 ? 'Order Delivered' : 'Order Picked Up';
          subtitle = 'Yay! Craving satisfied. Thank you for ordering in toktokfood!';
          type = 'success';
          buttonText = 'OK';
          onPress = () => navigation.navigate('ToktokFoodOrderTransactions');
          buttonText2 = '';
        }
      }
    }

    const BodyComponent = () => {
      if (isCancelled && !toCancelOrder) {
        return (
          <React.Fragment>
            <CancelledText>
              Sorry, your order has been {isDeclined ? 'declined' : 'cancelled'} and cannot be processed by{' '}
              <StyledText mode="semibold">{state?.shopDetails?.shopname} </StyledText>
              due to the following reason/s:{' '}
            </CancelledText>
            <Divider />
            <ReasonText label>Reason</ReasonText>
            <ReasonText>{state?.declinedNote}</ReasonText>
          </React.Fragment>
        );
      }
      return null;
    };

    return (
      <Alert
        isVisible={isAlertVisible}
        type={type}
        title={title}
        subtitle={subtitle}
        buttonText={buttonText}
        onPress={onPress}
        buttonText2={buttonText2}
        onPress2={onPress2}
        BodyComponent={() => <BodyComponent />}
      />
    );
  };

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
              {/* Exhaust Timer */}
              <OrderExhaustTimer state={{...state, riderDetails}} />
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
                <Button
                  orderStatus={state?.orderStatus}
                  onPress={() => setShowOrderDetails(true)}
                  buttonText="See Order Details"
                />
                {state?.orderStatus === 'p' && (
                  <StyledButton
                    type="secondary"
                    onPress={() => {
                      setToCancelOrder(true);
                      setIsAlertVisible(true);
                    }}
                    buttonText="Cancel"
                  />
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
    const animationOut = isCompletedOrCancelled ? 'slideOutRight' : 'slideOutDown';
    return (
      <CustomModal
        isVisible={showOrderDetails}
        customBackdrop={<Container />}
        flex={1}
        animationIn={animationIn}
        animationOut={animationOut}>
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
      <OrderCancellationModal
        isVisible={isCancelModalVisible}
        onCancel={() => {
          setIsCancelModalVisible(false);
          setTimeout(() => setToCancelOrder(false), 1000);
        }}
        onConfirm={reason => {
          setIsCancelModalVisible(false);
          postCancelOrder({
            variables: {
              input: {
                reference_num: state?.referenceNum,
                reason,
              },
            },
          });
        }}
      />
    </React.Fragment>
  );
};

export default ToktokFoodOrder;
