/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container} from './Styled';

const Divider = (props: PropsType): React$Node => {
  const {horizontal = true, height = 0, marginVertical = 0} = props;
  return <Container horizontal={horizontal} height={height} marginVertical={marginVertical} />;
};

export default Divider;
