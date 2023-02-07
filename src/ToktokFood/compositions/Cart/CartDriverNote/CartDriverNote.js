/**
 * @format
 * @flow
 */

import React from 'react';
import type {PropsType} from './types';
import {Container, Title, Input, InputContainer} from './Styled';

const CartDriverNote = (props: PropsType): React$Node => {
  const {cartDriverNote = '', setCartDriverNote} = props;
  return (
    <Container>
      <Title>Note to Driver (optional)</Title>
      <InputContainer>
        <Input value={cartDriverNote} onChangeText={text => setCartDriverNote(text)} />
      </InputContainer>
    </Container>
  );
};

export default CartDriverNote;
