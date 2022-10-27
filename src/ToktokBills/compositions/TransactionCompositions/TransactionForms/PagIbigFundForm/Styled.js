/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {moderateScale} from 'toktokwallet/helper';
import {Platform} from 'react-native';

//FONTS & COLORS & IMAGES
import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  background-color: #ffffff;
  margin: ${moderateScale(16)}px;
`;
export const InputContainer: ComponentType<any> = styled.View`
  ${props => `
        margin-bottom: ${props.size ? moderateScale(Platform.OS === 'ios' ? props.size : 20) : moderateScale(20)}px;
      `}
`;
export const FeeInformation: ComponentType<any> = styled.Text`
  margin-top: ${moderateScale(10)}px;
  font-size: ${FONT_SIZE.S}px;
`;
export const RowContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: space-between;
  ${props => `
        margin-bottom: ${props.size ? moderateScale(Platform.OS === 'ios' ? props.size : 20) : moderateScale(20)}px;
      `}
`;
export const Space: ComponentType<any> = styled.View`
  margin: ${moderateScale(10)}px;
`;
