/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import Header from 'toktokfood/components/Header';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: ${props => props.theme.color.white};
`;

export const ComponentContainer: ComponentType<any> = styled.View`
  padding: 20px;
  background-color: ${props => props.theme.color.white};
`;

export const PabiliTCContainer: ComponentType<any> = styled.View`
  padding: 20px;
  padding-top: 0px;
`;

export const DividerContainer: ComponentType<any> = styled.View`
  padding-horizontal: 20px;
`;

export const HeaderContainer: ComponentType<any> = styled.View`
  border-bottom-width: 1;
  border-bottom-color: rgba(0, 0, 0, 0.05);
`;

export const PlaceOrderHeader: ComponentType<any> = styled(Header).attrs(props => ({
  ...props,
  titleStyle: {
    fontSize: 17,
  },
  centerContainerStyle: {
    top: Platform.OS === 'ios' ? 5 : 8,
  },
}))``;
