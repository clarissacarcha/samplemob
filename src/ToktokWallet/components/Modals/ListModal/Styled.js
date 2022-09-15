/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {FlatList, Platform, TouchableOpacity} from 'react-native';
import {SearchInput} from 'toktokwallet/components';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';

export const CustomModal: ComponentType<any> = styled(Modal).attrs(props => ({
  ...props,
  transparent: true,
  animationType: 'fade',
}))`
  margin: 0px;
`;
export const Container: ComponentType<any> = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
`;
export const ContainerWithSearch: ComponentType<any> = styled.View`
  background-color: #fff;
  width: 100%;
  padding-top: ${Platform.OS === 'ios' ? getStatusbarHeight + moderateScale(15) : moderateScale(15)}px;
  flex: 1;
`;
export const ContentContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  margin-horizontal: ${moderateScale(16)}px;
`;

export const BackButton: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  justify-content: center;
  align-items: center;
`;
export const BackButtonIcon: ComponentType<any> = styled(FIcon).attrs(props => ({
  ...props,
  name: 'chevron-left',
  size: moderateScale(16),
  color: props.theme.color.orange,
}))`
  margin-right: ${moderateScale(16)}px;
`;

export const SearchInputField: ComponentType<any> = styled(SearchInput).attrs(props => ({
  ...props,
  placeholderTextColor: '#525252',
}))``;

export const ContainerList: ComponentType<any> = styled.View`
  background-color: #fff;
  border-radius: ${moderateScale(10)}px;
  ${({withSearch}) =>
    !withSearch
      ? `
        width: 80%;
        max-height: 70%;
        border-radius: ${moderateScale(10)}px;
        padding: ${moderateScale(10)}px;
      `
      : 'flex: 1;'}
`;

export const List: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {flexGrow: 1},
}))``;

export const ItemSeparator: ComponentType<any> = styled.View`
  height: 1px;
  background-color: #f4f4f4;
  margin-horizontal: ${moderateScale(20)}px;
`;
export const ItemDetailsContainer: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  color: ${props => (props.isRemove ? '#525252' : '#525252')}
  padding: ${moderateScale(20)}px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
export const Name: ComponentType<any> = styled.Text`
  color: ${props => (props.disabled ? '#525252' : '#000000')};
`;
export const DefaultText: ComponentType<any> = styled.Text`
  color: #9e9e9e;
`;
