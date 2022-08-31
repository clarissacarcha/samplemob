import React, {useState, useRef} from 'react';
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
import createAcc from '../../../assets/toktokgo/BackgroudCreateTokwaAcc.png';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import ToktokWalletIcon from '../../../assets/images/WalletLogo.png';
import ToktokWalletImage from '../../../assets/images/creaTokwaAcc.png';
import {useAccount} from 'toktokwallet/hooks';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

const ToktokGoCreateTokwa = ({navigation, session, route}) => {
  const {voucherData} = route.params;
  const {tokwaAccount, getMyAccount} = useAccount();

  const onSkip = () => {
    if (!session?.user?.consumer?.goReferralDriverCode) {
      navigation.replace('ReferralScreen', {
        fromRegistration: true,
        voucherData,
      });
    } else {
      navigation.replace('ToktokGoHealthCare', {voucherData});
    }
  };

  return (
    <ImageBackground
      source={createAcc}
      resizeMode="cover"
      style={{
        flex: 1,
      }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <View style={{alignItems: 'center'}}>
        <View style={{marginTop: StatusBar.currentHeight + 40}}>
          <Image source={ToktokWalletIcon} resizeMode={'contain'} style={{height: 45, width: 190}} />
        </View>
        <View style={{alignItems: 'center'}}>
          <Image
            source={ToktokWalletImage}
            resizeMode={'contain'}
            style={{height: 249, width: 275, marginTop: 35, marginBottom: 25}}
          />
          <Text
            style={{
              fontSize: constants.FONT_SIZE.XL + 7,
              textAlign: 'center',
              fontFamily: constants.FONT_FAMILY.SEMI_BOLD,
              marginHorizontal: 40,
            }}>
            Safe cashless transactions with toktokwallet
          </Text>
          <Text
            style={{
              marginVertical: 15,
              fontSize: constants.FONT_SIZE.M + 1,
              textAlign: 'center',
              marginHorizontal: 55,
            }}>
            Convenient ride with toktokgo! For easier and cashless transactions, use toktokwallet as your payment
            method.
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ToktokWalletLoginPage');
            }}>
            <Text
              style={{
                backgroundColor: constants.COLOR.ORANGE,
                paddingHorizontal: 60,
                paddingVertical: 11,
                color: constants.COLOR.WHITE,
                fontFamily: constants.FONT_FAMILY.SEMI_BOLD,
                marginBottom: 20,
                borderRadius: 5,
                overflow: 'hidden',
              }}>
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{marginBottom: 20, marginBottom: 50}} onPress={onSkip}>
            <Text style={{color: constants.COLOR.ORANGE}}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

// export default ToktokGoCreateTokwa;

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokGoCreateTokwa);

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
    top: StatusBar.currentHeight + 10,
    left: 16,
    padding: 6,
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },
});
