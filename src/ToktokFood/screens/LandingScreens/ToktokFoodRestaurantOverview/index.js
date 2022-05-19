import React, {useEffect, useState} from 'react';
import {Animated, View, ScrollView, StyleSheet, Modal, Text, TouchableOpacity, Dimensions} from 'react-native';
import {verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

const phoneDimensions = Dimensions.get('window');

// import {useSelector} from 'react-redux';

import {StickyView} from './components';
import {FoodCart, VerifyContextProvider} from './components';
import Header from 'toktokfood/components/Header';
import StyledText from 'toktokfood/components/StyledText';

import {GET_SHOP_DETAILS} from 'toktokfood/graphql/toktokfood';
import {COLOR, FONT, FONT_SIZE, SIZE} from 'res/variables';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

// import {useNavigation} from '@react-navigation/native';

// import moment from 'moment';
// import {getWeekDay} from 'toktokfood/helper/strings';

const ToktokFoodRestaurantOverview = ({route}) => {
  const [showCart, setShowCart] = useState(false);
  const scrollY = new Animated.Value(0);
  const translateY = scrollY.interpolate({
    inputRange: [0, 45],
    outputRange: [0, -45],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  const bgColor = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['transparent', 'white'],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  const DATA = [
    {
      id: 1,
      title: 'The Hunger Games',
    },
    {
      id: 2,
      title: 'Harry Potter and the Order of the Phoenix',
    },
    {
      id: 3,
      title: 'To Kill a Mockingbird',
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
    },
    {
      id: 5,
      title: 'Twilight',
    },
    {
      id: 6,
      title: 'The Book Thief',
    },
    {
      id: 7,
      title: 'The Chronicles of Narnia',
    },
    {
      id: 8,
      title: 'Animal Farm',
    },
    {
      id: 9,
      title: 'Gone with the Wind',
    },
    {
      id: 10,
      title: 'The Shadow of the Wind',
    },
    {
      id: 11,
      title: 'The Fault in Our Stars',
    },
    {
      id: 12,
      title: "The Hitchhiker's Guide to the Galaxy",
    },
    {
      id: 13,
      title: 'The Giving Tree',
    },
    {
      id: 14,
      title: 'Wuthering Heights',
    },
    {
      id: 15,
      title: 'The Da Vinci Code',
    },
  ];

  return (
    <>
      <VerifyContextProvider>
        <View style={styles.container}>
          <Animated.View style={{backgroundColor: bgColor}}>
            <Header hasBack backgroundColor="transparent" />
          </Animated.View>

          <Animated.ScrollView
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {contentOffset: {y: scrollY}},
                },
              ],
              {
                listener: event => {},
                useNativeDriver: false,
              },
            )}
            scrollEventThrottle={16}>
            {DATA.map(() => (
              <StyledText fontSize={80}>Test Scroll</StyledText>
            ))}
          </Animated.ScrollView>
          {/* <StickyView onCheckShop={v => setShowCart(v)} /> */}
          {/* {showCart && <FoodCart />} */}
        </View>
      </VerifyContextProvider>
    </>
  );
};

export default ToktokFoodRestaurantOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
  },
  wrapper: {
    width: phoneDimensions.width + 10,
    paddingLeft: 5,
    paddingBottom: 20,
    position: 'absolute',
    backgroundColor: COLOR.WHITE,
  },
  sheetBorder: {
    borderTopWidth: 3,
    borderEndWidth: 2,
    borderStartWidth: 2,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderColor: COLOR.ORANGE,
    marginHorizontal: 0,
  },
  sheet: {
    flex: 1,
    paddingHorizontal: 10,
  },
  closeText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FONT.BOLD,
    marginVertical: 20,
    textAlign: 'center',
  },
  closeButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    backgroundColor: '#FFA700',
    width: getDeviceWidth - 28,
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});
