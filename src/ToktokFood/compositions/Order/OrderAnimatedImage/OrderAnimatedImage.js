/**
 * @format
 * @flow
 */

import React from 'react';
import type {PropsType} from './types';
import {AnimatedImage, LoaderContainer} from './Styled';
import {
  restaurant_confirmation,
  driver_on_the_way,
  preparing_order,
  ready_for_pick_up,
  no_driver_found,
} from 'toktokfood/assets/images';
import ContentLoader from 'react-native-easy-content-loader';
import moment from 'moment';

const OrderAnimatedImage = (props: PropsType): React$Node => {
  const {state, animationContainerHeight} = props;
  const {serviceType = null} = state;

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
        if (state?.orderIsfor === 2 || (state?.orderIsfor === 1 && (state?.riderDetails?.driver || state?.rebooked))) {
          source = preparing_order;
        } else {
          if (serviceType === 'toktokfood') {
            source = driver_on_the_way;
          } else if (serviceType === 'pabili') {
            const dateOrdered = moment(state?.dateOrdered).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            const remainingMinutes = moment(dateOrdered).diff(moment(), 'minutes');
            if (remainingMinutes <= 0) {
              source = no_driver_found;
            } else {
              source = driver_on_the_way;
            }
          }
        }
        break;
      case 'rp':
        if (state?.orderIsfor === 2) {
          source = ready_for_pick_up;
        } else {
          source = preparing_order;
        }
        break;
      case 'f':
        if (state?.orderIsfor === 1 && state?.riderDetails?.driver) {
          if (state?.deliveryLogs[4]?.createdAt) {
            source = driver_on_the_way;
          } else {
            source = ready_for_pick_up;
          }
        } else {
          source = preparing_order;
        }
        break;
      case 's':
        source = driver_on_the_way;
        break;
      default:
        source = source;
        break;
    }
    return <AnimatedImage source={source} animationContainerHeight={animationContainerHeight} />;
  }

  return (
    <LoaderContainer>
      <ContentLoader active avatar title={false} pRows={0} aSize={150} pWidth={0} />
    </LoaderContainer>
  );
};

export default OrderAnimatedImage;
