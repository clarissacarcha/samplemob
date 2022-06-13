import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
  Alert,
  Platform,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import {COLOR, DARK, APP_FLAVOR, ACCOUNT_TYPE} from '../../res/constants';
import {connect} from 'react-redux';
import {useMutation} from '@apollo/react-hooks';
import {AUTH_CLIENT, FORGOT_PASSWORD_VERIFICATION, FORGOT_PASSWORD} from '../../graphql';
import {AlertOverlay, HeaderBack, HeaderTitle} from '../../components';
import {onError, onErrorAlert} from '../../util/ErrorUtility';
import {useAlert} from '../../hooks/useAlert';
import Splash from '../../assets/images/LinearGradiant.png';
import ToktokGoIcon from '../../assets/images/ToktokGoIcon.png';
import constants from '../../common/res/constants';
import ArrowLeft from '../../assets/icons/arrow-left-icon.png';
import {MaxAttempsModal, Keyboard} from './Components';
import timer from 'react-native-timer';
import {constant} from 'async';
import {set} from 'lodash';

const VerificationBanner = require('../../assets/images/VerificationBanner.png');
const screenheight = Dimensions.get('screen').height;

const NumberBox = ({onPress, value, borderError}) => (
  <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10}}>
    <View style={styles.inputView(borderError)}>
      <Text style={{fontSize: 25}}>{value}</Text>
    </View>
  </TouchableHighlight>
);

const NumberBoxes = ({verificationCode, onNumPress, borderError}) => {
  const numberBoxes = [];
  var i;
  for (i = 0; i <= 5; i++) {
    numberBoxes.push(<NumberBox onPress={onNumPress} value={verificationCode[i]} borderError={borderError} />);
  }
  return <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 20}}>{numberBoxes}</View>;
};

const Verification = ({navigation, route, createSession}) => {
  const goToLogin = () => {
    navigation.navigate('UnauthenticatedStack', {
      screen: 'Login',
    });
  };

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={goToLogin} />,
    headerTitle: () => <HeaderTitle label={['Forgot Password', 'Verification']} />,
  });

  const {mobile} = route.params;
  const inputRef = useRef();

  const alert = useAlert();
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [numberOfAttemps, setNumberOfAttemps] = useState(5);
  const [borderError, setBorderError] = useState(false);
  const [maxAttemps, setMaxAttemps] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [resend, setResend] = useState(false);

  const [count, setCount] = useState(30);

  const [forgotPasswordVerification, {loading}] = useMutation(FORGOT_PASSWORD_VERIFICATION, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        accountType: ACCOUNT_TYPE,
        mobile: `+63${mobile}`,
        verificationCode: verificationCode,
      },
    },
    onError: error => {
      setVerificationCodeError(error.message);
      setBorderError(true);
      // onErrorAlert({alert, error});
      if (error.message == 'GraphQL error: Invalid verification code.') {
        setNumberOfAttemps(numberOfAttemps - 1);
      } else if (error.message == 'GraphQL error: You have reached the maximum number of allowed attempts.') {
        setMaxAttemps(true);
      }
    },
    onCompleted: res => {
      if (res.forgotPasswordVerification == 'RESET') {
        navigation.push('ForgotPasswordReset', {verificationCode, mobile});
      }
      setNumberOfAttemps(5);
    },
  });

  useEffect(() => {
    let interval;

    if (resend) {
      interval = setInterval(() => {
        setCountdown(prevState => prevState - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [resend]);

  useEffect(() => {
    if (countdown === 0) {
      setResend(false);
    }
  }, [countdown]);
  const smsListen = async () => {
    // try {
    //   const registered = await SmsRetriever.startSmsRetriever();
    //   if (registered) {
    //     SmsRetriever.addSmsListener(event => {
    //       if (event.timeout) {
    //         alert('timeout');
    //       } else {
    //         alert('EVENT: ' + JSON.stringify(event, null, 4));
    //         SmsRetriever.removeSmsListener();
    //       }
    //     });
    //   }
    // } catch (error) {
    //   console.log(JSON.stringify(error));
    // }
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
    // smsListen();

    // return SmsRetriever.removeSmsListener();
  }, []);

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onSubmit = () => {
    forgotPasswordVerification();
  };

  const [forgotPassword] = useMutation(FORGOT_PASSWORD, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        mobile: `+63${mobile}`,
        appFlavor: APP_FLAVOR,
        accountType: ACCOUNT_TYPE,
        // deviceId: getUniqueId(),
        // deviceType: Platform.select({ios: 'I', android: 'A'}),
      },
    },
    onError: error => {
      console.log(error);
      const {graphQLErrors, networkError} = error;

      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, code}) => {
          if (code === 'INTERNAL_SERVER_ERROR') {
            Notify({message: 'Something went wrong.'});
          } else if (code === 'BAD_USER_INPUT') {
            Notify({message});
          } else if (code === 'AUTHENTICATION_ERROR') {
            navigation.push('UnauthenticatedStack', {
              screen: 'AccountBlocked',
            });
          } else {
            Notify({message: 'Something went wrong.'});
          }
        });
      }
    },
    onCompleted: data => {
      if (data.forgotPassword.payload.code === 'PASSWORD_EMPTY') {
        Alert.alert('', data.forgotPassword.message, [
          {
            title: 'Ok',
            onPress: () => navigation.pop(),
          },
        ]);
        return;
      }
      setNumberOfAttemps(5);
      setVerificationCodeError('');
      setBorderError(false);
    },
  });
  const resendOTP = () => {
    forgotPassword();
    setCountdown(120);
    setResend(true);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <ImageBackground
        resizeMode="cover"
        source={Splash}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <AlertOverlay visible={loading} />

        <View>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Image
              style={{height: 15, width: 10, top: StatusBar.currentHeight - 10, margin: 16}}
              source={ArrowLeft}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/*---------------------------------------- BANNER ----------------------------------------*/}
          {/* <Image source={VerificationBanner} style={{height: 200, width: '100%'}} resizeMode="cover" /> */}

          {/*---------------------------------------- HIDDEN TEXT INPUT ----------------------------------------*/}

          {/*---------------------------------------- ENTERED MOBILE NUMBER ----------------------------------------*/}
          <View
            style={{
              alignItems: 'center',
              marginTop: screenheight > 700 && 60,
              marginHorizontal: 90,
              justifyContent: screenheight > 700 ? 'flex-start' : 'center',
            }}>
            {/* <Text>Enter the 6-digit code sent to</Text>
          <Text style={{fontFamily: 'Rubik-Medium'}}>{`+63 ${mobile}`}</Text> */}
            <Image source={ToktokGoIcon} style={{height: 85, width: 100}} resizeMode="contain" />
            <Text style={{fontSize: constants.FONT_SIZE.XL + 1, marginTop: 40}}>Enter OTP</Text>
            <Text style={{textAlign: 'center', marginTop: 8, marginBottom: 24}}>
              We have sent an OTP code to your mobile number ending with {mobile.slice(-3)}.
            </Text>
          </View>

          {/*---------------------------------------- NUMBER BOXES ----------------------------------------*/}
          <View style={{position: 'relative'}}>
            <NumberBoxes verificationCode={verificationCode} onNumPress={onNumPress} borderError={borderError} />
            <TextInput
              caretHidden
              value={verificationCode}
              ref={inputRef}
              style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
              keyboardType="number-pad"
              returnKeyType="done"
              onChangeText={value => {
                if (value.length <= 6) {
                  setVerificationCode(value);
                }
              }}
              onSubmitEditing={onSubmit}
            />
            {verificationCodeError == 'GraphQL error: Invalid verification code.' && (
              <View style={{alignItems: 'center', marginHorizontal: 60, top: -15}}>
                <Text style={{textAlign: 'center', fontSize: constants.FONT_SIZE.S, color: constants.COLOR.RED}}>
                  The OTP you’ve entered is incorrect. Please try again. ({numberOfAttemps}) attempts left.
                </Text>
              </View>
            )}
            {verificationCodeError == 'GraphQL error: Verification already expired.' && (
              <View style={{alignItems: 'center', marginHorizontal: 60, top: -15}}>
                <Text style={{textAlign: 'center', fontSize: constants.FONT_SIZE.S, color: constants.COLOR.RED}}>
                  Sorry, the OTP you’ve entered was already expired. Please request a new OTP code.
                </Text>
              </View>
            )}
            {verificationCodeError == 'GraphQL error: You have reached the maximum number of allowed attempts.' && (
              <View style={{alignItems: 'center', marginHorizontal: 60, top: -15}}>
                <Text style={{textAlign: 'center', fontSize: constants.FONT_SIZE.S, color: constants.COLOR.RED}}>
                  Sorry, the OTP you’ve entered was already expired. Please request a new OTP code.
                </Text>
              </View>
            )}
            {verificationCodeError == '' && <View style={{alignItems: 'center', marginHorizontal: 60, height: 30}} />}

            <MaxAttempsModal isVisible={maxAttemps} setVisible={setMaxAttemps} />
            <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 60, alignItems: 'center'}}>
              <Text style={{color: constants.COLOR.DARK, fontSize: constants.FONT_SIZE.M, marginRight: 3}}>
                Didn’t receive OTP code?
              </Text>
              <TouchableOpacity
                disabled={resend}
                onPress={() => {
                  resendOTP();
                }}>
                {resend ? (
                  <Text style={{color: constants.COLOR.DARK, fontFamily: constants.FONT_FAMILY.BOLD}}>
                    Resend ({countdown} secs)
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: constants.COLOR.ORANGE,
                      fontFamily: constants.FONT_FAMILY.BOLD,
                      textDecorationLine: 'underline',
                    }}>
                    {' '}
                    Resend
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/*---------------------------------------- RESEND CODE ----------------------------------------*/}
          {/* <Text style={styles.resend}>Didn't received it?</Text>
        <Text style={[styles.resend, {fontFamily: 'Rubik-Medium'}]}>{`Request new code in ${count}`}</Text> */}
        </View>

        {/*---------------------------------------- SUBMIT BUTTON ----------------------------------------*/}
        {/* <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Continue</Text>
        </View>
      </TouchableHighlight> */}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(null, mapDispatchToProps)(Verification);

const styles = StyleSheet.create({
  inputView: borderError => ({
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: borderError ? 'red' : '#F8F8F8',
    backgroundColor: '#F7F7FA',
    height: 48,
    width: 40,
    marginHorizontal: 4,
  }),
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    paddingHorizontal: 20,
    fontSize: 25,
    color: DARK,
    width: 30,
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resend: {
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
});
