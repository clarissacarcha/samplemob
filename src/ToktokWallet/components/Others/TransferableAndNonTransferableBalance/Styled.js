/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Animated} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

import CONSTANTS from 'src/common/res/constants';
import {Platform} from 'react-native/Libraries/ReactPrivate/ReactNativePrivateInterface';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  ${Platform.OS === 'android' ? 'elevation: 3;' : 'box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);'}
  background-color: #ffffff;
`;

export const Button: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
  activeOpacity: 0.5,
}))`
  padding: ${moderateScale(16)}px;
  border-top-right-radius: ${moderateScale(5)}px;
  border-top-left-radius: ${moderateScale(5)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ButtonTitleContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  flex-shrink: 1;
`;

export const CurrencyCodeContainer: ComponentType<any> = styled.View`
  border-radius: ${moderateScale(50)}px;
  border-color: ${props => props.theme.color.orange};
  border-width: 1px;
  padding-horizontal: ${moderateScale(10)}px;
  padding-vertical: ${moderateScale(Platform.OS === 'android' ? 4 : 5)}px;
  margin-right: ${moderateScale(10)}px;
`;

export const CurrencyCode: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.XL}px;
  color: ${props => props.theme.color.orange};
`;

export const Label: ComponentType<any> = styled.Text`
  font-family: ${FONT.BOLD};
  color: ${props => props.theme.color.orange};
  flex-shrink: 1;
  margin-right: ${moderateScale(10)}px;
`;

export const ContentContainer: ComponentType<any> = styled(Animated.View).attrs(props => ({
  ...props,
}))`
  background-color: #ffffff;
  border-bottom-left-radius: ${moderateScale(5)}px;
  border-bottom-right-radius: ${moderateScale(5)}px;
  border-top-color: #c4c4c470;
  border-top-width: 1px;
  padding-bottom: ${moderateScale(8)}px;
  opacity: ${props => props.opacity};
`;

export const ContentSubContainer: ComponentType<any> = styled.View`
  padding: ${moderateScale(16)}px;
`;
export const TitleContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
export const Amount: ComponentType<any> = styled.Text`
  font-family: ${FONT.BOLD};
`;
export const Description: ComponentType<any> = styled.Text`
  margin-top: ${moderateScale(16)}px;
`;
export const Separator: ComponentType<any> = styled.View`
  background-color: #f7f7fa;
  height: 1px;
  margin-horizontal: ${moderateScale(16)}px;
`;
export const ArrowDown: ComponentType<any> = styled(FIcon5).attrs(props => ({
  ...props,
  name: 'chevron-down',
  size: moderateScale(16),
  color: props.theme.color.orange,
}))``;

export const ArrowRight: ComponentType<any> = styled(FIcon5).attrs(props => ({
  ...props,
  name: 'chevron-right',
  size: moderateScale(16),
  color: props.theme.color.orange,
}))``;
