/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Input} from './Styled';

const StyledInputText = (props: PropsType): React$Node => {
  return <Input {...props} />;
};

export default StyledInputText;
