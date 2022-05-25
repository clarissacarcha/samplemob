/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  width: 100%;
  border-radius: 5px;
  background-color: ${props => (props.type === 'primary' ? props.theme.color.orange : props.theme.color.white)};
  border-color: ${props => props.theme.color.orange};
  border-width: 1px;
  height: ${props => props.height};
  align-items: center;
  justify-content: center;
`;

export const ButtonText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'medium',
  fontSize: 15,
}))`
  color: ${props => (props.type === 'primary' ? props.theme.color.white : props.theme.color.orange)};
`;
