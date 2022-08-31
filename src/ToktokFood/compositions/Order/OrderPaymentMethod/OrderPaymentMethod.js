/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, Image, ImageContainer} from './Styled';
import {toktokwallet_ic, cash_ic} from 'toktokfood/assets/images';
import StyledText from 'toktokfood/components/StyledText';
import {useTheme} from 'styled-components';
const OrderPaymentMethod = (props: PropsType): React$Node => {
  const {type = 'toktokwallet'} = props;
  const theme = useTheme();
  const renderPaymentMethod = () => {
    if (type === 'toktokwallet') {
      return (
        <StyledText color={theme.color.yellow}>
          toktok<StyledText color={theme.color.orange}>wallet</StyledText>
        </StyledText>
      );
    }

    return <StyledText color={theme.color.yellow}>Cash</StyledText>;
  };

  return (
    <Container>
      <ImageContainer type={type}>
        <Image source={type === 'toktokwallet' ? toktokwallet_ic : cash_ic} />
      </ImageContainer>
      {renderPaymentMethod()}
    </Container>
  );
};

export default OrderPaymentMethod;
