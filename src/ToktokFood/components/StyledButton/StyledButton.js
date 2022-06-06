/**
 * @format
 * @flow
 */

import React from 'react';
import type {PropsType} from './types';
import {Container, ButtonText, Button} from './Styled';

const StyledButton = (props: PropsType): React$Node => {
  const {height = 40, type = 'primary', buttonText, onPress = () => null, style = {}} = props;
  return (
    <Button onPress={onPress}>
      <Container height={height} type={type} style={style}>
        <ButtonText type={type}>{buttonText}</ButtonText>
      </Container>
    </Button>
  );
};

export default StyledButton;
