/**
 * @format
 * @flow
 */

import React from 'react';
import {Platform} from 'react-native';
import type {PropsType} from './types';
import {Container, SafeArea} from './Styled';
import {default as ModalComponent} from 'react-native-modal';

const Modal = (props: PropsType): React$Node => {
  const {children, flex = 0, borderRadius = 0} = props;
  return (
    <ModalComponent {...props}>
      {Platform.OS === 'ios' ? (
        <SafeArea flex={flex}>
          <Container borderRadius={borderRadius}>{children}</Container>
        </SafeArea>
      ) : (
        <Container borderRadius={borderRadius}>{children}</Container>
      )}
    </ModalComponent>
  );
};

export default Modal;
