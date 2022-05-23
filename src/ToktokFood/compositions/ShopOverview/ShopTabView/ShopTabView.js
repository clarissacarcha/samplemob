/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {useLazyQuery} from '@apollo/react-hooks';

// import StyledText from 'toktokfood/components/StyledText';
import ShopItemList from 'toktokfood/compositions/ShopOverview/ShopItemList';

import type {PropsType} from './types';
import {AnimatedTabBar, ShopTabBar, TabBarTitle} from './Styled';

// Query
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_PRODUCT_CATEGORIES} from 'toktokfood/graphql/toktokfood';

const ShopTabView = (props: PropsType): React$Node => {
  const {scrollY, shopId, listOffset, listRefArr, isListGliding} = props;

  const layout = useWindowDimensions();

  // data fetching for product categories/tabs
  const [getProductCategories, {}] = useLazyQuery(GET_PRODUCT_CATEGORIES, {
    variables: {
      input: {
        id: shopId,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getProductCategories: categories}) => {
      setRoutes(categories);
    },
  });

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {
      key: 'allitems',
      title: 'All Menu',
    },
  ]);

  // console.log(routes[index]);
  useEffect(() => {
    getProductCategories();
  }, [shopId]);

  useEffect(() => {
    scrollY.addListener(({value}) => {
      const curRoute = routes[index].key;
      listOffset.current[curRoute] = value;
    });
    return () => {
      scrollY.removeAllListeners();
    };
  }, [routes, index]);

  const syncScrollOffset = () => {
    const curRouteKey = routes[index].key;
    listRefArr.current.map(item => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < 350 && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= 350) {
          if (listOffset.current[item.key] < 350 || listOffset.current[item.key] == null) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: 350,
                animated: false,
              });
              listOffset.current[item.key] = 350;
            }
          }
        }
      }
    });
  };

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
  };

  const onScrollEndDrag = () => {
    syncScrollOffset();
  };

  const onGetRef = (ref, route) => {
    if (ref) {
      const found = listRefArr.current.find(e => e.key === route.key);
      if (!found) {
        listRefArr.current.push({
          key: route.key,
          value: ref,
        });
      }
    }
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      default:
        return (
          <ShopItemList
            activeRoute={routes[index]}
            route={route}
            shopId={shopId}
            scrollY={scrollY}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onGetRef={ref => onGetRef(ref, route)}
          />
        );
    }
  };

  const renderLabel = ({route, focused}) => {
    return <TabBarTitle focused={focused}>{route.title}</TabBarTitle>;
  };

  const renderTabBar = tabprops => {
    const y = scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: [300, 0],
      extrapolateRight: 'clamp',
    });
    return (
      <AnimatedTabBar style={{transform: [{translateY: y}]}}>
        <ShopTabBar
          {...tabprops}
          onTabPress={({route, preventDefault}) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          renderLabel={renderLabel}
        />
      </AnimatedTabBar>
    );
  };

  return (
    <TabView
      // lazy
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{height: 0, width: layout.width}}
    />
  );
};

export default ShopTabView;
