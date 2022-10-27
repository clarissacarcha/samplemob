/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container} from './Styled';

const ModalBody = (props: PropsType): React$Node => {
  const {children} = props;
  return <Container>{children}</Container>;
};

export default ModalBody;
