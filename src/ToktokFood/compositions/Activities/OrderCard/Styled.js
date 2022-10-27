/* eslint-disable no-nested-ternary */
/**
 * @flow
 */

import type {ComponentType} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import ContentLoader from 'react-native-easy-content-loader';

export const Container: ComponentType<any> = styled.View`
  background-color: ${props => props.theme.color.white};
  border-radius: 5px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.1);
  shadow-color: ${props => props.theme.color.black};
  shadow-opacity: 0.1px;
  shadow-radius: 5.84px;
  elevation: 3px;
`;

export const RefNumContainer: ComponentType<any> = styled.View`
  background-color: ${props => props.theme.color.lightYellow};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BottomContainer: ComponentType<any> = styled.View`
  background-color: ${props => props.theme.color.white};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 20px;
`;

export const Column: ComponentType<any> = styled.View``;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Icon: ComponentType<any> = styled.Image`
  width: ${props => (props.orderStatus ? (props.orderStatus === 'c' || props.orderStatus === 's' ? 16 : 10) : 17)};
  height: 17px;
  resize-mode: cover;
  margin-right: 8px;
`;

export const Image: ComponentType<any> = styled.Image`
  width: 50px;
  height: 50px;
  resize-mode: cover;
  margin-right: 10px;
  border-radius: 10px;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  margin-bottom: 5px;
  width: ${props => props.width || '100%'};
  max-width: ${props => props.width || '100%'};
`;

export const Subtitle: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  color: props.theme.color.darkgray,
}))`
  width: 90%;
  max-width: 90%;
`;

export const Button: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
  activeOpacity: 0.7,
}))``;

export const CustomLoader: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  paragraphStyles: {
    alignSelf: 'flex-end',
    right: props.right || '0%',
  },
}))``;
