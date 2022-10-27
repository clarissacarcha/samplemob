/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {FlatList, ImageBackground} from 'react-native';
import {backgrounds} from 'toktokwallet/assets';
import {moderateScale} from 'toktokwallet/helper';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: white;
`;
export const ReminderContainer: ComponentType<any> = styled.View`
  margin-top: ${moderateScale(16)}px;
  margin-horizontal: ${moderateScale(16)}px;
`;
export const LoadingContainer: ComponentType<any> = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export const BackgroundImage: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  resizeMode: 'cover',
  source: backgrounds.gradient_bg,
}))`
  flex: 1;
`;
export const List: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  showsVerticalScrollIndicator: false,
}))``;
