/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Platform} from 'react-native';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import InputScrollView from 'react-native-input-scroll-view';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: #ffffff;
`;
export const KeyboardAvoidingViewContainer: ComponentType<any> = styled(InputScrollView).attrs(props => ({
  ...props,
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
  keyboardOffset: moderateScale(props.headerHeight + getStatusbarHeight),
  topOffset: getStatusbarHeight,
}))``;
