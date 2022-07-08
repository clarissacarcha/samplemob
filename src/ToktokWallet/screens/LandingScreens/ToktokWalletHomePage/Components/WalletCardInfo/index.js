import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, Alert, Image, Platform} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {useNavigation} from '@react-navigation/native';
import {Separator, HeaderImageBackground, HeaderTitleRevamp, HeaderBack, HeaderKebab} from 'toktokwallet/components';
import {numberFormat, moderateScale, currencyCode, getDeviceWidth as width} from 'toktokwallet/helper';
import {basic, enterprise, verified} from 'toktokwallet/assets';
import {useAccount} from 'toktokwallet/hooks';
import {APP_FLAVOR, ACCOUNT_TYPE} from 'src/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';

//SELF IMPORTS
import WalletMethods from './WalletMethods';
import {ICON_SET, VectorIcon} from 'src/revamp';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const titleAccountTypeColor = ['', '#929191', '#00C851', '#2699FB'];

const WalletCardInfo = ({loading}) => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack color={COLOR.ORANGE} />,
    headerTitle: () => <HeaderTitleRevamp isLogo={true} />,
    headerRight: () => <HeaderKebab showSettings />,
  });

  const rotateY = new Animated.Value(0);
  const {checkIfTpinIsSet, tokwaAccount} = useAccount();

  const animation = Animated.timing(rotateY, {
    toValue: 200,
    duration: 500,
    useNativeDriver: false,
  });

  const rotateanimation = rotateY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: ['0deg', '60deg', '90deg'],
  });

  const cashIn = () => {
    if (APP_FLAVOR == 'D' && ACCOUNT_TYPE == 2) {
      return Alert.alert('', 'Use the toktok customer app for toktokwallet full features.');
    }
    const tpinIsSet = checkIfTpinIsSet();
    if (!tpinIsSet) return;
    return navigation.navigate('ToktokWalletPaymentOptions');
  };

  const redirectLinking = () => {
    return navigation.navigate('ToktokWalletTransactionLimit');
  };

  const tokwaNotifications = () => navigation.navigate('ToktokWalletNotifications');

  const levelIcon = () => {
    let type = tokwaAccount.person.accountType.level;
    switch (type) {
      case '1':
        return basic.basic_logo;
      case '2':
        return verified.verified_logo;
      case '3':
        return enterprise.enterprise_logo;
    }
  };

  return (
    <View style={styles.container}>
      <HeaderImageBackground>
        <View style={styles.headerContainer}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={redirectLinking} style={styles.accountLevelContainer}>
                <View style={{marginRight: moderateScale(5)}}>
                  <Image style={styles.level} source={levelIcon()} />
                </View>
                <Text style={styles.accountRank}>{tokwaAccount.person.accountType.title}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.walletContent}>
              <View>
                {
                  <Text style={styles.balance}>
                    {currencyCode}
                    {numberFormat(+tokwaAccount.wallet.balance)}
                  </Text>
                }
                <Text style={styles.balanceText}>Available Balance</Text>
              </View>

              <TouchableOpacity onPress={cashIn} style={styles.topUp}>
                <View style={styles.topUpbtn}>
                  <VectorIcon iconSet={ICON_SET.Entypo} name="plus" color="#EDAF1F" size={15} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </HeaderImageBackground>
      <View style={styles.whitespace}>
        <WalletMethods />
        <View style={styles.informationContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ToktokWalletHelpCentreSecurityPrivacy')}
            style={styles.informationContent}>
            <Image style={styles.walletVerifyIcon} source={require('toktokwallet/assets/icons/walletVerify.png')} />
            <Text style={styles.fontBoldSmall}>
              Your wallet is <Text style={[styles.fontBoldSmall, {color: COLOR.ORANGE}]}>encrypted and secure.</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Separator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: moderateScale(230),
    width: width,
  },
  whitespace: {
    height: moderateScale(90),
    backgroundColor: 'white',
    position: 'relative',
  },
  walletbackgroundimage: {
    flex: 1,
    resizeMode: 'cover',
  },
  headings: {
    marginTop: moderateScale(42),
    height: moderateScale(24),
    width: width,
    flexDirection: 'row',
  },
  walletContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  topUp: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: moderateScale(40),
    marginLeft: 5,
    marginTop: Platform.OS == 'android' ? moderateScale(10) : moderateScale(5),
  },
  topUpbtn: {
    height: moderateScale(24),
    width: moderateScale(24),
    borderRadius: moderateScale(100),
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  walletSettings: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: Platform.OS == 'android' ? moderateScale(10) : moderateScale(5),
  },
  balanceText: {
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.REGULAR,
    color: COLOR.WHITE,
  },
  balance: {
    fontSize: moderateScale(26),
    fontFamily: FONT.BOLD,
    color: COLOR.WHITE,
  },
  accountRank: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: COLOR.WHITE,
  },
  level: {
    height: moderateScale(14),
    width: moderateScale(14),
  },
  informationContainer: {
    flex: 1,
    marginTop: -40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  informationContent: {
    flexDirection: 'row',
    padding: 2,
    marginTop: moderateScale(10),
    alignItems: 'center',
  },
  walletVerifyIcon: {
    height: moderateScale(21),
    width: moderateScale(21),
    marginRight: 5,
  },
  fontBoldSmall: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.S,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: moderateScale(35),
  },
  accountLevelContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
});

export default WalletCardInfo;
