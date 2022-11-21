/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import type {PropsType} from './types';
import {AnimationText, Loader} from './Styled';
import moment from 'moment';

const OrderAnimatedText = (props: PropsType): React$Node => {
  const {state} = props;
  const {serviceType = null} = state;
  const isLoaded =
    (state &&
      Object.keys(state).length > 0 &&
      ((state?.orderIsfor === 1 && Object.keys(state?.riderDetails).length > 0) || state?.orderIsfor === 2)) ||
    state?.orderStatus === 'p';

  const setFindingDriverText = () => {
    if (serviceType === 'toktokfood') {
      title = 'Finding Driver';
      subtitle = "We're finding you a nearby driver.";
    } else if (serviceType === 'pabili') {
      const dateOrdered = moment(state?.dateOrdered).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      const remainingMinutes = moment(dateOrdered).diff(moment(), 'minutes');
      if (remainingMinutes <= 0) {
        title = 'No Driver Found';
        subtitle = "We're sorry ka-toktok, but we couldn't\nfind a driver near your area.";
      } else {
        title = 'Finding Driver';
        subtitle = "We're finding you a nearby driver.";
      }
    }
  };

  const setPreparingText = () => {
    const isDelivery = state?.orderIsfor === 1;
    const dateBookingConfirmed = moment(isDelivery ? state?.dateBookingConfirmed : state?.dateOrderProcessed)
      .add(45, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss');
    const remainingMinutes = moment(dateBookingConfirmed).diff(moment(), 'minutes');
    if (remainingMinutes <= 0) {
      return 'Sorry, your order seems to be taking too long\nto prepare. Thank you for patiently waiting.';
    }
    return 'Your order is in the kitchen.';
  };

  if (isLoaded) {
    var title = '';
    var subtitle = '';

    switch (state?.orderStatus) {
      case 'p':
        title = 'Restaurant Confirmation';
        subtitle = 'Give restaurant some time to accept your order.';
        break;
      case 'po':
        if (state?.orderIsfor === 2 || (state?.orderIsfor === 1 && (state?.riderDetails?.driver || state?.rebooked))) {
          title = 'Preparing Order';
          subtitle =
            serviceType === 'toktokfood' ? 'Give restaurant some time to prepare your order.' : setPreparingText();
        } else {
          setFindingDriverText();
        }
        break;
      case 'rp':
        if (state?.orderIsfor === 1) {
          title = 'Preparing Order';
          subtitle = 'Give restaurant some time to prepare your order.';
        } else {
          title = 'Order is ready for pick up';
          subtitle = 'Yay! Your food is good to go.';
        }
        break;
      case 'f':
        if (state?.orderIsfor === 1 && state?.riderDetails?.driver) {
          if (state?.deliveryLogs[4]?.createdAt) {
            title = 'Driver is on the way';
            subtitle =
              state?.duration > 0
                ? 'The driver is on the way to deliver your order.'
                : 'Driver is nearby your location.\nThank you for patiently waiting.';
          } else {
            title = 'Order has been picked-up';
            subtitle = 'Driver has picked-up the order.';
          }
        } else if (state?.orderIsfor === 2) {
          title = 'Order is ready for pick up';
          subtitle = 'Yay! Your food is good to go.';
        }
        break;
      case 's':
        title = 'Driver is on the way';
        subtitle =
          state?.duration > 0
            ? 'The driver is on the way to deliver your order.'
            : 'Driver is nearby your location.\nThank you for patiently waiting.';
        break;
      default:
        title = title;
        subtitle = subtitle;
        break;
    }

    return (
      <React.Fragment>
        <AnimationText title>{title}</AnimationText>
        <AnimationText>{subtitle}</AnimationText>
      </React.Fragment>
    );
  }

  return <Loader active pRows={1} pHeight={12} />;
};

export default OrderAnimatedText;
