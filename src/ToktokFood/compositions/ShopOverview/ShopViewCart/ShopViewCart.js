/**
 * @format
 * @flow
 */

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import type {PropsType} from './types';
import {AmountContainer, AmountText, Container, ViewCart} from './Styled';

const ShopViewCart = (props: PropsType): React$Node => {
  const {shopId} = props;
  const navigation = useNavigation();
  const {customerInfo} = useSelector(state => state.toktokFood);

  const onRestaurantNavigate = () => {
    navigation.navigate('ToktokFoodCart', {
      shopId: shopId,
      userId: customerInfo.userId,
      shopname: 'Test',
    });
  };
  return (
    <Container>
      <AmountContainer>
        <AmountText>1 Item</AmountText>
        <AmountText>Subtotal: 120.00</AmountText>
      </AmountContainer>

      <ViewCart onPress={onRestaurantNavigate} />
    </Container>
  );
};

export default ShopViewCart;
