import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
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
import ArrowLeftIcon from '../../../../assets/icons/arrow-left-icon.png';
import {toktokmallH, gradientBG, onBoarding1, onBoarding2, onBoarding3} from '../../../assets';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const ImageDimension = Dimensions.get('screen').height * 0.3;
const SCREEN_HEIGHT_MARGIN = Dimensions.get('screen').height * 0.1;

const slides = [
  {
    id: '1',
    image: onBoarding1,
    title: 'Shop Endlessly',
    subtitle: 'Browse a large variety of products available from our partner merchants.',
  },
  {
    id: '2',
    image: onBoarding2,
    title: 'Add to Cart',
    subtitle: 'Add items to your cart at a lower\n price with additional vouchers that\n we offer.',
  },
  {
    id: '3',
    image: onBoarding3,
    title: 'Easy Checkout',
    subtitle: 'We will deliver your items in\n good condition to your doorstep.',
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

const Component = ({navigation, session, route}) => {

  const {userId} = route.params
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef();

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };
  
  const onPress = async () => {
    const date = moment(new Date()).format('MMM D, YYYY');
    AsyncStorage.setItem('ToktokMallUserOnboard', JSON.stringify({date, userId, firstTimeAccess: 1})).then(() => {
      navigation.navigate("ToktokMallLanding")
    })
  };

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
                currentSlideIndex == index && {
                  backgroundColor: constants.COLOR.ORANGE,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{marginBottom: 20}}>
          {currentSlideIndex == slides.length - 1 && (
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
    <ImageBackground source={gradientBG} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop(2)}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <View style={{alignItems: 'center'}}>
        <View style={{marginTop: StatusBar.currentHeight + SCREEN_HEIGHT_MARGIN}}>
          <Image source={toktokmallH} resizeMode={'contain'} style={{height: 45, width: 190}} />
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
const mapStateToProps = state => ({
  session: state.session,
});

export const ToktokMallOnBoarding = connect(mapStateToProps, null)(Component);

const styles = StyleSheet.create({
  container: {
    height: height
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
  },
});
