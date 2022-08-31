/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  padding-horizontal: 20px;
  padding-top: 20px;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  margin-bottom: 10px;
`;

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.darkgray,
}))`
  margin-bottom: 20px;
`;
