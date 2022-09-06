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
