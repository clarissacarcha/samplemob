/**
 * @flow
 */

import type {ComponentType} from 'react';
import {Animated, SectionList} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import {getDeviceHeight} from 'toktokfood/helper/scale';
import Divider from 'toktokfood/components/Divider';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

export const EmptyContainer: ComponentType<any> = styled.View`
  flex: 1;
  border-width: 1px;
`;

export const AnimatedList: ComponentType<any> = styled(AnimatedSectionList).attrs(props => ({
  ...props,
  showsVerticalScrollIndicator: false,
  //   scrollToOverflowEnabled: true,
  scrollEventThrottle: 16,
  contentContainerStyle: {
    flex: 1,
    backgroundColor: props.theme.color.white,
    paddingTop: 80,
    // paddingHorizontal: 15,
    minHeight: getDeviceHeight + 300,
    // minHeight: getDeviceHeight + (props.totalItems < 9 ? 300 : 400),
  },
  onEndReachedThreshold: 0.2,
}))``;

// Loader
export const ContentLoading: ComponentType<any> = styled(ContentLoader).attrs(props => ({
  ...props,
  active: true,
  title: false,
  pRows: 3,
  pHeight: [10, 10, 15],
  pWidth: ['40%', '80%', '30%'],
  // primaryColor: props.theme.color.yellow,
  // secondaryColor: 'rgba(256,186,28,0.4)',
  aShape: 'square',
  aSize: 'large',
  avatar: true,
  listSize: 10,
  // loading: false,
}))`
  padding-horizontal: 10px;
  padding-top: 50;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  fontSize: 18,
}))`
  margin-vertical: 10px;
  margin-left: 15px;
`;

export const Separator: ComponentType<any> = styled(Divider).attrs(props => ({
  ...props,
  height: 8,
}))`
  margin-vertical: 10px;
`;
