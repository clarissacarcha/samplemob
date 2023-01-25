/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-community/async-storage';
import React, {useState, useRef, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import constants from '../../../../common/res/constants';
import {arrow_right, food_header, onboarding1, onboarding2, onboarding3, onboarding_bg} from '../../../assets/images';

const {width, height} = Dimensions.get('screen');

const ImageDimension = Dimensions.get('screen').height * 0.3;
const SCREEN_HEIGHT_MARGIN = Dimensions.get('screen').height * 0.1;

const slides = [
  {
    id: '1',
    image: onboarding1,
    title: 'Choose a Restaurant',
    subtitle: 'Explore restaurants near you and pick a food you want to enjoy.',
  },
  {
    id: '2',
    image: onboarding2,
    title: 'Place Order',
    subtitle: 'Checkout your favorite food for your next foodtrip and save money by using our vouchers.',
  },
  {
    id: '3',
    image: onboarding3,
    title: 'Enjoy Your Food',
    subtitle:
      'Our toktok driver will collect and deliver your order ASAP. Surely, your cravings will be satisfied with just a few clicks.',
  },
];

const Slide = ({item}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <View style={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', width}}>
        <Image
          source={item?.image}
          style={{height: ImageDimension, width: width - 80, resizeMode: 'contain', marginTop: 20}}
        />
      </View>
      <View style={{flexGrow: 1, alignItems: 'center'}}>
        <Text style={styles.title}>{item?.title}</Text>

        <Text style={[styles.subtitle, {width: 300}]}> {item?.subtitle}</Text>
      </View>
    </View>
  );
};

export const ToktokFoodOnBoarding = ({navigation}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef();

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const onPress = async () => {
    navigation.replace('ToktokFoodLanding');
  };

  useEffect(() => {
    if (currentSlideIndex === slides.length - 1) {
      AsyncStorage.setItem('TOKTOKFOOD_ONBOARDING', JSON.stringify(false));
    }
  }, [currentSlideIndex]);

  const Footer = () => {
    return (
      <View style={{marginTop: 42}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && {
                  backgroundColor: constants.COLOR.ORANGE,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{marginBottom: 20}}>
          {currentSlideIndex === slides.length - 1 && (
            <TouchableOpacity
              style={{
                backgroundColor: constants.COLOR.ORANGE,
                marginHorizontal: 80,
                paddingVertical: 10,
                borderRadius: 5,
                marginTop: 32,
              }}
              onPress={onPress}>
              <Text
                style={{
                  color: constants.COLOR.WHITE,
                  fontSize: constants.FONT_SIZE.XL - 1,
                  fontFamily: constants.FONT_FAMILY.BOLD,
                  textAlign: 'center',
                }}>
                Get Started
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={onboarding_bg} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop(2)}>
        <Image source={arrow_right} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <View style={{alignItems: 'center'}}>
        <View style={{marginTop: StatusBar.currentHeight + SCREEN_HEIGHT_MARGIN}}>
          <Image source={food_header} resizeMode={'contain'} style={{height: 45, width: 190}} />
        </View>
        <FlatList
          ref={ref}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={slides}
          pagingEnabled
          renderItem={({item}) => <Slide item={item} />}
        />
      </View>
      <Footer />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
  },
  subtitle: {
    color: constants.COLOR.BLACK,
    fontSize: constants.FONT_SIZE.XL + 1,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  title: {
    color: constants.COLOR.ORANGE,
    fontSize: constants.FONT_SIZE.XL + 13,
    fontFamily: constants.FONT_FAMILY.SEMI_BOLD,
    marginTop: 20,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    width: 10,
    height: 10,
    backgroundColor: '#FBCEA6',
    marginHorizontal: 3,
    borderRadius: 10,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    zIndex: 999,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    left: 16,
    padding: 6,
  },
  iconDimensions: {
    width: 10,
    height: 15,
    transform: [{scaleX: -1}],
  },
});
