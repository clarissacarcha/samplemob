/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {AnimationText, Loader} from './Styled';

const OrderAnimatedText = (props: PropsType): React$Node => {
  const {state} = props;
  const isLoaded =
    (state &&
      Object.keys(state).length > 0 &&
      ((state?.orderIsfor === 1 && Object.keys(state?.riderDetails).length > 0) || state?.orderIsfor === 2)) ||
    state?.orderStatus === 'p';
  if (isLoaded) {
    var title = '';
    var subtitle = '';

    switch (state?.orderStatus) {
      case 'p':
        title = 'Restaurant Confirmation';
        subtitle = 'Give restaurant some time to accept your order.';
        break;
      case 'po':
        if (state?.orderIsfor === 2 || (state?.orderIsfor === 1 && state?.riderDetails?.driver)) {
          title = 'Preparing Order';
          subtitle = 'Give restaurant some time to prepare your order.';
        } else {
          title = 'Finding Driver';
          subtitle = "We're finding you a nearby driver.";
        }
        break;
      case 'rp':
        if (state?.orderIsfor === 1 && state?.riderDetails?.driver && state?.deliveryLogs[3]?.createdAt) {
          title = 'Order has been picked-up';
          subtitle = 'Rider has picked-up the order';
        } else if (state?.orderIsfor === 2) {
          title = 'Order is ready for pick up';
          subtitle = 'Yay! Your food is good to go.';
        }
        break;
      case 'f':
      case 's':
        title = 'Driver is on the way';
        subtitle = 'The driver is on the way to deliver your order.';
        break;
      default:
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
