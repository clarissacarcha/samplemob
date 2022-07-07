import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, Alert, Image, Platform} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {useNavigation} from '@react-navigation/native';
import {Separator, HeaderImageBackground, HeaderTitleRevamp, HeaderBack, HeaderRight} from 'toktokwallet/components';
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
 
  navigation.setOptions({
    headerShown: true,
  });

  return (
    <View style={styles.container}>
      {
        navigation.setOptions({
          headerLeft: () => <HeaderBack color={COLOR.ORANGE} />,
          headerTitle: () => <HeaderTitleRevamp isLogo={true} />,
          headerRight: () => <HeaderRight rightIconOnPress={() => navigation.navigate('ToktokWalletNotifications')} />,
        })
      }
      <HeaderImageBackground>
        <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 50}}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={redirectLinking} style={{paddingHorizontal: 16, flexDirection: 'row'}}>
                <View style={{marginRight: moderateScale(5)}}>
                <Image
                  style={styles.level}
                  source={
                    tokwaAccount.person.accountType.level == 1 ? 
                    basic.basic_logo :
                    tokwaAccount.person.accountType.level == 2 ?
                    verified.verified_logo :
                    enterprise.enterprise_logo 
                  }
                />
                </View>
                <Text style={styles.accountRank}>
                  {tokwaAccount.person.accountType.title}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.walletContent}>
              <View>
                {
                  <Text style={styles.balance}>
                    {currencyCode}{numberFormat(+tokwaAccount.wallet.balance)}
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
        <View style={{flex: 1, marginTop: -40, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ToktokWalletHelpCentreSecurityPrivacy')}
            style={{flexDirection: 'row', padding: 2, marginTop: 10}}>
            <Image
              style={{height: 21, width: 21, marginRight: 5}}
              source={require('toktokwallet/assets/icons/walletVerify.png')}
            />
            <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S}}>
              Your wallet is{' '}
              <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S, color: COLOR.ORANGE}}>
                encrypted and secure.
              </Text>
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
    // height: 215, // ios
    // height: 255,
    height: 240,
    width: width,
  },
  whitespace: {
    height: 90,
    backgroundColor: 'white',
    position: 'relative',
  },
  walletbackgroundimage: {
    flex: 1,
    resizeMode: 'cover',
  },
  headings: {
    marginTop: 42,
    height: 24,
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
    width: 40,
    marginLeft: 5,
    marginTop: Platform.OS == 'android' ? 10 : 5,
  },
  topUpbtn: {
    height: moderateScale(24),
    width: moderateScale(24),
    borderRadius: 100,
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    backgroundColor: "white",
    alignItems: 'center',
  },
  walletSettings: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: Platform.OS == 'android' ? 10 : 5,
  },
  balanceText: {
    fontSize: FONT_SIZE.S, 
    fontFamily: FONT.REGULAR, 
    color: COLOR.WHITE
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
  }
});

export default WalletCardInfo;
