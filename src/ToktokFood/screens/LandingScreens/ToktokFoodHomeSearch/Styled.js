/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import IconFA from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Divider from 'toktokfood/components/Divider';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;

export const ComponentContainer: ComponentType<any> = styled.View`
  padding: 20px;
`;

export const Center: ComponentType<any> = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: ${props => props.alignItems || 'center'};
  justify-content: ${props => props.justifyContent || 'space-between'};
`;

export const Column: ComponentType<any> = styled.View`
  flex: 1;
`;

export const SearchContainer: ComponentType<any> = styled.View`
  bottom: 5px;
  width: 100%;
  margin-right: -30px;
`;

export const Image: ComponentType<any> = styled.Image`
  width: 195px;
  height: 153px;
  resize-mode: contain;
  margin-bottom: 20px;
  margin-top: -60px;
`;

export const Logo: ComponentType<any> = styled.Image`
  width: 70px;
  height: 70px;
  resize-mode: cover;
  margin-right: 15px;
  border-radius: 10px;
`;

export const Icon: ComponentType<any> = styled.Image`
  width: 13px;
  height: 13px;
  resize-mode: contain;
  margin-right: 8px;
`;

export const UnavailableTextContainer: ComponentType<any> = styled.View`
  padding-vertical: 3px;
  padding-horizontal: 7px;
  border-width: 1px;
  border-color: ${props => props.theme.color.orange};
  margin-top: 8px;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  color: props.theme.color.orange,
  fontSize: 18,
}))`
  margin-bottom: 10px;
`;

export const Subtitle: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  text-align: center;
`;

export const XIcon: ComponentType<any> = styled(IconFA).attrs(props => ({
  ...props,
  name: 'times',
  size: 18,
  color: props.theme.color.lightgray,
}))``;

export const MapIcon: ComponentType<any> = styled(MCIcon).attrs(props => ({
  ...props,
  name: 'map-marker-outline',
  color: props.theme.color.yellow,
  size: 15,
}))`
  padding: 0;
  margin-left: 10px;
  margin-right: 5px;
`;

export const UnavailableText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  color: props.theme.color.orange,
}))``;

export const Separator: ComponentType<any> = styled(Divider).attrs(props => ({
  ...props,
}))`
  margin-vertical: 3px;
`;
