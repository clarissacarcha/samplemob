import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import {connect} from 'react-redux';
import {useMutation} from '@apollo/react-hooks';
import {AUTH_CLIENT, LOGIN_REGISTER} from '../../graphql';
import {COLOR, DARK, MEDIUM, APP_FLAVOR} from '../../res/constants';
import {AlertOverlay} from '../../components';
import {onError} from '../../util/ErrorUtility';

import Splash from '../../assets/images/Splash.png';
import LoginBanner from '../../assets/images/LoginBanner.png';

const Login = ({navigation, session}) => {
  const [mobile, setMobile] = useState('');
  const [delay, setDelay] = useState(true);
  const [loginRegister, {loading}] = useMutation(LOGIN_REGISTER, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        mobile: `+63${mobile}`,
        appFlavor: APP_FLAVOR,
      },
    },
    onError: onError,
    onCompleted: ({loginRegister}) => {
      if (loginRegister == 'REGISTER') {
        navigation.push('SmsVerification', {mobile});
      }

      if (loginRegister == 'LOGIN') {
        navigation.push('PasswordVerification', {mobile});
      }

      setMobile(''); //empty out the mobile number
    },
  });

  const onMobileChange = value => {
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
        SmsRetriever.addSmsListener(event => {
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

  const onSubmit = phoneNumber => {
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
      <View>
        <Image
          source={LoginBanner}
          style={{height: 84, width: 200, marginLeft: 20, marginTop: 108, marginBottom: 58}}
          resizeMode="cover"
        />
        <View style={{height: 50, paddingHorizontal: 20, justifyContent: 'flex-end', marginBottom: 10}}>
          <Text style={{fontWeight: 'bold', color: MEDIUM}}>{`Enter your ${
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
          />
        </View>

        {/* -------------------- FORGOT PASSWORD BUTTON--------------------*/}
        <TouchableHighlight
          onPress={() => navigation.push('ForgotPasswordRequest')}
          underlayColor={COLOR}
          style={styles.autoFillBox}>
          <View style={styles.autoFill}>
            <Text style={{color: COLOR, fontSize: 12}}>Forgot Password?</Text>
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
      <TouchableHighlight onPress={() => onSubmit(mobile)} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Continue</Text>
        </View>
      </TouchableHighlight>
    </ImageBackground>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(
  mapStateToProps,
  null,
)(Login);

const styles = StyleSheet.create({
  inputView: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginRight: 20,
    height: 56,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 25,
    height: 56,
    color: DARK,
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
  },
  autoFillBox: {
    margin: 20,
    borderRadius: 10,
    // width: 100,
    alignSelf: 'flex-end',
  },

  autoFill: {
    backgroundColor: DARK,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 50,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
  },
});
