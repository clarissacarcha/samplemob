/**
 * @format
 * @flow
 */

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import type {PropsType} from './types';
import {AmountContainer, AmountText, Container, ViewCart} from './Styled';
import {useGetCartItems} from 'toktokfood/hooks';

const ShopViewCart = (props: PropsType): React$Node => {
  const {shopId} = props;
  const navigation = useNavigation();
  const {customerInfo} = useSelector(state => state.toktokFood);
  const {cartData} = useGetCartItems();

  const onRestaurantNavigate = () => {
    navigation.navigate('ToktokFoodPlaceOrder', {
      shopId: shopId,
      userId: customerInfo.userId,
      shopname: cartData?.items[0]?.shopName,
    });
  };

  if (cartData?.items?.length > 0) {
    return (
      <Container>
        <AmountContainer>
          <AmountText>
            {cartData?.items?.length} {cartData?.items?.length > 1 ? 'items' : 'item'}
          </AmountText>
          <AmountText>Subtotal: &#x20B1;{cartData?.totalAmountWithAddons.toFixed(2)}</AmountText>
        </AmountContainer>

        <ViewCart onPress={onRestaurantNavigate} />
      </Container>
    );
  }

  return null;
};

export default ShopViewCart;
