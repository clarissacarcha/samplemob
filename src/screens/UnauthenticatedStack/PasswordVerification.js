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
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import OneSignal from 'react-native-onesignal';
import {getUniqueId} from 'react-native-device-info';

import {COLOR, DARK, APP_FLAVOR, FONT_SIZE, ORANGE, COLORS, FONTS, SIZES, ACCOUNT_TYPE} from '../../res/constants';
import constants from '../../common/res/constants';
import {FONT} from '../../res/variables';
import {AUTH_CLIENT, VERIFY_LOGIN, FORGOT_PASSWORD} from '../../graphql';
import {AlertOverlay} from '../../components';
import {onError, onErrorAlert} from '../../util/ErrorUtility';
import {useAlert} from '../../hooks/useAlert';
import Splash from '../../assets/images/LinearGradiant.png';
import ToktokLogo from '../../assets/images/ToktokLogo.png';
import Icon from 'react-native-vector-icons/Entypo';
import ShowPassword from '../../assets/icons/ShowPassword.png';
import HidePassword from '../../assets/icons/HidePassword.png';
import ArrowLeft from '../../assets/icons/arrow-left-icon.png';

const VerificationBanner = require('../../assets/images/VerificationBanner.png');

const imageWidth = Dimensions.get('window').width - 80;

const PasswordVerification = ({navigation, route, createSession, setAppServices}) => {
  const {mobile} = route.params;
  const inputRef = useRef();

  const alert = useAlert();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inCorrectPassword, setIncorrectPassword] = useState(false);

  const [verifyLogin, {loading}] = useMutation(VERIFY_LOGIN, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        mobile: `+63${mobile}`,
        password,
        appFlavor: APP_FLAVOR,
        deviceId: getUniqueId(),
        deviceType: Platform.select({ios: 'I', android: 'A'}),
      },
    },
    onError: error => {
      console.log(error.message);
      // onErrorAlert({alert, error});
      if (error.message === 'GraphQL error: Incorrect password.') {
        setIncorrectPassword(true);
      }
    },

    onCompleted: data => {
      const {user, accessToken, serviceAccess} = data.verifyLogin;

      AsyncStorage.setItem('userId', user.id); // Set userId value in asyncStorage for persistent login
      AsyncStorage.setItem('accessToken', accessToken);

      createSession(data.verifyLogin); // Create session in redux
      setAppServices(serviceAccess);
      console.log(`SENDING TAG:${user.id}`);
      OneSignal.sendTags({
        userId: user.id,
      }); // Set onesignal userId tag for the phone

      if (user.person.firstName == null || user.person.lastName == null) {
        navigation.replace('RootDrawer', {
          screen: 'AuthenticatedStack',
          params: {
            screen: 'PostRegistration',
          },
        });
      } else {
        navigation.replace('RootDrawer', {
          screen: 'AuthenticatedStack',
          params: {
            screen: 'ConsumerLanding',
          },
        });
      }
    },
  });

  const onSubmit = () => {
    if (!password) {
      Alert.alert('', 'Please enter your password to continue.');
      return;
    }

    verifyLogin();
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

      navigation.navigate('ForgotPasswordVerification', {mobile});
    },
  });
  const sendOTP = () => {
    forgotPassword();
  };
  return (
    <ImageBackground
      resizeMode="cover"
      source={Splash}
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      {/* <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}> */}
      <AlertOverlay visible={loading} />
      <TouchableOpacity onPress={() => navigation.pop()}>
        <Image
          style={{height: 15, width: 10, margin: 16, top: StatusBar.currentHeight - 10}}
          source={ArrowLeft}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      <View style={{flex: 1, alignItems: 'center', marginTop: '30%'}}>
        {/*-------------------- BANNER --------------------*/}
        {/* <Image source={VerificationBanner} style={{height: 200, width: '100%'}} resizeMode="cover" /> */}
        <Image source={ToktokLogo} style={{height: imageWidth - 120, width: imageWidth - 170}} resizeMode="contain" />
        {/*-------------------- PASSWORD INPUT --------------------*/}
        {/* <Text style={styles.label}>Enter your password to continue</Text> */}
        <View style={styles.containerInput}>
          <TextInput
            ref={inputRef}
            value={password}
            onChangeText={value => setPassword(value)}
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={constants.COLOR.DARK}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            autoCapitalize="none"
            onSubmitEditing={onSubmit}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image source={!showPassword ? HidePassword : ShowPassword} style={styles.showPassword} />
          </TouchableOpacity>
        </View>
        <View style={{alignSelf: 'flex-start', marginHorizontal: 40}}>
          {inCorrectPassword && (
            <Text style={{fontSize: constants.FONT_SIZE.S, color: constants.COLOR.RED, top: -5}}>
              Password is incorrect
            </Text>
          )}
        </View>
        {/*-------------------- SUBMIT INPUT --------------------*/}
        <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
          <View style={styles.submit}>
            <Text
              style={{
                color: COLORS.WHITE,
                fontSize: FONT_SIZE.M,
                paddingHorizontal: '37%',
                fontFamily: constants.FONT_FAMILY.BOLD,
                lineHeight: SIZES.L,
                fontWeight: '600',
              }}>
              Login
            </Text>
          </View>
        </TouchableHighlight>

        {/* -------------------- FORGOT PASSWORD BUTTON--------------------*/}
        <TouchableHighlight onPress={() => sendOTP()} underlayColor={COLOR.YELLOW} style={styles.autoFillBox}>
          <View style={styles.autoFill}>
            <Text
              style={{
                color: ORANGE,
                fontSize: FONT_SIZE.M,
                textDecorationLine: 'underline',
                fontFamily: constants.FONT_FAMILY.BOLD,
                lineHeight: SIZES.L,
                fontWeight: '600',
              }}>
              Forgot Password?
            </Text>
          </View>
        </TouchableHighlight>
      </View>
      {/* </View> */}
    </ImageBackground>
  );
};

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
  setAppServices: payload => dispatch({type: 'SET_APP_SERVICES', payload}),
});

export default connect(null, mapDispatchToProps)(PasswordVerification);

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBox: {
    margin: 16,
    borderRadius: 5,
  },
  submit: {
    backgroundColor: ORANGE,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resend: {
    alignSelf: 'flex-end',
    paddingRight: 16,
  },
  label: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: FONT.BOLD,
  },
  input: {
    marginHorizontal: 1,
    borderWidth: 1,
    paddingLeft: 16,
    height: 50,
    color: constants.COLOR.BLACK,
    width: '100%',
    borderRightColor: '#F8F8F8',
    borderLeftColor: '#F8F8F8',
    borderTopColor: '#F8F8F8',
    borderBottomColor: '#F8F8F8',
  },
  containerInput: {
    marginHorizontal: '16%',
    backgroundColor: '#F8F8F8',
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  showPassword: {
    marginRight: 16,
    height: 17,
    width: 17,
  },
});
