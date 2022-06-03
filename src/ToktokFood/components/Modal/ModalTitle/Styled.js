/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  fontSize: 20,
  color: props.theme.color.orange,
}))`
  margin-bottom: 20px;
  align-self: center;
  text-align: center;
`;
