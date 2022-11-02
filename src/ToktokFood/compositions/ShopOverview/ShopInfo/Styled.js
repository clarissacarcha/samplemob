/**
 * @flow
 */

import type {ComponentType} from 'react';
import { FlatList as List, Text as T } from 'react-native';
import {Icon} from 'react-native-elements';
import styled from 'styled-components/native';

import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  background-color: ${props => props.theme.color.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  /* height: 100; */
  flex: 1;
  justify-content: space-between;
  /* align-items: center; */
  padding: 20px;
  padding-bottom: 16;
  position: absolute;
  bottom: 0;
  width: 100%;
  border-bottom-width: 1;
  border-bottom-color: ${props => props.theme.divider.active};
`;
export const SubContainer: ComponentType<any> = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-bottom: ${props => props.voucher ? 16 : 0};
  border-bottom-width: ${props => props.voucher ? 1 : 0};
  border-bottom-color: ${props => props.theme.divider.active};
`;

export const VoucherParentContainer: ComponentType<any> = styled.View`
  margin-left: -20;
  margin-right: -20;
  margin-top: 16;
  padding-left: 20;
  padding-right: 20;
`;

export const VoucherContainer: ComponentType<any> = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-left: 16;
  height: 80;
  width: 260;
  padding-right: 32;
  border-width: 2;
  border-color: ${props => props.theme.divider.active};
  border-radius: 5;
`;

export const Column: ComponentType<any> = styled.View`
  flex: 1;
  margin-left: 15px;
  /* padding-horizontal: 7px; */
`;

export const Row: ComponentType<any> = styled.View`
  /* flex: 1px; */
  align-items: center;
  flex-direction: row;
  margin-top: 5px;
`;

export const InfoContainer: ComponentType<any> = styled.TouchableOpacity``;

export const InfoIcon: ComponentType<any> = styled(Icon).attrs(props => ({
  name: props.icon,
  type: 'ionicon',
  color: props.color || props.theme.color.orange,
  size: 15,
}))``;

export const InfoText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  color: props.theme.color.darkgray,
}))`
  margin-left: 5px;
  margin-right: 10px;
`;

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  margin-top: 3px;
`;

export const FlatList: ComponentType<any> = styled(List).attrs(props => ({
  ...props,
  horizontal: true,
  showsHorizontalScrollIndicator: false,

}))`
  margin-horizontal: -20px;
  margin-top: 16px;
`;

export const Title: ComponentType<any> = styled(T).attrs(props => ({
  ...props,
  numberOfLines: 3,
  ellipsizeMode: "tail",
}))`
  font-weight: 600;
  margin-bottom: 3;
  width: 150;
`;

export const SubTitle: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  font-size: 11;
  color: ${props => props.color || props.theme.color.dark};
`;