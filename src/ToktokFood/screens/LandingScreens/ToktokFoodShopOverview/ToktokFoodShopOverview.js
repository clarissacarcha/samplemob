/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {useSelector} from 'react-redux';

import type {PropsType} from './types';
import {
  AnimatedHeader,
  AnimatedImageHeader,
  Container,
  ImageBg,
  Pager,
  PageView,
  SearchBox,
  ImageHeader,
  BackButton,
  BodyContainer,
  Text,
} from './Styled';
import {useTheme} from 'styled-components';
import Alert from 'toktokfood/components/Alert';
import ShopInfo from 'toktokfood/compositions/ShopOverview/ShopInfo';
import ShopTabView from 'toktokfood/compositions/ShopOverview/ShopTabView';
import ShopSearchItemList from 'toktokfood/compositions/ShopOverview/ShopSearchItemList';
import ShopViewCart from 'toktokfood/compositions/ShopOverview/ShopViewCart/ShopViewCart';
import {useDebounce} from 'toktokfood/util/debounce';
import {getWeekDay} from 'toktokfood/helper/strings';
import {useGetProductCategories} from 'toktokfood/hooks';

const AnimatedIcon = Animated.createAnimatedComponent(BackButton);

const ToktokFoodShopOverview = (props: PropsType): React$Node => {
  const route = useRoute();
  const navigation = useNavigation();
  const {item} = route.params;
  const theme = useTheme();
  // State
  const [search, setSearch] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const {loading, routes, refetch} = useGetProductCategories(item?.id);

  // Ref for scrolling animation
  let isListGliding = useRef(false);
  let listRefArr = useRef([]);
  let listOffset = useRef({});
  let pagerViewRef: any = useRef({});
  const scrollY = new Animated.Value(0);

  // Debounce
  const debounceText = useDebounce(search, 1000);

  useEffect(() => {
    if (item && Object.keys(item).length > 0) {
      const {hasOpen, hasProduct} = item;
      if (!hasOpen || !hasProduct) {
        setIsAlertVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    if (debounceText) {
      pagerViewRef?.current.setPage(1);
    } else {
      pagerViewRef?.current.setPage(0);
    }
  }, [debounceText]);

  const LeftComponent = () => {
    const arrowColor = scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: [theme.color.black, theme.color.orange],
    });
    const backgroundColor = scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: ['rgba(204, 204, 204, 0.5)', 'rgba(204, 204, 204, 0)'],
    });
    const style = {
      backgroundColor,
      borderRadius: 50,
      padding: 5,
    };
    return (
      <Animated.View style={style}>
        <AnimatedIcon color={arrowColor} onPress={() => navigation.goBack()} />
      </Animated.View>
    );
  };

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

  const renderAlertComponent = () => {
    const {dayLapsed, hasProduct, operatingHours, nextOperatingHrs} = item;

    const BodyComponent = () => {
      const {fromTime: currFromTime} = operatingHours;
      const isAboutToOpen = moment().isBefore(moment(currFromTime, 'HH:mm:ss'));

      if (nextOperatingHrs === null || !hasProduct) {
        return <Text>Restaurant is currently unavailable. Please come back at a later time.</Text>;
      }
      if (isAboutToOpen || dayLapsed === 0) {
        return (
          <Text>
            Restaurant is currently closed. Please come back at{' '}
            <Text mode="semibold">
              {moment(dayLapsed === 0 ? nextOperatingHrs?.fromTime : currFromTime, 'hh:mm:ss').format('hh:mm A')}
            </Text>
          </Text>
        );
      }
      return (
        <Text>
          Restaurant is currently closed. Please come back on{' '}
          <Text mode="semibold">
            {getWeekDay(nextOperatingHrs?.day, true)},{' '}
            {moment(nextOperatingHrs?.fromTime, 'hh:mm:ss').add(dayLapsed, 'day').format('MMMM DD')} at{' '}
            {moment(nextOperatingHrs?.fromTime, 'hh:mm:ss').format('hh:mm A')}.
          </Text>
        </Text>
      );
    };

    const BodyComponentWrapper = () => (
      <BodyContainer>
        <BodyComponent />
      </BodyContainer>
    );

    return (
      <Alert
        isVisible={isAlertVisible}
        type="warning"
        title="Currently Closed"
        buttonText="OK"
        onPress={() => {
          setIsAlertVisible(false);
          navigation.goBack();
        }}
        BodyComponent={() => <BodyComponentWrapper />}
      />
    );
  };

  const AnimatedHeaderTitle = useMemo(() => {
    const centerContainerStyle = {
      flex: 20,
      marginRight: -10,
    };
    const leftContainerStyle = {
      flex: 3,
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
      inputRange: [0, 250],
      outputRange: ['transparent', 'white'],
      extrapolate: 'clamp',
      // useNativeDriver: true,
    });
    return (
      <React.Fragment>
        <AnimatedHeader style={{backgroundColor}}>
          <ImageHeader
            // hasBack
            LeftComponent={LeftComponent}
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
      <Pager ref={pagerViewRef}>
        <PageView key="1">
          <ShopTabView
            shopId={item.id}
            isListGliding={isListGliding}
            listRefArr={listRefArr}
            listOffset={listOffset}
            scrollY={scrollY}
            routes={routes}
            loading={loading}
            refetch={refetch}
          />
        </PageView>
        <PageView key="2">
          <ShopSearchItemList search={debounceText} shopId={item?.id} routes={routes} />
        </PageView>
      </Pager>

      {AnimatedHeaderTitle}
      {renderAlertComponent()}
      {item?.hasOpen && item?.hasProduct && !search && <ShopViewCart shopId={item?.id} />}
    </Container>
  );
};

export default ToktokFoodShopOverview;
