/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Image} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  padding-horizontal: ${moderateScale(16)}px;
  margin-bottom: ${moderateScale(16)}px;
`;
export const Label: ComponentType<any> = styled.Text`
  font-family: ${FONT.BOLD};
`;
export const SubText: ComponentType<any> = styled.Text`
  margin-vertical: ${moderateScale(10)}px;
`;
export const ContentContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  padding-vertical: ${moderateScale(10)}px;
  align-items: center;
`;
export const ContentImage: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
}))`
  width: ${moderateScale(35)}px;
  height: ${moderateScale(35)}px;
`;
export const ContentTitle: ComponentType<any> = styled.Text`
  font-family: ${FONT.BOLD};
  font-size: ${FONT_SIZE.M}px;
  color: ${props => props.theme.color.orange};
`;
export const ContentDescription: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.S}px;
  padding-top: ${moderateScale(3)}px;
`;
export const ContentSubContainer: ComponentType<any> = styled.View`
  padding-left: ${moderateScale(16)}px;
  flex-shrink: 1;
`;
