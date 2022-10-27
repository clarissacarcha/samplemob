/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  margin-bottom: ${moderateScale(20)}px;
`;
export const ContentTitle: ComponentType<any> = styled.Text`
  margin-bottom: ${moderateScale(20)}px;
  font-family: ${FONT.BOLD};
`;
export const SubText: ComponentType<any> = styled.Text`
  text-align: justify;
`;
export const ContentContainer: ComponentType<any> = styled.View`
  margin-bottom: ${moderateScale(10)}px;
`;
export const ContentText: ComponentType<any> = styled.Text`
  font-family: ${props => (props.isBold ? FONT.BOLD : FONT.REGULAR)};
`;
export const SubContentContainer: ComponentType<any> = styled.View`
  margin-top: ${props => (props.hasContent ? moderateScale(20) : 0)}px;
`;
export const SubContentWrapper: ComponentType<any> = styled.View`
  margin-left: ${moderateScale(20)}px;
  text-align: justify;
  flex-direction: row;
`;
export const SubContentText: ComponentType<any> = styled.Text`
  flex-shrink: 1;
`;
