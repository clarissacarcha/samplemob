import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAlert} from '../../hooks/useAlert';
import {APP_FLAVOR, DARK, MEDIUM} from '../../res/constants';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../res/variables';
import {AUTH_CLIENT, LOGIN_REGISTER} from '../../graphql';
import {AlertOverlay, AlertModal} from '../../components';
import LoginBanner from '../../assets/images/LoginBanner.png';
import SmsRetriever from 'react-native-sms-retriever';
import Splash from '../../assets/images/Splash.png';
import {connect} from 'react-redux';
import {onError, onErrorAlert} from '../../util/ErrorUtility';
import {useMutation} from '@apollo/react-hooks';

const Login = ({navigation, session}) => {
  const [mobile, setMobile] = useState('');
  const [delay, setDelay] = useState(true);

  const alert = useAlert();

  const [loginRegister, {loading}] = useMutation(LOGIN_REGISTER, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        mobile: `+63${mobile}`,
        appFlavor: APP_FLAVOR,
      },
    },
    onError: (error) => {
      onErrorAlert({alert, error});
    },
    onCompleted: (data) => {
      if (data.loginRegister === 'REGISTER') {
        navigation.push('SmsVerification', {mobile});
      }

      if (data.loginRegister === 'LOGIN') {
        navigation.push('PasswordVerification', {mobile});
      }

      setMobile(''); //empty out the mobile number
    },
  });

  // const ws = new WebSocket('wss://echo.websocket.org');
  //
  // ws.onopen = () => {
  //   ws.send('Sent Message!');
  // };
  //
  // ws.onmessage = e => {
  //   alert(e.data);
  // };

  const onMobileChange = (value) => {
    if (value.length == 1 && value == '0') {
      setMobile('');
      return;
    }

    if (value.length > 10) {
      setMobile(mobile);
      return;
    }

    setMobile(value);
  };

  useEffect(() => {
    setTimeout(() => {
      setDelay(false);
    }, 200);
  }, []);

  // Get the phone number (first gif)
  const onRequestAutoFill = async () => {
    try {
      const phoneNumber = await SmsRetriever.requestPhoneNumber();
      setMobile(phoneNumber.slice(3, phoneNumber.length));
      onSubmit(phoneNumber.slice(3, phoneNumber.length));
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  // Get the SMS message
  const onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        alert('Started Listener');
        SmsRetriever.addSmsListener((event) => {
          alert('EVENT: ' + JSON.stringify(event, null, 4));
          SmsRetriever.removeSmsListener();
        });
      } else {
        alert('Not Registered');
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const onSubmit = (phoneNumber) => {
    if (phoneNumber.length !== 10) {
      Alert.alert('', 'Please enter a valid mobile number.');
      return;
    }
    loginRegister();
  };

  if (delay) {
    return (
      <ImageBackground
        resizeMode="cover"
        source={Splash}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <Image
          source={LoginBanner}
          style={{height: 84, width: 200, marginLeft: 20, marginTop: 108, marginBottom: 58}}
          resizeMode="cover"
        />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={Splash}
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <AlertOverlay visible={loading} />
      {/* <AlertModal visible={true} /> */}
      <View>
        <Image
          source={LoginBanner}
          style={{height: 84, width: 200, marginLeft: 20, marginTop: 108, marginBottom: 58}}
          resizeMode="cover"
        />
        <View style={{height: 50, paddingHorizontal: 20, justifyContent: 'flex-end', marginBottom: 10}}>
          <Text style={{fontFamily: FONT.BOLD, color: COLOR.BLACK}}>{`Enter your ${
            APP_FLAVOR == 'C' ? 'mobile' : 'rider'
          } number to continue.`}</Text>
        </View>

        {/*-------------------- INPUT ROW --------------------*/}
        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
          <View style={styles.inputView}>
            <Text style={{fontSize: 25, color: DARK}}>+63</Text>
          </View>
          <TextInput
            value={mobile}
            onChangeText={onMobileChange}
            style={styles.input}
            placeholder="9876543210"
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={() => onSubmit(mobile)}
            placeholderTextColor={MEDIUM}
          />
        </View>

        {/* -------------------- FORGOT PASSWORD BUTTON--------------------*/}
        <TouchableHighlight
          onPress={() => navigation.push('ForgotPasswordRequest')}
          underlayColor={COLOR.YELLOW}
          style={styles.autoFillBox}>
          <View style={styles.autoFill}>
            <Text style={{color: COLOR.YELLOW, fontSize: 12}}>Forgot Password?</Text>
          </View>
        </TouchableHighlight>

        {/*-------------------- AUTO Fill BUTTON --------------------*/}
        {/* <TouchableHighlight onPress={onRequestAutoFill} underlayColor={COLOR} style={styles.autoFillBox}>
          <View style={styles.autoFill}>
            <Text style={{color: COLOR, fontSize: 20}}>Auto Fill</Text>
          </View>
        </TouchableHighlight> */}
      </View>

      {/*-------------------- SUBMIT BUTTON --------------------*/}
      <TouchableHighlight onPress={() => onSubmit(mobile)} underlayColor={COLOR.YELLOW} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR.YELLOW, fontSize: 20}}>Continue</Text>
        </View>
      </TouchableHighlight>
    </ImageBackground>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(Login);

const styles = StyleSheet.create({
  inputView: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: SIZE.BORDER_RADIUS,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginRight: 8,
    height: 56,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: SIZE.BORDER_RADIUS,
    paddingHorizontal: 16,
    fontSize: 25,
    height: 56,
    color: DARK,
  },
  submitBox: {
    margin: 16,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: SIZE.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoFillBox: {
    margin: 20,
    borderRadius: SIZE.BORDER_RADIUS,
    // width: 100,
    alignSelf: 'flex-end',
  },

  autoFill: {
    backgroundColor: DARK,
    height: 30,
    borderRadius: SIZE.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 50,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
  },
});
