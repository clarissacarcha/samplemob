/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useLazyQuery} from '@apollo/react-hooks';
import moment from 'moment';
import {useSelector} from 'react-redux';

import type {PropsType} from './types';
import {AnimatedHeader, AnimatedImageHeader, Container, ImageBg, Pager, PageView, SearchBox} from './Styled';

import Alert from 'toktokfood/components/Alert';
import Header from 'toktokfood/components/Header';
import ShopInfo from 'toktokfood/compositions/ShopOverview/ShopInfo';
import ShopTabView from 'toktokfood/compositions/ShopOverview/ShopTabView';
import ShopSearchItemList from 'toktokfood/compositions/ShopOverview/ShopSearchItemList';
import ShopViewCart from 'toktokfood/compositions/ShopOverview/ShopViewCart/ShopViewCart';

import {useDebounce} from 'toktokfood/util/debounce';
import {getWeekDay} from 'toktokfood/helper/strings';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SHOP_DETAILS} from 'toktokfood/graphql/toktokfood';

const ToktokFoodShopOverview = (props: PropsType): React$Node => {
  const route = useRoute();
  const navigation = useNavigation();
  const {item} = route.params;
  const {location} = useSelector(state => state.toktokFood);
  // console.log(item);
  // State
  const [search, setSearch] = useState('');
  const [shopDetails, setShopDetails] = useState<any>(null);
  const [nextSched, setNextSched] = useState(null);

  // Ref for scrolling animation
  let isListGliding = useRef(false);
  let listRefArr = useRef([]);
  let listOffset = useRef({});
  let pagerViewRef: any = useRef({});
  const scrollY = new Animated.Value(0);

  // Debounce
  const debounceText = useDebounce(search, 1000);

  // Queries
  const [getShopDetails, {}] = useLazyQuery(GET_SHOP_DETAILS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
    onCompleted: ({getShopDetails}) => {
      let {latitude, longitude, hasOpen, nextOperatingHrs, hasProduct} = getShopDetails;
      if (nextOperatingHrs) {
        setNextSched(nextOperatingHrs);
      }
      // dispatch({type: 'SET_TOKTOKFOOD_SHOP_COORDINATES', payload: {latitude, longitude}});
      setShopDetails(getShopDetails);
      // onCheckShop(hasOpen && hasProduct);
    },
  });

  useEffect(() => {
    getShopDetails({
      variables: {
        input: {
          shopId: item?.id,
          userLongitude: location?.longitude,
          userLatitude: location?.latitude,
        },
      },
    });
  }, []);

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

  const OperatingHours = () => {
    const {operatingHours, dayLapsed, hasProduct} = shopDetails;
    const {fromTime: currFromTime} = operatingHours;
    const isAboutToOpen = moment().isBefore(moment(currFromTime, 'HH:mm:ss'));

    if (nextSched === null || !hasProduct) {
      return "Restaurant is currently unavailable. {'\n'}Please come back at a later time.";
    }
    if (isAboutToOpen || dayLapsed === 0) {
      return `Restaurant is currently closed.\n Please come back at ${moment(
        dayLapsed === 0 ? nextSched.fromTime : currFromTime,
        'hh:mm:ss',
      ).format('hh:mm A')}`;
    }
    return `Restaurant is currently closed. Please come back on ${getWeekDay(nextSched.day, true)}, ${moment(
      nextSched.fromTime,
      'hh:mm:ss',
    )
      .add(dayLapsed, 'day')
      .format('MMMM DD')} at ${moment(nextSched.fromTime, 'hh:mm:ss').format('hh:mm A')}`;
  };

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

      <Alert
        isVisible={shopDetails && !shopDetails?.hasOpen && shopDetails?.hasProduct}
        title="Currently Closed"
        subtitle={shopDetails ? OperatingHours() : 'test'}
        buttonText="OK"
        type="warning"
        onPress={() => navigation.goBack()}
      />

      <Alert
        isVisible={shopDetails && !shopDetails?.hasProduct}
        title="Currently Closed"
        subtitle={`Restaurant is currently unavailable.\n Please come back at a later time`}
        buttonText="OK"
        type="warning"
        onPress={() => navigation.goBack()}
      />
    </Container>
  );
};

export default ToktokFoodShopOverview;
