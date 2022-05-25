/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {AnimationText, Loader} from './Styled';

const OrderAnimatedText = (props: PropsType): React$Node => {
  const {state} = props;
  if (state && Object.keys(state).length > 0) {
    var title = '';
    var subtitle = '';

    switch (state?.orderStatus) {
      case 'p':
        title = 'Restaurant Confirmation';
        subtitle = 'Give restaurant some time to accept your order.';
        break;
      case 'po':
        if (state?.orderIsFor === 2 || (state?.orderIsfor === 1 && state?.riderDetails)) {
          title = 'Preparing Order';
          subtitle = 'Give restaurant some time to prepare your order.';
        } else {
          title = 'Finding Driver';
          subtitle = "We're finding you a nearby driver.";
        }
        break;
      case 'f':
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

  return <Loader active pRows={1} pHeight={15} />;
};

export default OrderAnimatedText;
