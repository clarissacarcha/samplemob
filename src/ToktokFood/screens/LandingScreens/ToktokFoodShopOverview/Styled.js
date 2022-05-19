/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Animated, ImageBackground, ScrollView} from 'react-native';
import styled from 'styled-components/native';

// Assets
import {starbucks_banner} from 'toktokfood/assets/images';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
`;

export const ScrollContainer: ComponentType<any> = styled(Animated.ScrollView).attrs(props => ({
  ...props,
  //   stickyHeaderIndices: [0],
}))`
  border-width: 1px;
  position: absolute;
  top: 50px;
  height: 100%;
  padding-top: 300px;
`;

export const AnimatedHeader: ComponentType<any> = styled(Animated.View).attrs(props => ({
  ...props,
}))`
  position: absolute;
`;

export const ImageBg: ComponentType<any> = styled(ImageBackground).attrs(props => ({
  ...props,
  source: starbucks_banner,
}))`
  height: 320px;
`;
