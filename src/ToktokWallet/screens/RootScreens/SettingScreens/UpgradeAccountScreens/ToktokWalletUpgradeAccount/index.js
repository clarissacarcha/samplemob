import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, ImageBackground} from 'react-native';
import {CheckIdleState, OrangeButton, HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
import {moderateScale} from 'toktokwallet/helper';
import {useAccount} from 'toktokwallet/hooks';

//ASSETS
import tokwaLogo from 'toktokwallet/assets/images/tokwa_splash.png';
import {circle_check} from 'toktokwallet/assets';
import LinearGradient from 'toktokwallet/assets/images/backgrounds/gradient-bg2.png';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

const UpgradeRequirementFullyVerified = () => {
  return (
    <>
      <View style={styles.benefitsListContainer}>
        <Image style={styles.checkIcon} source={circle_check} />
        <Text style={styles.benefitsListText}>Link bank Account</Text>
      </View>
      <View style={styles.benefitsListContainer}>
        <Image style={styles.checkIcon} source={circle_check} />
        <Text style={styles.benefitsListText}>Video call verification</Text>
      </View>
    </>
  );
};

const UpgradeRequirementEnterprise = () => {
  return (
    <>
      <View style={styles.benefitsListContainer}>
        <Image style={styles.checkIcon} source={circle_check} />
        <Text style={styles.benefitsListText}>Business permit</Text>
      </View>
      <View style={styles.benefitsListContainer}>
        <Image style={styles.checkIcon} source={circle_check} />
        <Text style={styles.benefitsListText}>DTI certification of registration or SEC</Text>
      </View>
      <View style={styles.benefitsListContainer}>
        <Image style={styles.checkIcon} source={circle_check} />
        <Text style={styles.benefitsListText}>BIR 2302 form</Text>
      </View>
      <View style={styles.benefitsListContainer}>
        <Image style={styles.checkIcon} source={circle_check} />
        <Text style={styles.benefitsListText}>2 Valid Government Issued IDs</Text>
      </View>
    </>
  );
};

export const ToktokWalletUpgradeAccount = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Upgrade Account'} />,
  });

  const {tokwaAccount, getMyAccount} = useAccount();

  useEffect(() => {
    getMyAccount();
  }, [getMyAccount]);

  const upgradeAccount = () => {
    tokwaAccount.person.accountType.level === '1'
      ? navigation.navigate('ToktokWalletFullyVerifiedApplication')
      : navigation.navigate('ToktokWalletEnterpriseApplication');

    // console.log(tokwaAccount.isLinked)
  };

  return (
    <CheckIdleState>
      <ImageBackground source={LinearGradient} resizeMode="cover" style={styles.container}>
        <View style={styles.content}>
          <Image style={styles.logo} source={tokwaLogo} />
          <Text>
            <Text style={styles.verifyWalletText}>Upgrade your </Text>
            <Text>
              <Text style={styles.toktok}>toktok</Text>
              <Text style={styles.wallet}>wallet</Text>
            </Text>
          </Text>
          <Text style={styles.clickVerifyText}>
            Upgrade your Account from{' '}
            <Text style={{fontFamily: FONT.BOLD}}>
              {tokwaAccount.person.accountType.level === 1 ? 'BASIC to FULLY VERIFIED' : 'FULLY VERIFIED to ENTERPRISE'}{' '}
            </Text>
            to enjoy a higher transaction limit.
          </Text>
          <Text style={styles.benefitsText}>Requirements</Text>
          <View style={styles.benefitsContainer}>
            {tokwaAccount.person.accountType.level === '1' ? (
              <UpgradeRequirementFullyVerified />
            ) : (
              <UpgradeRequirementEnterprise />
            )}
          </View>
        </View>
      </ImageBackground>
      <View style={styles.buttonContainer}>
        <OrangeButton label="Upgrade Now" onPress={upgradeAccount} />
      </View>
    </CheckIdleState>
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
    fontFamily: FONT.SEMI_BOLD,
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
  },
  toktok: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    color: '#FDBA1C',
  },
  wallet: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    color: '#F6841F',
  },
  clickVerifyText: {
    marginTop: moderateScale(10),
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
  requirement: {
    flexDirection: 'row',
  },
  requirementText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    marginVertical: 2,
    color: COLOR.DARK,
  },
});
