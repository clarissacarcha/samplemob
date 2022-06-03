/**
 * @format
 * @flow
 */

import React from 'react';
import {View} from 'react-native';
import type {PropsType} from './types';
import {Container, Row, Title, IconTextContainer, Icon, DeliveryDistanceContainer} from './Styled';
import {useTheme} from 'styled-components';
import moment from 'moment';
import StyledText from 'toktokfood/components/StyledText';
import OrderPaymentMethod from '../OrderPaymentMethod';
import Divider from 'toktokfood/components/Divider';
import {calendar_ic, map_ic} from 'toktokfood/assets/images';

const OrderInformation = (props: PropsType): React$Node => {
  const {state} = props;
  const theme = useTheme();

  const renderIconText = (icon, text) => {
    return (
      <IconTextContainer marginBottom={10}>
        <Icon source={icon} />
        <StyledText>{text}</StyledText>
      </IconTextContainer>
    );
  };

  return (
    <Container>
      <Row>
        <View>
          <Title>Order Information</Title>
          <StyledText color={theme.color.darkgray}>{moment(state?.dateOrdered).format('LLL')}</StyledText>
        </View>
        <OrderPaymentMethod type={state?.paymentMethod?.toLowerCase()} />
      </Row>
      <Divider />
      <DeliveryDistanceContainer>
        {renderIconText(calendar_ic, state?.orderIsfor === 1 ? 'Delivery: Now' : 'Pick up: Now')}
        {state?.orderIsfor === 1 &&
          state?.riderDetails?.driver &&
          renderIconText(map_ic, `${parseFloat(state?.riderDetails?.distance).toFixed(2)} km`)}
      </DeliveryDistanceContainer>
      <Divider />
    </Container>
  );
};

export default OrderInformation;
