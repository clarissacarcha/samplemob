/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, Image, Title} from './Styled';
import {carbon_empty_cart} from 'toktokfood/assets/images';
import StyledText from 'toktokfood/components/StyledText';

const CartEmpty = (props: PropsType): React$Node => {
  return (
    <Container>
      <Image source={carbon_empty_cart} />
      <Title>No Items</Title>
      <StyledText>Hmm, there are no items to check out.</StyledText>
    </Container>
  );
};

export default CartEmpty;
