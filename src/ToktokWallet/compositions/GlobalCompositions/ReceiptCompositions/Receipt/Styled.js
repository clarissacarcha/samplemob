/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {ImageBackground, Platform, ScrollView, View} from 'react-native';
import LinearGradient from 'toktokwallet/assets/images/screen-bg.png';
import {moderateScale} from 'toktokwallet/helper';

export const BackgroundImage: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  source: LinearGradient,
}))`
  flex: 1;
  resize-mode: cover;
`;
export const ScrollViewContainer: ComponentType<any> = styled(ScrollView).attrs(props => ({
  ...props,
}))`
  flex: 1;
  padding: ${({onCapturingScreen}) => (onCapturingScreen ? 0 : moderateScale(16))}px;
`;
export const ReceiptDownloadContainer: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  source: LinearGradient,
}))`
  padding: ${moderateScale(16)}px;
  resize-mode: cover;
`;
export const ContentContainer: ComponentType<any> = styled(View).attrs(props => ({
  ...props,
}))`
  background-color: ${props => props.theme.color.white};
  // padding-horizontal: ${moderateScale(16)}px;
  ${Platform.OS === 'android' ? 'elevation: 3;' : 'box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);'}
  ${({onCapturingScreen}) =>
    onCapturingScreen && Platform.OS === 'android' ? 'borderColor: #F8F8F8; borderWidth: 2px;' : ''}
`;
