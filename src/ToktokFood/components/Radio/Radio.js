/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {RadioButton} from './Styled';

const Radio = (props: PropsType): React$Node => {
  const {title, checked, onPress} = props;
  return <RadioButton title={title} onPress={onPress} checked={checked} />;
};

export default Radio;
