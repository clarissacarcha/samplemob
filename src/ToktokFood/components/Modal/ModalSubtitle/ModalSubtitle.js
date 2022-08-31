/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Text} from './Styled';

const ModalSubtitle = (props: PropsType): React$Node => {
  const {children} = props;
  return <Text>{children}</Text>;
};

export default ModalSubtitle;
