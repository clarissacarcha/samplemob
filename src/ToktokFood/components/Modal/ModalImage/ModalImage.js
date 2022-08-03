/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Image} from './Styled';

const ModalImage = (props: PropsType): React$Node => {
  const {width = 0, height = 0, size = 0, borderRadius = 0, uri = '', source = ''} = props;

  return <Image source={uri ? {uri} : source} width={width} height={height} borderRadius={borderRadius} size={size} />;
};

export default ModalImage;
