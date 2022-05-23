/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import {useRoute} from '@react-navigation/native';

import type {PropsType} from './types';
import {AnimatedHeader, AnimatedImageHeader, Container, ImageBg} from './Styled';

import Header from 'toktokfood/components/Header';
// import StyledText from 'toktokfood/components/StyledText';
import ShopInfo from 'toktokfood/compositions/ShopOverview/ShopInfo';
import ShopTabView from 'toktokfood/compositions/ShopOverview/ShopTabView';

const ToktokFoodShopOverview = (props: PropsType): React$Node => {
  const route = useRoute();
  const {item} = route.params;

  // Ref for scrolling animation
  let isListGliding = useRef(false);
  let listRefArr = useRef([]);
  let listOffset = useRef({});
  const scrollY = new Animated.Value(0);

  const AnimatedHeaderTitle = useMemo(() => {
    // interpolate image and shopinfo
    const translateY = scrollY.interpolate({
      inputRange: [0, 350],
      outputRange: [0, -350],
      extrapolateRight: 'clamp',
    });
    // interpolate bgcolor for header
    const backgroundColor = scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: ['transparent', 'white'],
      extrapolate: 'clamp',
      // useNativeDriver: true,
    });
    return (
      <React.Fragment>
        <AnimatedHeader style={{backgroundColor}}>
          <Header hasBack backgroundColor="transparent" />
        </AnimatedHeader>
        <AnimatedImageHeader style={{transform: [{translateY}]}}>
          <ImageBg source={item?.banner} />
          <ShopInfo shopInfo={item} />
        </AnimatedImageHeader>
      </React.Fragment>
    );
  });

  return (
    <Container>
      <ShopTabView
        shopId={item.id}
        isListGliding={isListGliding}
        listRefArr={listRefArr}
        listOffset={listOffset}
        scrollY={scrollY}
      />
      {AnimatedHeaderTitle}
    </Container>
  );
};

export default ToktokFoodShopOverview;
