/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  margin-bottom: 20px;
  align-self: ${props => props.align || 'center'};
  text-align: ${props => props.align || 'center'};
`;
