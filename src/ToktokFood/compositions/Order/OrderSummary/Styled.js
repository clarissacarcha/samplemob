/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {FlatList, ScrollView, TouchableOpacity} from 'react-native';
import StyledText from 'toktokfood/components/StyledText';
import ContentLoader from 'react-native-easy-content-loader';

export const Container: ComponentType<any> = styled.View`
  padding-horizontal: 20px;
`;

export const HiddenContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;

export const DeleteContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  width: 100px;
`;

export const EditContainer: ComponentType<any> = styled.View`
  width: 30px;
`;

export const DeletePaddingContainer: ComponentType<any> = styled.View`
  width: 20px;
  background-color: ${props => props.theme.color.white};
`;

export const DeleteImageContainer: ComponentType<any> = styled.View`
  width: 80px;
  background-color: ${props => props.theme.color.red};
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const DeleteImage: ComponentType<any> = styled.Image`
  width: 25px;
  height: 25px;
  resize-mode: cover;
`;

export const OrderCard: ComponentType<any> = styled.View`
  flex-direction: row;
  padding-vertical: 15px;
  background-color: ${props => props.theme.color.white};
`;

export const OrderImage: ComponentType<any> = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  resize-mode: cover;
  margin-right: 15px;
`;

export const ModifiedContainer: ComponentType<any> = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  margin-right: 15px;
`;

export const ModifiedTextContainer: ComponentType<any> = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.backgroundColor};
  position: absolute;
  bottom: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding-vertical: 2px;
`;

export const OrderProductDetailsContainer: ComponentType<any> = styled.View`
  flex: 1;
  padding-right: 20px;
`;

export const AmountQuantityContainer: ComponentType<any> = styled.View`
  align-items: flex-end;
  padding-top: 0.5px;
`;

export const ProductName: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  margin-bottom: 10px;
`;

export const AddOnText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  color: props.theme.color.darkgray,
}))`
  margin-bottom: 5px;
`;

export const VirtualizedScroll: ComponentType<any> = styled(ScrollView).attrs(props => ({
  ...props,
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  scrollEnabled: false,
  contentContainerStyle: {
    width: '100%',
  },
}))``;

export const OrderList: ComponentType<any> = styled(FlatList).attrs(props => ({
  ...props,
  scrollEnabled: false,
  showsVerticalScrollIndicator: false,
}))``;

export const Loader: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  avatar: true,
  aShape: 'square',
  active: true,
  aSize: 60,
  pRows: 2,
  pWidth: props.pWidth,
  tWidth: props.tWidth,
  tHeight: 13,
  pHeight: 7,
  titleStyles: {
    marginLeft: 10,
  },
  paragraphStyles: {
    marginLeft: 10,
  },
  containerStyles: {
    marginBottom: 15,
  },
}))``;

export const FooterButton: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
  activeOpacity: 0.9,
}))`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 15px;
`;

export const EditButton: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
  activeOpacity: 0.9,
}))`
  width: 30px;
`;

export const FooterText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.gray,
}))`
  margin-right: 10px;
`;

export const NotesText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.gray,
  fontSize: 11,
}))`
  margin-bottom: 10px;
`;
