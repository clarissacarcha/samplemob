import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
  Image,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import {moderateScale, getStatusbarHeight, checkViewOnboarding} from 'toktokbills/helper';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {onboarding_toktokbills, maintenance_bg, maintenance_bills} from 'toktokbills/assets';
import {verticalScale} from 'toktokbills/helper';

//SELF IMPORTS
import {HeaderBack, HeaderTitle, LoadingIndicator, Separator, SomethingWentWrong} from 'toktokbills/components';
import {SplashHome} from 'src/ToktokLoad/components';

//IMAGE, FONT & COLOR
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const ToktokBillsMaintenance = ({navigation, route}) => {
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <ImageBackground
      source={maintenance_bg}
      style={[styles.container, {paddingTop: Platform.OS === 'android' ? getStatusbarHeight : 0}]}>
      <HeaderBack styleContainer={{marginVertical: moderateScale(16)}} />
      <View style={styles.contentContainer}>
        <Image style={styles.logo} source={onboarding_toktokbills} resizeMode="contain" />
        <View style={[styles.subContainer, {marginBottom: getStatusbarHeight}]}>
          <Image style={styles.maintenanceBills} source={maintenance_bills} resizeMode="cover" />
          <Text style={styles.title}>Katok ka ulit mamaya!</Text>
          <Text style={styles.message}>
            We are performing some maintenance to serve you better. We will be right back. Thank you.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
  },
  logo: {
    height: moderateScale(35),
    width: width,
  },
  contentContainer: {
    paddingHorizontal: moderateScale(16),
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.SEMI_BOLD,
    marginTop: moderateScale(10),
  },
  message: {
    marginHorizontal: moderateScale(20),
    textAlign: 'center',
    marginTop: 8,
  },
  maintenanceBills: {
    height: null,
    aspectRatio: 1.05,
    width: width * 0.8,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
