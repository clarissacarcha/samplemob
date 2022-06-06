/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Title} from './Styled';

const ModalTitle = (props: PropsType): React$Node => {
  const {children, color, align, size} = props;
  return (
    <Title color={color} align={align} size={size}>
      {children}
    </Title>
  );
};

export default ModalTitle;
