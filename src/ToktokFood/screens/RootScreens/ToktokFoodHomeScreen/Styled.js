/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  /* background-color: ${props => props.theme.color.white}; */
`;

export const ScrollContainer: ComponentType<any> = styled(ScrollView).attrs(props => ({
  ...props,
}))`
  flex: 1;
`;
