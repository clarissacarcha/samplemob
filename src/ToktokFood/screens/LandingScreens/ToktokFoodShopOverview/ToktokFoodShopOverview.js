/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {useRoute} from '@react-navigation/native';

import type {PropsType} from './types';
import {AnimatedHeader, AnimatedImageHeader, Container, ImageBg, Pager, PageView, SearchBox} from './Styled';

import Header from 'toktokfood/components/Header';
import ShopInfo from 'toktokfood/compositions/ShopOverview/ShopInfo';
import ShopTabView from 'toktokfood/compositions/ShopOverview/ShopTabView';
import ShopSearchItemList from 'toktokfood/compositions/ShopOverview/ShopSearchItemList';
import ShopViewCart from 'toktokfood/compositions/ShopOverview/ShopViewCart/ShopViewCart';

import {useDebounce} from 'toktokfood/util/debounce';

const ToktokFoodShopOverview = (props: PropsType): React$Node => {
  const route = useRoute();
  const {item} = route.params;
  console.log(item);
  // State
  const [search, setSearch] = useState('');

  // Ref for scrolling animation
  let isListGliding = useRef(false);
  let listRefArr = useRef([]);
  let listOffset = useRef({});
  let pagerViewRef: any = useRef({});
  const scrollY = new Animated.Value(0);

  // Debounce
  const debounceText = useDebounce(search, 1000);

  useEffect(() => {
    if (debounceText) {
      pagerViewRef?.current.setPage(1);
    } else {
      pagerViewRef?.current.setPage(0);
    }
  }, [debounceText]);

  const SearchComponent = () => {
    // opacity animation for search bar
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
        <SearchBox
          hasClose={search || false}
          onClose={() => setSearch('')}
          onValueChange={text => setSearch(text)}
          value={search}
        />
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

  // const onPress = (params: ParamTypes) => {};

  return (
    <Container>
      <Pager ref={pagerViewRef}>
        <PageView key="1">
          <ShopTabView
            shopId={item.id}
            isListGliding={isListGliding}
            listRefArr={listRefArr}
            listOffset={listOffset}
            scrollY={scrollY}
          />
        </PageView>
        <PageView key="2">
          <ShopSearchItemList search={debounceText} shopId={item?.id} />
        </PageView>
      </Pager>

      {AnimatedHeaderTitle}

      <ShopViewCart shopId={item?.id} />
    </Container>
  );
};

export default ToktokFoodShopOverview;
