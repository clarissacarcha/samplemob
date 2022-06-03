import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Animated,
  TouchableHighlight,
  ImageBackground,
  Platform,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//HELPER
import {getStatusbarHeight, moderateScale} from 'toktokbills/helper';

//IMAGE
import {onboarding_bg} from 'toktokbills/assets';

//HOOKS
import {useThrottle} from 'src/hooks';
import {useSelector} from 'react-redux';

//SELF  IMPORTS
import {PageFour, PageOne, PageThree, PageTwo, RenderDots} from './Components';
import {YellowButton, VectorIcon, ICON_SET} from 'src/revamp';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

const {width} = Dimensions.get('window');

const data = [PageOne, PageTwo, PageThree, PageFour];

export const ToktokBillsOnboarding = () => {
  const navigation = useNavigation();

  const tokwaAccount = useSelector(state => state.toktokWallet);
  const slider = useRef(null);

  navigation.setOptions({
    headerShown: false,
  });

  const scrollX = useRef(new Animated.Value(0)).current;
  const dotPosition = Animated.divide(scrollX, width);
  const [currentIndex, setCurrentIndex] = useState(0);

  const skip = () => {
    return navigation.push('ToktokWalletRestricted', {component: 'noMpin'});
  };

  const onPressThrottled = useThrottle(skip, 2000);

  return (
    <ImageBackground style={styles.container} source={onboarding_bg} resizeMode={'cover'}>
      <View style={styles.subContainer}>
        <Animated.FlatList
          ref={slider}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={data}
          bounces={false}
          scrollEventThrottle={16}
          snapToAlignment="center"
          pagingEnabled
          onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
            useNativeDriver: false,
            listener: event => {
              const offsetX = event.nativeEvent.contentOffset.x;

              let index = Math.ceil(offsetX / width);

              if (index % 1 == 0) {
                setCurrentIndex(index);
                return;
              }
            },
          })}
          renderItem={({item, index}) => {
            const rotate = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: ['-180deg', '0deg', '180deg'],
            });

            const scale = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0, 1, 0],
            });

            return item({label: `Template ${index}`, rotate, scale, tokwaAccount});
          }}
        />
        {/* <PageOne /> */}
        <RenderDots
          scrollX={scrollX}
          data={data}
          sliderRef={slider}
          dotPosition={dotPosition}
          setCurrentIndex={setCurrentIndex}
          currentIndex={currentIndex}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  subContainer: {
    flex: 1,
    marginTop: moderateScale(Platform.OS == 'android' ? StatusBar.currentHeight : 0),
    marginBottom: moderateScale(Platform.OS == 'android' ? 10 : 0),
  },
  headings: {
    height: 92,
    backgroundColor: 'black',
  },
  skip: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  skipText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyWalletText: {
    fontFamily: FONT.BOLD,
    fontSize: 16,
    textAlign: 'center',
  },
  clickVerifyText: {
    marginTop: 5,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    textAlign: 'center',
  },
  listItem: {
    fontFamily: FONT.REGULAR,
    marginBottom: 5,
    fontSize: FONT_SIZE.S,
  },
  dots: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    width: width,
    flexDirection: 'row',
  },
});
