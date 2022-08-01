/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  padding-horizontal: 20px;
  padding-vertical: 15px;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
`;

export const AvatarContainer: ComponentType<any> = styled.View`
  border-radius: 50;
  padding: 2px;
  background-color: ${props => props.theme.color.orange};
`;

export const InfoContainer: ComponentType<any> = styled.View`
  justify-content: center;
  margin-left: 20px;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
}))`
  margin-bottom: ${props => (props.name ? 5 : 15)};
`;
