/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  fontSize: props.size || 20,
  color: props.color || props.theme.color.orange,
}))`
  /* margin-bottom: 20px; */
  /* align-self: ${props => props.align || 'center'}; */
  text-align: ${props => props.align || 'center'};
`;
