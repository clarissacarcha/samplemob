/* eslint-disable no-nested-ternary */
/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Container: ComponentType<any> = styled.View`
  padding: 20px;
`;

export const DividerContainer: ComponentType<any> = styled.View`
  margin-vertical: 15px;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const AmountText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color:
    props.type === 'discount'
      ? props.theme.color.gray
      : props.sign === '-'
      ? props.theme.color.red
      : props.title === 'Total'
      ? props.theme.color.orange
      : props.theme.color.black,
  mode: props.title === 'Total' ? 'medium' : 'regular',
}))`
  line-height: 26px;
`;

export const Icon: ComponentType<any> = styled(FeatherIcon).attrs(props => ({
  ...props,
}))`
  top: 1px;
  margin-left: 7px;
`;
