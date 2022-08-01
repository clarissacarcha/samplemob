/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';

export const Container: ComponentType<any> = styled(ScrollView).attrs(props => ({
  ...props,
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  scrollEnabled: false,
  contentContainerStyle: {
    width: '100%',
  },
}))``;
