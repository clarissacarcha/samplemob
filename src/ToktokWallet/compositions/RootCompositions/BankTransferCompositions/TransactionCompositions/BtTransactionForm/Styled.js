/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  background-color: #ffffff;
  margin: ${moderateScale(16)}px;
`;
export const InputContainer: ComponentType<any> = styled.View`
  margin-bottom: ${moderateScale(20)}px;
`;
export const FeeInformation: ComponentType<any> = styled.Text`
  margin-top: ${moderateScale(5)}px;
  font-size: ${FONT_SIZE.S}px;
`;
