/**
 * @format
 * @flow
 */

import React from 'react';
import type {PropsType} from './types';
import {Container, Image, TitleContainer} from './Styled';
import moment from 'moment';
import {time} from 'toktokfood/assets/images';
import StyledText from 'toktokfood/components/StyledText';
import Divider from 'toktokfood/components/Divider';
import {useTheme} from 'styled-components';

const OrderExhaustTimer = (props: PropsType): React$Node => {
  const {state} = props;
  const theme = useTheme();
  const isLoaded =
    state &&
    Object.keys(state).length > 0 &&
    ((state?.orderIsfor === 1 && Object.keys(state?.riderDetails).length > 0) || state?.orderIsfor === 2);

  const setPreparingText = () => {
    if (state?.dateBookingConfirmed) {
      const dateBookingConfirmed = moment(state?.dateBookingConfirmed).add(45, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      const remainingMinutes = moment(dateBookingConfirmed).diff(moment(), 'minutes');
      if (remainingMinutes <= 0) {
        return 'Sorry, your order seems to be taking too long to prepare. Thank you for patiently waiting.';
      }
      return '15 - 45 minutes';
    }
    return '';
  };

  const renderComponent = (title, subtitle) => {
    return (
      <React.Fragment>
        <Container>
          <TitleContainer>
            <Image source={time} />
            <StyledText mode="semibold">{title}</StyledText>
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
        title = setPreparingText();
        subtitle = 'Preparing Order';
        return renderComponent(title, subtitle);
      case 'rp':
        if (state?.orderIsfor === 1 && (state?.riderDetails?.driver || state?.rebooked)) {
          title = setPreparingText();
          subtitle = 'Preparing Order';
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
