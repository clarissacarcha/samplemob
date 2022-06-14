/**
 * @format
 * @flow
 */

import React from 'react';
import type {PropsType} from './types';
import {Container, ButtonText, Button} from './Styled';

const StyledButton = (props: PropsType): React$Node => {
  const {height = 40, type = 'primary', buttonText, onPress = () => null, style = {}, disabled = false} = props;
  return (
    <Button onPress={onPress} disabled={disabled}>
      <Container height={height} type={type} style={style} disabled={disabled}>
        <ButtonText type={type} disabled={disabled}>
          {buttonText}
        </ButtonText>
      </Container>
    </Button>
  );
};

export default StyledButton;
