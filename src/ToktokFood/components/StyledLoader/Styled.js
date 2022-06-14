/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {ModalImage} from 'toktokfood/components/Modal';
import {loading_animation} from 'toktokfood/assets/images';
import StyledText from '../StyledText';

export const Container: ComponentType<any> = styled.View`
  align-items: center;
  justify-content: center;
`;

export const ImageContainer: ComponentType<any> = styled.View`
  margin-horizontal: -15px;
  margin-vertical: -30px;
`;

export const Image: ComponentType<any> = styled(ModalImage).attrs(props => ({
  ...props,
  size: 200,
  source: loading_animation,
}))``;

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.orange,
  mode: 'semibold',
}))`
  margin-top: -20px;
  margin-bottom: 25px;
`;
