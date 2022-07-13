/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useState, useCallback, useRef} from 'react';
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
  Image,
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
import FocusAwareStatusBar from 'toktokfood/components/FocusAwareStatusBar';
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
import {useDispatch, useSelector} from 'react-redux';
import {toktokwallet_ic} from 'toktokfood/assets/images';

const ToktokFoodOrder = (props: PropsType): React$Node => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const orderStatusFromRoute = route.params.orderStatus;
  const isCompletedOrCancelled = orderStatusFromRoute === 'c' || orderStatusFromRoute === 's';
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {loader: styledLoader} = useSelector(s => s.toktokFood);
  const [state, setState] = useState({});
  const [riderDetails, setRiderDetails] = useState({});
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [polled, setPolled] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isNoResponseModalVisible, setIsNoResponseModalVisible] = useState(false);
  const [toCancelOrder, setToCancelOrder] = useState(false);
  const [isCancelledByCustomer, setIsCancelledByCustomer] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isExhausted, setIsExhausted] = useState(false);
  const [animationContainerHeight, setAnimationContainerHeight] = useState(0);

  const timerRef = useRef(null);

  //fetch order details
  const [getOrderDetails, {startPolling, stopPolling}] = useLazyQuery(GET_ORDER_TRANSACTION_BY_REF_NUM, {
    fetchPolicy: 'cache-and-network',
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: error => console.log('getOrderDetails', error),
    onCompleted: ({getTransactionByRefNum}) => {
      const {orderStatus, orderIsfor, tDeliveryId} = getTransactionByRefNum;
      const isDelivery = orderIsfor === 1;
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
        } else {
          if (duration === 0 && !isNoResponseModalVisible) {
            setDuration(5);
          }
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
      const isDriverOntheWay = getDeliveryDetails?.deliveryLogs?.find(logs => logs.status === 5);
      if (
        isDriverOntheWay !== undefined &&
        Object.keys(isDriverOntheWay).length > 0 &&
        !isExhausted &&
        duration === 0
      ) {
        setDuration(getDeliveryDetails?.duration + 5);
      }
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
      const payload = {...styledLoader, isVisible: false};
      dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
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

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        setDuration(duration - 1);
      }, 60000);
    }

    const isDriverOntheWay = state?.deliveryLogs?.find(logs => logs.status === 5);
    if (isDriverOntheWay !== undefined && !isExhausted && duration <= 0) {
      setIsExhausted(true);
    }

    if (state?.orderStatus === 'p' && duration <= 0 && !isNoResponseModalVisible) {
      setIsNoResponseModalVisible(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration]);

  const onBackOrderDetails = () => {
    if (state?.orderStatus === 'c' || state?.orderStatus === 's') {
      setShowOrderDetails(false);
      // navigation.navigate('ToktokFoodActivities');
      navigation.navigate('ToktokFoodOrderTransactions');
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
          {state?.paymentMethod.toLowerCase() === 'toktokwallet' ? (
            <React.Fragment>
              <Image source={toktokwallet_ic} />
              <ModifiedText>
                This order has been modified by merchant. Total amount of{' '}
                <StyledText color={theme.color.orange} fontSize={11} mode="medium">
                  &#x20B1;{parseFloat(state?.refundTotal).toFixed(2)}{' '}
                </StyledText>
                is refunded to your toktokwallet account.
              </ModifiedText>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Icon name="info" size={14} color={theme.color.orange} />
              <ModifiedText>Total amount for this order has been updated.</ModifiedText>
            </React.Fragment>
          )}
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
      // onPress = () => navigation.navigate('ToktokFoodActivities', {orderStatus: 'c'});
      onPress = () => navigation.navigate('ToktokFoodOrderTransactions', {tab: 3});
    } else {
      if (toCancelOrder) {
        title = 'Cancel Order';
        subtitle = 'This order will be cancelled.\nWould you like to proceed?';
        type = 'question';
        buttonText = 'No';
        onPress = () => {
          setIsAlertVisible(false);
          setTimeout(() => {
            setToCancelOrder(false);
          }, 1000);
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
          onPress2 = () => navigation.navigate('ToktokFoodOrderTransactions', {tab: 3});
          // onPress2 = () => navigation.navigate('ToktokFoodHome');
        } else {
          title = state?.orderIsfor === 1 ? 'Order Delivered' : 'Order Picked Up';
          subtitle = 'Yay! Craving satisfied. Thank you for ordering in toktokfood!';
          type = 'success';
          buttonText = 'OK';
          // onPress = () => navigation.navigate('ToktokFoodActivities', {orderStatus: 's'});
          onPress = () => navigation.navigate('ToktokFoodOrderTransactions', {tab: 2});
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

  const renderNoResponseFromMerchant = () => {
    return (
      <Alert
        isVisible={isNoResponseModalVisible}
        type="warning"
        title="No Response From Merchant"
        subtitle={"Merchant hasn't confirmed your order.\nPlease try again."}
        buttonText="OK"
        onPress={() => {
          setIsNoResponseModalVisible(false);
          setDuration(5);
        }}
      />
    );
  };

  const renderCancellationModalComponent = () => (
    <OrderCancellationModal
      isVisible={isCancelModalVisible}
      onCancel={() => {
        setIsCancelModalVisible(false);
        setToCancelOrder(false);
      }}
      onConfirm={reason => {
        setIsCancelModalVisible(false);
        setTimeout(() => {
          const payload = {isVisible: true, text: 'Please wait', type: null};
          dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
          postCancelOrder({
            variables: {
              input: {
                reference_num: state?.referenceNum,
                reason,
              },
            },
          });
        }, 500);
      }}
    />
  );

  const getAnimationContainerHeight = e => {
    const {height} = e.nativeEvent.layout;
    setAnimationContainerHeight(height);
    console.log('test height', height);
  };

  const renderAnimationComponent = () => {
    if (!isCompletedOrCancelled) {
      return (
        <React.Fragment>
          <Header hasBack />
          <Container>
            {/* Animation Part */}
            <AnimationContainer onLayout={getAnimationContainerHeight}>
              <OrderAnimatedImage
                state={{...state, riderDetails}}
                animationContainerHeight={animationContainerHeight}
              />
              <OrderAnimatedText state={{...state, riderDetails}} />
            </AnimationContainer>

            {/* Bottom Part */}
            <BottomContainer>
              {/* Exhaust Timer */}
              <OrderExhaustTimer state={{...state, riderDetails, duration}} />
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
                    disabled={toCancelOrder}
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
        coverScreen={true}
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
        {renderNoResponseFromMerchant()}
      </CustomModal>
    );
  };

  return (
    <React.Fragment>
      <FocusAwareStatusBar />
      {renderAnimationComponent()}
      {renderModalComponent()}
      {renderAlertComponent()}
      {renderCancellationModalComponent()}
      {renderNoResponseFromMerchant()}
      {/* <StyledLoader isVisible={loader} text="Please wait" /> */}
    </React.Fragment>
  );
};

export default ToktokFoodOrder;
