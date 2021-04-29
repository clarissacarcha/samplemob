import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, TouchableHighlight, Image, Alert, Platform} from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {useMutation} from '@apollo/react-hooks';
import OneSignal from 'react-native-onesignal';
import {getUniqueId} from 'react-native-device-info';
import {COLOR, DARK, APP_FLAVOR, MEDIUM, LIGHT, IMPERSONATE, IMPERSONATION_PASSPHRASE} from '../../res/constants';
import {AUTH_CLIENT, VERIFY_LOGIN} from '../../graphql';
import {AlertOverlay} from '../../components';
import {onError, onErrorAlert} from '../../util/ErrorUtility';
import {useAlert} from '../../hooks/useAlert';

const VerificationBanner = require('../../assets/images/VerificationBanner.png');

const PasswordVerification = ({navigation, route, createSession}) => {
  const {mobile} = route.params;
  const inputRef = useRef();

  const alert = useAlert();

  const [password, setPassword] = useState('');

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
    onError: (error) => {
      onErrorAlert({alert, error});
    },

    onCompleted: (data) => {
      const {user, accessToken} = data.verifyLogin;

      AsyncStorage.setItem('userId', user.id); // Set userId value in asyncStorage for persistent login
      AsyncStorage.setItem('accessToken', accessToken);

      createSession(data.verifyLogin); // Create session in redux
      console.log(`SENDING TAG:${user.id}`);
      OneSignal.sendTags({
        userId: user.id,
      }); // Set onesignal userId tag for the phone

      if (APP_FLAVOR == 'C') {
        if (user.person.firstName == null || user.person.lastName == null) {
          navigation.replace('RootDrawer', {
            screen: 'AuthenticatedStack',
            params: {
              screen: 'PostRegistration',
            },
          });
          return;
        }

        navigation.replace('RootDrawer', {
          screen: 'AuthenticatedStack',
          params: {
            // screen: 'CheckConsumerLocation',
            screen: 'ConsumerLanding',
          },
        });
        return;
      }

      if (APP_FLAVOR == 'D') {
        navigation.replace('RootDrawer', {
          screen: 'AuthenticatedStack',
          params: {
            screen: 'DriverHomeBottomTab',
          },
        });
        return;
      }
    },
  });

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

  const onSubmit = () => {
    if (!password) {
      Alert.alert('', 'Please enter your password to continue.');
      return;
    }

    verifyLogin();
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
      <AlertOverlay visible={loading} />
      <View>
        {/*-------------------- BANNER --------------------*/}
        <Image source={VerificationBanner} style={{height: 200, width: '100%'}} resizeMode="cover" />

        {/*-------------------- PASSWORD INPUT --------------------*/}
        <Text style={styles.label}>Enter your password to continue</Text>
        <TextInput
          ref={inputRef}
          value={password}
          onChangeText={(value) => setPassword(value)}
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          returnKeyType="done"
          autoCapitalize="none"
          onSubmitEditing={onSubmit}
        />
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

export default connect(null, mapDispatchToProps)(PasswordVerification);

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 20,
    height: 50,
    color: DARK,
  },
});
