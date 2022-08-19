import React, {useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle} from 'react';
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
import {CheckIdleState, DisabledButton, HeaderBack, NumberInputBox} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {useAccount} from 'toktokwallet/hooks';
import {useFocusEffect} from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import {backgrounds} from 'toktokwallet/assets';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import tokwaLogo from 'toktokwallet/assets/images/tokwa_splash.png';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const ToktokWalletOTPValidator = forwardRef(({navigation, route}, ref) => {
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
              <Text style={styles.title}>Enter OTP</Text>
            </View>
            <Text style={styles.description}>
              {'We have sent an OTP code to yourmobile number ending with '}
              {tokwaAccount.mobileNumber.substr(tokwaAccount.mobileNumber.length - 3)}.
            </Text>
            <NumberInputBox
              pinCode={otpCode}
              onNumPress={onNumPress}
              showPin={true}
              errorMessage={errorMessage}
              callBackFunc={() => callBackFunc({Otp: otpCode, data: data})}
              onChangeText={val => {
                setOtpCode(val);
                navigation.setParams({errorMessage: ''});
              }}
            />
            <TouchableOpacity style={styles.sendOtpContainer}>
              <Text>
                <Text style={styles.didntReceive}>{'Didn’t receive OTP code? '}</Text>
                <Text onPress={otpTimer > 0 ? () => {} : resendRequest} style={{textDecorationLine: 'underline'}}>
                  <Text
                    style={[
                      styles.resendText,
                      {
                        color: otpTimer > 0 ? '#9E9E9E' : COLOR.ORANGE,
                      },
                    ]}>
                    {'Resend'}
                  </Text>
                  {otpTimer > 0 && <Text style={styles.otpTimer}>{` (${otpTimer} secs)`}</Text>}
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
      </ImageBackground>
    </CheckIdleState>
  );
});

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
  description: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(20),
    marginTop: moderateScale(10),
    textAlign: 'center',
    marginHorizontal: moderateScale(30),
  },
  title: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.XL + 1,
    marginTop: moderateScale(30),
  },
  sendOtpContainer: {
    marginTop: height * 0.07,
    paddingBottom: moderateScale(10),
    alignItems: 'center',
  },
  didntReceive: {
    color: '#525252',
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  resendText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.SEMI_BOLD,
  },
  otpTimer: {
    fontFamily: FONT.SEMI_BOLD,
    fontSize: FONT_SIZE.M,
    color: '#9E9E9E',
  },
});
