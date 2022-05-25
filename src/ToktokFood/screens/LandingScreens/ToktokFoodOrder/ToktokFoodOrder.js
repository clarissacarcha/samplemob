/**
 * @format
 * @flow
 */

import React, {useEffect, useState, useCallback} from 'react';
import type {PropsType} from './types';
import {Container, AnimationContainer, BottomContainer, ButtonContainer, Button, AmountContainer} from './Styled';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {GET_ORDER_TRANSACTION_BY_REF_NUM} from 'toktokfood/graphql/toktokfood';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import Header from 'toktokfood/components/Header';
import Divider from 'toktokfood/components/Divider';
import StyledButton from 'toktokfood/components/StyledButton';
import {OrderAnimatedImage, OrderAnimatedText, OrderAddresses, OrderAmount} from 'toktokfood/compositions/Order';

const ToktokFoodOrder = (props: PropsType): React$Node => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const [state, setState] = useState({});

  //fetch order details
  const [getOrderDetails] = useLazyQuery(GET_ORDER_TRANSACTION_BY_REF_NUM, {
    fetchPolicy: 'cache-and-network',
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: error => console.log('getOrderDetails', error),
    onCompleted: ({getTransactionByRefNum}) => {
      // if (JSON.stringify(getTransactionByRefNum) != JSON.stringify(transaction)) {
      setState(getTransactionByRefNum);
      // const {orderIsfor, tDeliveryId, orderStatus} = getTransactionByRefNum;
      // console.log('fetching orders...', orderStatus);
      // if (orderIsfor === 1 && tDeliveryId) {
      //   getToktokFoodRiderDetails({
      //     variables: {
      //       input: {
      //         deliveryId: tDeliveryId,
      //       },
      //     },
      //   });
      // }
      // if (orderStatus !== 's' || orderStatus !== 'c') {
      //   handleGetTransactionByRefNum();
      // }
      // }
    },
  });

  const fetchOrderDetails = useCallback(
    referenceNum => {
      getOrderDetails({variables: {input: {referenceNum}}});
    },
    [getOrderDetails],
  );

  useEffect(() => {
    if (isFocused && route.params) {
      const {referenceNum} = route.params;
      fetchOrderDetails(referenceNum);
    }
  }, [fetchOrderDetails, isFocused, route.params]);

  return (
    <React.Fragment>
      <Header hasBack />
      <Container>
        {/* Animation Part */}
        <AnimationContainer>
          <OrderAnimatedImage state={state} />
          <OrderAnimatedText state={state} />
        </AnimationContainer>

        {/* Bottom Part */}
        <BottomContainer>
          {/* Shop and customer address */}
          <OrderAddresses state={state} />
          <Divider />
          {/* Amount and its breakdown */}
          <AmountContainer>
            <OrderAmount state={state} />
          </AmountContainer>
          {/* Buttons for order details and cancel order */}
          <ButtonContainer>
            <Button onPress={() => console.log('hey')}>See Order Details</Button>
            <StyledButton type="secondary" onPress={() => console.log('cancel')}>
              Cancel
            </StyledButton>
          </ButtonContainer>
        </BottomContainer>
      </Container>
    </React.Fragment>
  );
};

export default ToktokFoodOrder;
