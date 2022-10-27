/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const RadioContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ActiveContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const RightContainer: ComponentType<any> = styled.View`
  flex-direction: column;
  justify-content: center;
`;

export const OuterContainer: ComponentType<any> = styled.View`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  border-width: 1px;
  border-color: ${props => (props.disabled ? props.theme.color.gray : props.theme.color.yellow)};
  border-radius: 50px;
  padding: 1px;
`;

export const InnerContainer: ComponentType<any> = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${props => (props.checked ? props.theme.color.yellow : props.theme.color.white)};
  border-radius: 50px;
`;

export const RadioLabel: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.disabled ? props.theme.color.gray : props.theme.color.black,
}))`
  line-height: 30px;
`;
