/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import {useRoute} from '@react-navigation/native';

import type {PropsType} from './types';
import {AnimatedHeader, AnimatedImageHeader, Container, ImageBg, SearchBox} from './Styled';

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

  const SearchComponent = () => {
    const opacity = scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: [0, 1],
    });
    const style = {
      opacity,
      width: '100%',
    };
    return (
      <Animated.View style={style}>
        <SearchBox onValueChange={() => {}} />
      </Animated.View>
    );
  };

  const AnimatedHeaderTitle = useMemo(() => {
    const centerContainerStyle = {
      flex: 15,
    };
    const leftContainerStyle = {
      flex: 2,
      paddingTop: 3,
    };
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
          <Header
            hasBack
            backgroundColor="transparent"
            leftContainerStyle={leftContainerStyle}
            centerContainerStyle={centerContainerStyle}
            CenterComponent={SearchComponent}
          />
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
