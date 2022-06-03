/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Title} from './Styled';

const ModalTitle = (props: PropsType): React$Node => {
  const {children} = props;
  return <Title>{children}</Title>;
};

export default ModalTitle;
