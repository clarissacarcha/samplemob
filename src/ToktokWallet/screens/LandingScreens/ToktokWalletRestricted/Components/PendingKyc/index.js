import React from 'react';
import {View, Text, StyleSheet, ImageBackground, Dimensions, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CONSTANTS from 'common/res/constants';

//COMPONENTS
import {OrangeButton, HeaderBack, HeaderTitleRevamp, HeaderKebab} from 'toktokwallet/components';

//FONTS & IMAGES
import tokwaLogo from 'toktokwallet/assets/images/tokwa_splash.png';
import circleCheck from 'toktokwallet/assets/icons/circleCheck.png';
import LinearGradient from 'toktokwallet/assets/images/backgrounds/gradient-bg2.png';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

//UTIL
import {moderateScale} from 'toktokwallet/helper';

export const PendingKyc = () => {
  const navigation = useNavigation();
  navigation.setOptions({
    headerShown: true,
    headerLeft: () => <HeaderBack color={COLOR.ORANGE} />,
    headerTitle: () => <HeaderTitleRevamp isLogo={true} headerStyle={styles.headerStyle} />,
    headerRight: () => <HeaderKebab />,
    headerStyle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
  });
  return (
    <>
      <ImageBackground source={LinearGradient} resizeMode="cover" style={styles.container}>
        <View style={styles.content}>
          <Image style={styles.logo} source={tokwaLogo} />
          <Text style={styles.verifyWalletText}>We are evaluating your application</Text>
          <Text style={styles.clickVerifyText}>
            Your toktokwallet verification is ongoing. Please wait for your account to be approved.
          </Text>
          <Text style={styles.benefitsText}>Benefits</Text>
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitsListContainer}>
              <Image style={styles.checkIcon} source={circleCheck} />
              <Text style={styles.benefitsListText}>Safe and secure toktokwallet account</Text>
            </View>

            <View style={styles.benefitsListContainer}>
              <Image style={styles.checkIcon} source={circleCheck} />
              <Text style={styles.benefitsListText}>Enjoy a convenient payment experience</Text>
            </View>

            <View style={styles.benefitsListContainer}>
              <Image style={styles.checkIcon} source={circleCheck} />
              <Text style={styles.benefitsListText}>Enjoy perks and rewards</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.buttonContainer}>
        <OrangeButton
          label="OK"
          style={{height: moderateScale(40)}}
          onPress={() => {
            navigation.pop();
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(45),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitsContainer: {
    marginTop: 20,
    justifyContent: 'center',
  },
  benefitsListContainer: {
    flexDirection: 'row',
    marginVertical: 3,
    alignItems: 'center',
  },
  benefitsListText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  benefitsText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: COLOR.ORANGE,
    marginBottom: moderateScale(5),
    marginTop: moderateScale(48),
  },
  logo: {
    resizeMode: 'contain',
    width: moderateScale(72),
    height: moderateScale(88),
    marginVertical: moderateScale(30),
  },
  checkIcon: {
    resizeMode: 'contain',
    width: moderateScale(13),
    height: moderateScale(13),
    paddingHorizontal: moderateScale(14),
  },
  verifyWalletText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    textAlign: 'center',
  },
  clickVerifyText: {
    marginTop: 5,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    textAlign: 'center',
  },
  listItem: {
    fontFamily: FONT.REGULAR,
    marginBottom: 5,
    fontSize: FONT_SIZE.S,
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    backgroundColor: COLOR.WHITE,
  },
});
