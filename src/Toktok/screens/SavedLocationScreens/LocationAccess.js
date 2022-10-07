import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, ImageBackground} from 'react-native';

// helper
import CONSTANTS from '../../../common/res/constants';
import {MAP_DELTA_LOW} from '../../../res/constants';
import {ThrottledOpacity} from '../../../components_section';
import {currentLocation} from '../../../helper';

// images
import GradiantBG from '../../../assets/images/LinearGradiant.png';
import TokLogo from '../../../assets/images/ToktokGoIcon.png';
import LocatioAccessIMG from '../../../assets/images/LocationAccess.png';

const FULL_WIDTH = Dimensions.get('window').width;

export const LocationAccess = ({navigation, route}) => {
  const [locCoordinates, setLocCoordinates] = useState({});

  const getCurrentLocation = async () => {
    const {latitude, longitude} = await currentLocation({showsReverseGeocode: false});
    setLocCoordinates({
      latitude: latitude,
      longitude: longitude,
      ...MAP_DELTA_LOW,
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <ImageBackground source={GradiantBG} style={{flex: 1}}>
      <View style={styles.wrapper}>
        <Image source={TokLogo} resizeMode={'contain'} style={styles.logoDimensions} />
        <Text style={styles.titleText}>What’s your location, ka-toktok?</Text>
        <Text style={styles.descriptionText}>
          As your daily app, share your location with us for faster and accurate transactions.
        </Text>
        <Image source={LocatioAccessIMG} resizeMode={'contain'} style={styles.locationImgDimensions} />
      </View>
      <View style={styles.buttonWrapper}>
        <ThrottledOpacity
          delay={4000}
          style={styles.primaryBtn}
          onPress={() => navigation.push('ToktokAddLocation', {addressObj: null, isFromLocationAccess: true})}>
          <Text style={styles.primaryBtnText}>Enter My Address</Text>
        </ThrottledOpacity>
        <ThrottledOpacity
          delay={4000}
          style={styles.secondaryBtn}
          onPress={() => navigation.push('PinLocation', {locCoordinates, isFromLocationAccess: true})}>
          <Text style={styles.secondaryBtnText}>Use My Current Location</Text>
        </ThrottledOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingTop: '20%',
  },
  logoDimensions: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  titleText: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginBottom: 16,
  },
  descriptionText: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.M,
    width: FULL_WIDTH * 0.75,
    marginBottom: 24,
  },
  locationImgDimensions: {
    width: FULL_WIDTH * 0.6,
    height: FULL_WIDTH * 0.6,
  },
  buttonWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 32,
  },
  primaryBtn: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    width: FULL_WIDTH - 64,
    paddingVertical: 11,
    borderRadius: 5,
    marginBottom: 16,
  },
  primaryBtnText: {
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontWeight: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    textAlign: 'center',
  },
  secondaryBtn: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    width: FULL_WIDTH - 64,
    paddingVertical: 10,
    borderRadius: 5,
  },
  secondaryBtnText: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontWeight: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    textAlign: 'center',
  },
});
