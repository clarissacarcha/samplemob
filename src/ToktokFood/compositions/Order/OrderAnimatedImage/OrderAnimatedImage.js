/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {AnimatedImage, LoaderContainer} from './Styled';
import {restaurant_confirmation, driver_on_the_way, preparing_order, ready_for_pick_up} from 'toktokfood/assets/images';
import ContentLoader from 'react-native-easy-content-loader';

const OrderAnimatedImage = (props: PropsType): React$Node => {
  const {state} = props;
  const isLoaded =
    state &&
    Object.keys(state).length > 0 &&
    ((state?.orderIsfor === 1 && Object.keys(state?.riderDetails).length > 0) ||
      state?.orderIsfor === 2 ||
      state?.orderStatus === 'p');
  if (isLoaded) {
    var source;

    switch (state?.orderStatus) {
      case 'p':
        source = restaurant_confirmation;
        break;
      case 'po':
        if (state?.orderIsFor === 2 || (state?.orderIsfor === 1 && state?.riderDetails?.driver)) {
          source = preparing_order;
        } else {
          source = driver_on_the_way;
        }
        break;
      case 'rp':
        if (
          state?.orderIsFor === 2 ||
          (state?.orderIsfor === 1 && state?.riderDetails?.driver && state?.deliveryLogs[3]?.createdAt)
        ) {
          source = ready_for_pick_up;
        } else {
          source = preparing_order;
        }
        break;
      case 'f':
      case 's':
        source = driver_on_the_way;
        break;
      default:
        break;
    }
    return <AnimatedImage source={source} />;
  }

  return (
    <LoaderContainer>
      <ContentLoader active avatar title={false} pRows={0} aSize={150} pWidth={0} />
    </LoaderContainer>
  );
};

export default OrderAnimatedImage;
