/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {AnimatedImage, LoaderContainer} from './Styled';
import {restaurant_confirmation} from 'toktokfood/assets/images';
import ContentLoader from 'react-native-easy-content-loader';

const OrderAnimatedImage = (props: PropsType): React$Node => {
  const {state} = props;
  if (state && Object.keys(state).length > 0) {
    var source;

    switch (state?.orderStatus) {
      case 'p':
        source = restaurant_confirmation;
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
