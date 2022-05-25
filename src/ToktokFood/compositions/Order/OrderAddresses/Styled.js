/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

export const Container: ComponentType<any> = styled.View`
  padding-horizontal: 20px;
  flex-direction: row;
  align-items: center;
`;

export const AddressContainer: ComponentType<any> = styled.View`
  flex: 1;
  padding-top: 20px;
`;

export const AddressIconContainer: ComponentType<any> = styled.View`
  margin-bottom: 20px;
  justify-content: center;
`;

export const IconContainer: ComponentType<any> = styled.View``;

export const Icon: ComponentType<any> = styled(FontAwesomeIcon).attrs(props => ({
  ...props,
}))`
  margin-right: 15px;
  padding: 0px;
`;

export const DashContainer: ComponentType<any> = styled.View`
  height: ${props => props.height};
  flex-direction: row;
  padding-left: 5px;
  margin-vertical: 3px;
`;
