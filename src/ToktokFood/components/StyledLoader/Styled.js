/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {ModalImage} from 'toktokfood/components/Modal';
import StyledText from '../StyledText';

export const Container: ComponentType<any> = styled.View`
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 10px;
`;

export const ImageContainer: ComponentType<any> = styled.View`
  margin-horizontal: ${props => (props.type ? `${45}px` : `${-15}px`)};
  margin-vertical: ${props => (props.type ? `${20}px` : `${-30}px`)};
  top: ${props => (props.type ? `${10}px` : `${0}px`)};
`;

export const Image: ComponentType<any> = styled(ModalImage).attrs(props => ({
  ...props,
  size: props.size || 200,
}))``;

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  // color: props.theme.color.orange,
  color: '#F6841F',
  mode: 'semibold',
}))`
  margin-top: ${props => (props.type ? `${-10}px` : `${-30}px`)};
  margin-bottom: 30px;
`;
