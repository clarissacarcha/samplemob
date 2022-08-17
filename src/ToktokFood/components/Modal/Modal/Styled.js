/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {SafeAreaView} from 'react-native';

export const Container: ComponentType<any> = styled.View`
  background-color: ${props => props.theme.color.white};
  border-radius: ${props => props.borderRadius};
  padding: 5px;
`;

export const SafeArea: ComponentType<any> = styled(SafeAreaView).attrs(props => ({
  ...props,
}))`
  flex-shrink: 1;
`;
