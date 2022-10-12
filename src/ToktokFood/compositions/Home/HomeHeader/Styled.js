/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Icon} from 'react-native-elements';
import ContentLoader from 'react-native-easy-content-loader';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  /* flex: 1; */
  z-index: 1;
`;

export const AddressContainer: ComponentType<any> = styled.TouchableOpacity`
  /* flex: 1; */
  align-self: flex-start;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  /* flex: 1; */
`;

export const DownIcon: ComponentType<any> = styled(Icon).attrs(props => ({
  ...props,
  name: props.icon || 'chevron-down-outline',
  type: 'ionicon',
  color: props.color || props.theme.color.black,
  size: 15,
}))``;

export const StyledIcon: ComponentType<any> = styled(Icon).attrs(props => ({
  ...props,
  name: props.icon || 'ellipsis-vertical',
  type: 'ionicon',
  color: props.color || props.theme.color.orange,
  size: 26,
  containerStyle: {
    marginHorizontal: 5,
  },
}))``;

export const Loader: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  active: true,
  title: false,
  pRows: 1,
  pWidth: ['100%'],
  primaryColor: '#FFFFFF',
  secondaryColor: 'rgba(256,186,28,0.4)',
  containerStyles: {
    left: -10,
  },
}))``;

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  line-height: 35px;
`;
