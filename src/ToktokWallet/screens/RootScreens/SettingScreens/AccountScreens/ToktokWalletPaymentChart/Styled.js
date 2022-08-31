/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const ScrollContainer: ComponentType<any> = styled.ScrollView`
  flex: 1;
  background-color: #fff;
  padding-horizontal: 16px;
`;
