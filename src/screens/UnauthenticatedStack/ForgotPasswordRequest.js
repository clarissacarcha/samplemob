import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, TouchableHighlight, Image, Alert, Platform} from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import {connect} from 'react-redux';
import {useMutation} from '@apollo/react-hooks';
import {COLOR, DARK, APP_FLAVOR, MEDIUM, LIGHT} from '../../res/constants';
import {AUTH_CLIENT, FORGOT_PASSWORD} from '../../graphql';
import {AlertOverlay, HeaderBack, HeaderTitle} from '../../components';
import {onError} from '../../util/ErrorUtility';

import timer from 'react-native-timer';

const VerificationBanner = require('../../assets/images/VerificationBanner.png');

const ForgotPassword = ({navigation, route, createSession}) => {
  const goToLogin = () => {
    navigation.navigate('UnauthenticatedStack', {
      screen: 'Login',
    });
  };

  navigation.setOptions({
    headerLeft: () => <HeaderBack onBack={goToLogin} />,
    headerTitle: () => <HeaderTitle label={['Forgot', 'Password']} />,
  });

  // const inputRef = useRef();

  const [mobile, setMobile] = useState('');

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

  const [forgotPassword, {loading}] = useMutation(FORGOT_PASSWORD, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        mobile: `+63${mobile}`,
        appFlavor: APP_FLAVOR,
        // deviceId: getUniqueId(),
        // deviceType: Platform.select({ios: 'I', android: 'A'}),
      },
    },
    onError: (error) => {
      console.log(error);
      const {graphQLErrors, networkError} = error;

      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, code}) => {
          if (code === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', 'Something went wrong.');
          } else if (code === 'BAD_USER_INPUT') {
            Alert.alert('', message);
          } else if (code === 'AUTHENTICATION_ERROR') {
            navigation.push('UnauthenticatedStack', {
              screen: 'AccountBlocked',
            });
          } else {
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
    onCompleted: ({forgotPassword: forgotResult}) => {
      if (forgotResult === 'NOPASSWORD') {
        Alert.alert('', 'No nominated password. Please proceed to login instead.', [
          {
            title: 'Ok',
            onPress: () => navigation.pop(),
          },
        ]);
      }

      navigation.navigate('ForgotPasswordVerification', {mobile});
    },
  });

  useEffect(() => {
    // inputRef.current.focus();
  }, []);

  const onSubmit = () => {
    if (!mobile) {
      Alert.alert('', 'Please enter your mobile number to continue.');
      return;
    }
    forgotPassword();
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
      <AlertOverlay visible={loading} />
      <View>
        {/*-------------------- BANNER --------------------*/}
        <Image source={VerificationBanner} style={{height: 200, width: '100%'}} resizeMode="cover" />

        {/*-------------------- PASSWORD INPUT --------------------*/}
        <Text style={styles.label}>Enter your mobile number to continue</Text>

        <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
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
            placeholderTextColor={LIGHT}
          />
        </View>
      </View>

      {/*-------------------- SUBMIT INPUT --------------------*/}
      <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Continue</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => ({
  createSession: (payload) => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(null, mapDispatchToProps)(ForgotPassword);

const styles = StyleSheet.create({
  inputView: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginRight: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 25,
    color: DARK,
    height: 50,
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
  resend: {
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: MEDIUM,
    fontFamily: 'Rubik-Medium',
  },
});
