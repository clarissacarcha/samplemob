/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';

export const KeyboardAvoidingContainer: ComponentType<any> = styled(KeyboardAvoidingView).attrs(props => ({
  ...props,
  behavior: Platform.OS === 'ios' ? 'padding' : null,
}))`
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;

export const ScrollViewContainer: ComponentType<any> = styled.ScrollView`
  background-color: ${props => props.theme.color.white};
  padding: ${moderateScale(20)}px;
`;
