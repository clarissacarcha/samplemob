/**
 * @format
 * @flow
 */

import React from 'react';
import {TouchableOpacity} from 'react-native';
import type {PropsType} from './types';
import {Container, ButtonText} from './Styled';

const StyledButton = (props: PropsType): React$Node => {
  const {height = 40, type = 'primary', buttonText, onPress = () => null, style = {}} = props;
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Container height={height} type={type} style={style}>
        <ButtonText type={type}>{buttonText}</ButtonText>
      </Container>
    </TouchableOpacity>
  );
};

export default StyledButton;
