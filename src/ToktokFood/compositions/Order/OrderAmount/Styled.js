/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import ContentLoader from 'react-native-easy-content-loader';

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
  margin-right: ${props => (props.total ? '10' : 0)};
  color: ${props => (props.total ? props.theme.color.orange : props.theme.color.black)};
  margin-bottom: 5px;
`;

export const Loader: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  paragraphStyles: {
    alignSelf: 'flex-end',
    right: '12%',
  },
}))``;
