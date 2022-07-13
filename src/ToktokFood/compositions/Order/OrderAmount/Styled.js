/* eslint-disable no-nested-ternary */
/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import ContentLoader from 'react-native-easy-content-loader';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Container: ComponentType<any> = styled.View`
  margin-top: 5px;
  padding-horizontal: 20px;
`;

export const AmountContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const AmountBreakdownContainer: ComponentType<any> = styled.View`
  margin-bottom: 15px;
`;

export const AmountText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: props.total ? 'medium' : 'regular',
  fontSize: props.total ? 17 : 13,
}))`
  color: ${props =>
    props.type === 'Discount'
      ? props.theme.color.darkgray
      : props.total
      ? props.theme.color.orange
      : props.sign === '-'
      ? props.theme.color.red
      : props.sign === '+'
      ? props.theme.color.green
      : props.theme.color.black};
  margin-bottom: 5px;
`;

export const Loader: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  paragraphStyles: {
    alignSelf: 'flex-end',
    right: '12%',
  },
}))``;

export const DiscountIcon: ComponentType<any> = styled(FeatherIcon).attrs(props => ({
  ...props,
}))`
  margin-left: 5px;
  bottom: 2px;
`;
