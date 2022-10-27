/**
 * @flow
 */

import type {ComponentType} from 'react';
import IconFA from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components/native';

import {Platform} from 'react-native';

export const TextInput: ComponentType<any> = styled.TextInput.attrs(props => ({
  ...props,
  placeholderTextColor: props.color || props.theme.color.GRAY,
}))`
  color: ${props => props.color || props.theme.color.BLACK};
  padding: 0;
  font-size: 14px;
  flex: 1;
`;

export const Container: ComponentType<any> = styled.View.attrs(props => ({
  ...props,
}))`
  /* padding: 12px; */
  background-color: ${props => props.theme.textInput.container};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
`;

export const SearchIcon: ComponentType<any> = styled(IconFA).attrs(props => ({
  ...props,
  name: 'search',
  size: 18,
}))`
  margin-right: 10px;
  color: ${props => props.color || props.theme.searchBox.iconColor};
  padding: 12px;
`;

export const CloseIcon: ComponentType<any> = styled(IconFA).attrs(props => ({
  ...props,
  name: 'times',
  size: 18,
}))`
  /* margin-right: 10px; */
  padding: 12px;
  color: ${props => props.color || props.theme.color.lightgray};
`;

export const PressableContainer: ComponentType<any> = styled.Pressable.attrs(props => ({
  ...props,
}))`
  padding: ${Platform.OS === 'ios' ? 12 : 6}px;
  background-color: ${props => props.theme.color.LIGHTGRAY};
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
`;
