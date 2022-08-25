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
import constants from '../../../common/res/constants';
import GradientBackground from '../../../assets/toktokgo/BackGroundBeta.png';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import ToktokgoIcon from '../../../assets/images/ToktokgoIconBeta.png';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {useAccount} from 'toktokwallet/hooks';
import {connect} from 'react-redux';

const {width} = Dimensions.get('screen');

const ImageDimension = Dimensions.get('screen').height * 0.3;
const SCREEN_HEIGHT_MARGIN = Dimensions.get('screen').height * 0.1;

const slides = [
  {
    id: '1',
    image: require('../../../assets/images/StartBookingImages.png'),
    title: 'Start Booking',
    subtitle: 'Select your pick-up\nand destination.',
  },
  {
    id: '2',
    image: require('../../../assets/images/FindDriverImage.png'),
    title: 'Find a Driver',
    subtitle: 'We will automatically find you the\nnearest available driver.',
  },
  {
    id: '3',
    image: require('../../../assets/images/EnjoyYourRideImage.png'),
    title: 'Enjoy the Ride',
    subtitle: 'Sit back and relax while we bring\nyou to your destination.',
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

const ToktokGoOnBoardingBeta = ({navigation, session, route}) => {
  const {voucherData} = route.params;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef();
  const {tokwaAccount, getMyAccount} = useAccount();

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };
  useEffect(() => {
    if (session.user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, []);

  const onPress = async () => {
    const data = moment(new Date()).format('MMM D, YYYY');
    const date = await AsyncStorage.getItem('ToktokGoHealthCare');
    AsyncStorage.setItem('ToktokGoOnBoardingBeta', data);

    if (date === moment(new Date()).format('MMM D, YYYY')) {
      navigation.replace('ToktokGoBookingStart', {voucherData});
    } else if (tokwaAccount.wallet.id) {
      navigation.replace('ToktokGoHealthCare', {voucherData});
    } else {
      navigation.replace('ToktokGoCreateTokwa', {voucherData});
    }
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
    <ImageBackground source={GradientBackground} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <View style={{alignItems: 'center'}}>
        <View style={{marginTop: StatusBar.currentHeight + SCREEN_HEIGHT_MARGIN}}>
          <Image source={ToktokgoIcon} resizeMode={'contain'} style={{height: 45, width: 190}} />
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

export default connect(mapStateToProps, null)(ToktokGoOnBoardingBeta);

const styles = StyleSheet.create({
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
