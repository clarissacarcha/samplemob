/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import type {PropsType} from './types';
import {Container, Image, TitleContainer, Title} from './Styled';
import moment from 'moment';
import {time} from 'toktokfood/assets/images';
import StyledText from 'toktokfood/components/StyledText';
import Divider from 'toktokfood/components/Divider';
import {useTheme} from 'styled-components';

const OrderExhaustTimer = (props: PropsType): React$Node => {
  const {state} = props;
  const theme = useTheme();
  const [isExhausted, setIsExhausted] = useState(false);

  const isLoaded =
    state &&
    Object.keys(state).length > 0 &&
    ((state?.orderIsfor === 1 && Object.keys(state?.riderDetails).length > 0) || state?.orderIsfor === 2);

  const setPreparingText = () => {
    const isDelivery = state?.orderIsfor === 1;
    const dateBookingConfirmed = moment(isDelivery ? state?.dateBookingConfirmed : state?.dateOrderProcessed)
      .add(45, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss');
    const remainingMinutes = moment(dateBookingConfirmed).diff(moment(), 'minutes');
    if (remainingMinutes <= 0) {
      !isExhausted && setIsExhausted(true);
      return 'Sorry, your order seems to be taking too long to prepare. Thank you for patiently waiting.';
    }
    return '15 - 45 minutes';
  };

  const setDeliveringText = () => {
    if (state?.duration !== undefined) {
      const minutes = state?.duration;
      if (minutes <= 0) {
        !isExhausted && setIsExhausted(true);
        return 'Driver is nearby your location. Thank you for patiently waiting.';
      }
      return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    }
  };

  const renderComponent = (title, subtitle) => {
    return (
      <React.Fragment>
        <Container>
          <TitleContainer>
            <Image source={time} />
            <Title mode={isExhausted ? 'regular' : 'semibold'}>{title}</Title>
          </TitleContainer>
          <StyledText color={theme.color.gray}>{subtitle}</StyledText>
        </Container>
        <Divider />
      </React.Fragment>
    );
  };

  if (isLoaded) {
    var title = '';
    var subtitle = '';

    switch (state?.orderStatus) {
      case 'po':
        if (isExhausted) {
          return null;
        }
        if (state?.orderIsfor === 2 || (state?.orderIsfor === 1 && (state?.riderDetails?.driver || state?.rebooked))) {
          title = setPreparingText();
          subtitle = 'Preparing Order';
          return renderComponent(title, subtitle);
        }
        return null;
      case 'rp':
        if (state?.orderIsfor === 1 && (state?.riderDetails?.driver || state?.rebooked)) {
          title = setPreparingText();
          subtitle = 'Preparing Order';
          return renderComponent(title, subtitle);
        }
        return null;
      case 'f':
        if (state?.orderIsfor === 1 && state?.deliveryLogs[4]?.createdAt && state?.duration > 0) {
          title = setDeliveringText();
          subtitle = 'Driver is on the way';
          return renderComponent(title, subtitle);
        }
        return null;
      default:
        return null;
    }
  }
  return null;
};

export default OrderExhaustTimer;
