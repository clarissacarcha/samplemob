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
import {calendar_ic, map_ic, clock_ic} from 'toktokfood/assets/images';

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

  const setDeliveringText = () => {
    if (state?.duration !== undefined) {
      const minutes = state?.duration;
      if (minutes <= 0) {
        return null;
      }
      return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    }
  };

  const renderTimerComponent = () => {
    switch (state?.orderStatus) {
      case 'po':
        if (state?.orderIsfor === 2 || (state?.orderIsfor === 1 && (state?.riderDetails?.driver || state?.rebooked))) {
          const isDelivery = state?.orderIsfor === 1;
          const dateBookingConfirmed = moment(isDelivery ? state?.dateBookingConfirmed : state?.dateOrderProcessed)
            .add(45, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss');
          const remainingMinutes = moment(dateBookingConfirmed).diff(moment(), 'minutes');
          if (remainingMinutes <= 0) {
            return null;
          }
          return renderIconText(clock_ic, '15 - 45 minutes');
        }
        break;
      case 'f':
        if (state?.orderIsfor === 1 && state?.deliveryLogs[4]?.createdAt && state?.duration > 0) {
          return renderIconText(clock_ic, setDeliveringText());
        }
        return null;
      default:
        break;
    }
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
        {renderIconText(calendar_ic, state?.orderIsfor === 1 ? 'Delivery' : 'Pick up')}
        {renderIconText(map_ic, `${state?.estimatedDistance} km`)}
        {renderTimerComponent()}
        {/* {state?.orderIsfor === 1 &&
          state?.riderDetails?.driver &&
          renderIconText(map_ic, `${parseFloat(state?.riderDetails?.distance).toFixed(2)} km`)} */}
      </DeliveryDistanceContainer>
      <Divider />
    </Container>
  );
};

export default OrderInformation;
