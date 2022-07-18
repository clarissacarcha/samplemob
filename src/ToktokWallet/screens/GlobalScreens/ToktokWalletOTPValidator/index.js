import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import {ICON_SET, VectorIcon, YellowButton} from 'src/revamp';
import {AlertOverlay} from 'src/components';
import {CheckIdleState, DisabledButton, NumberBoxes, HeaderBack} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {BuildingBottom} from '../../../components';
import {useAccount} from 'toktokwallet/hooks';
import {useFocusEffect} from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import {backgrounds} from 'toktokwallet/assets';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import tokwaLogo from 'toktokwallet/assets/images/tokwa_splash.png';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const ToktokWalletOTPValidator = ({navigation, route}) => {
  navigation.setOptions({
    headerShown: false,
  });

  const callBackFunc = route?.params?.callBackFunc ? route.params.callBackFunc : null;
  const errorMessage = route?.params?.errorMessage ? route.params.errorMessage : null;
  const resendRequest = route?.params?.resendRequest ? route.params.resendRequest : null;
  const data = route?.params?.data ? route.params.data : null;
  const btnLabel = route?.params?.btnLabel ? route.params.btnLabel : 'Confirm';

  const [otpCode, setOtpCode] = useState('');
  const inputRef = useRef();
  const {tokwaAccount} = useAccount();
  const [otpTimer, setOtpTimer] = useState(120);
  const [startCount, setStartCount] = useState(false);

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  // useFocusEffect(useCallback(()=>{
  //     BackgroundTimer.setTimeout(()=>{
  //         setOtpTimer(state=>state-1)
  //     },1000)
  // },[otpTimer]))

  useEffect(() => {
    if (startCount && otpTimer >= 0) {
      if (otpTimer >= 0) {
        BackgroundTimer.setTimeout(() => {
          setOtpTimer(state => state - 1);
        }, 1000);
        return;
      }
      setStartCount(false);
    }
  }, [otpTimer, startCount]);

  useEffect(() => {
    setOtpTimer(120);
    setStartCount(true);
  }, [callBackFunc]);

  return (
    <CheckIdleState>
      <ImageBackground source={backgrounds.gradient_tpin} style={styles.container}>
        <View style={{marginTop: Platform.OS === 'ios' ? moderateScale(16) : getStatusbarHeight + moderateScale(16)}}>
          <HeaderBack color={COLOR.ORANGE} />
        </View>
        <View style={styles.content}>
          <View style={styles.tpinBody}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image style={styles.logo} source={tokwaLogo} />
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.XL + 1, marginTop: 30}}>Enter OTP</Text>
            </View>
            <Text
              style={{
                fontFamily: FONT.REGULAR,
                fontSize: FONT_SIZE.M,
                marginBottom: 20,
                marginTop: 10,
                textAlign: 'center',
                marginHorizontal: moderateScale(30),
              }}>
              {'We have sent an OTP code to yourmobile number ending with '}
              {tokwaAccount.mobileNumber.substr(tokwaAccount.mobileNumber.length - 3)}.
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <NumberBoxes pinCode={otpCode} onNumPress={onNumPress} showPin={true} error={errorMessage} />
              <TextInput
                caretHidden
                value={otpCode}
                ref={inputRef}
                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (otpCode.length == 6) callBackFunc({Otp: otpCode, data: data});
                }}
                onChangeText={value => {
                  if (value.length <= 6) {
                    const replaceValue = value.replace(/[^0-9]/g, '');
                    setOtpCode(replaceValue);
                  }
                }}
              />
            </View>
            {errorMessage != '' && (
              <Text
                style={{
                  fontFamily: FONT.REGULAR,
                  color: 'red',
                  alignSelf: 'center',
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                {errorMessage}
              </Text>
            )}
            <TouchableOpacity style={{marginTop: height * 0.07, paddingBottom: 10, alignItems: 'center'}}>
              <Text>
                <Text
                  style={{
                    opacity: otpTimer > 0 ? 0.7 : 1,
                    color: '#525252',
                    fontSize: FONT_SIZE.M,
                    fontFamily: FONT.REGULAR,
                  }}>
                  {'Didn’t receive OTP code? '}
                </Text>
                <Text onPress={otpTimer > 0 ? () => {} : resendRequest}>
                  <Text
                    style={{
                      color: otpTimer > 0 ? '#9E9E9E' : COLOR.ORANGE,
                      fontSize: FONT_SIZE.M,
                      fontFamily: FONT.BOLD,
                      textDecorationLine: 'underline',
                    }}>
                    {'Resend'}
                  </Text>
                  {otpTimer > 0 && (
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M, color: '#9E9E9E'}}>
                      {` (${otpTimer} secs)`}
                    </Text>
                  )}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.proceedBtn}>
            {otpCode.length < 6 ? (
              <DisabledButton label={btnLabel} />
            ) : (
              <YellowButton
                label={btnLabel}
                onPress={() => {
                  callBackFunc({Otp: otpCode, data: data});
                }}
              />
            )}
          </View> */}
        </View>
        {/* <BuildingBottom /> */}
      </ImageBackground>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  tpinBody: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  backBtn: {
    backgroundColor: '#F7F7FA',
    top: Platform.OS == 'ios' ? 40 : 10,
    left: 16,
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 35,
    width: 35,
  },
  proceedBtn: {
    height: 70,
    width: '100%',
    justifyContent: 'flex-end',
  },
  logo: {
    resizeMode: 'contain',
    width: moderateScale(72),
    height: moderateScale(88),
  },
});
