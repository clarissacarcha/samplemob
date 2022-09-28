/**
 * @flow
 */

import type {ComponentType} from 'react';
import {FlatList, Platform} from 'react-native';
import styled from 'styled-components/native';
import {moderateScale} from 'toktokwallet/helper';
import {VectorIcon, ICON_SET} from 'src/revamp';

import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  background: #ffffff;
  ${Platform.OS === 'android' ? 'elevation: 3;' : 'box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);'}
  border-radius: 5px;
  margin-top: ${moderateScale(16)};
  margin-horizontal: ${moderateScale(16)};
`;
export const HeaderContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  border-bottom-width: 1;
  border-bottom-color: #c4c4c436;
`;
export const Title: ComponentType<any> = styled.Text`
  font-family: ${FONT.BOLD};
  font-size: ${FONT_SIZE.M};
  padding-horizontal: ${moderateScale(15)}px;
  padding-vertical: ${moderateScale(15)}px;
  color: ${props => props.theme.color.orange};
`;
export const SeeAllContainer: ComponentType<any> = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${moderateScale(16)}px;
`;
export const SeeAllText: ComponentType<any> = styled.Text`
  font-size: ${FONT_SIZE.M};
  color: ${props => props.theme.color.orange};
`;
export const SeeAllIcon: ComponentType<any> = styled(VectorIcon).attrs(props => ({
  ...props,
  color: props.theme.color.orange,
  size: moderateScale(15),
  iconSet: ICON_SET.Entypo,
  name: 'chevron-right',
}))``;
export const List: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  marginVertical: moderateScale(15),
}))``;
