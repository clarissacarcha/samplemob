/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {RadioContainer, OuterContainer, InnerContainer, RadioLabel, ActiveContainer, RightContainer} from './Styled';
import {TouchableOpacity} from 'react-native';
// import RadioForm from 'react-native-simple-radio-button';

const Radio = (props: PropsType): React$Node => {
  const {onPress, title, checked, disabled = false, RightComponent} = props;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} disabled={disabled}>
      <RadioContainer>
        <ActiveContainer>
          <OuterContainer disabled={disabled}>
            <InnerContainer checked={checked} />
          </OuterContainer>
          <RadioLabel disabled={disabled}>{title}</RadioLabel>
        </ActiveContainer>
        <RightContainer>{RightComponent ? <RightComponent /> : null}</RightContainer>
      </RadioContainer>
    </TouchableOpacity>
  );
};

export default Radio;
