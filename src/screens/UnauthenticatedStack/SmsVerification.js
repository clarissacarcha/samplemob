import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, TouchableHighlight, Image, Alert, Platform} from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import {COLOR, DARK, APP_FLAVOR} from '../../res/constants';
import {getUniqueId} from 'react-native-device-info';
import {connect} from 'react-redux';
import {useMutation} from '@apollo/react-hooks';
import {AUTH_CLIENT, VERIFY_REGISTRATION} from '../../graphql';
import {AlertOverlay} from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';
import {onError} from '../../util/ErrorUtility';

import timer from 'react-native-timer';

const VerificationBanner = require('../../assets/images/VerificationBanner.png');

const NumberBox = ({onPress, value}) => (
  <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10}}>
    <View style={styles.inputView}>
      <Text style={{fontSize: 25}}>{value ? value : '_'}</Text>
    </View>
  </TouchableHighlight>
);

const NumberBoxes = ({verificationCode, onNumPress}) => {
  const numberBoxes = [];
  var i;
  for (i = 0; i <= 5; i++) {
    numberBoxes.push(<NumberBox onPress={onNumPress} value={verificationCode[i]} />);
  }
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
      {numberBoxes}
    </View>
  );
};

const Verification = ({navigation, route, createSession}) => {
  const {mobile} = route.params;
  const inputRef = useRef();

  const [verificationCode, setVerificationCode] = useState('');
  const [count, setCount] = useState(30);

  const [verifyRegistration, {loading}] = useMutation(VERIFY_REGISTRATION, {
    client: AUTH_CLIENT,
    variables: {
      input: {
        mobile: `+63${mobile}`,
        verificationCode,
        appFlavor: APP_FLAVOR,
        deviceId: getUniqueId(),
        deviceType: Platform.select({ios: 'I', android: 'A'}),
      },
    },
    onError: onError,
    onCompleted: ({verifyRegistration}) => {
      const {user, accessToken} = verifyRegistration;

      AsyncStorage.setItem('userId', user.id);
      AsyncStorage.setItem('accessToken', accessToken);

      createSession(verifyRegistration);

      OneSignal.sendTags({
        userId: user.id,
      }); // Set onesignal userId tag for the phone

      if (APP_FLAVOR == 'C') {
        if (user.person.firstName == null || user.person.lastName == null) {
          navigation.navigate('RootDrawer', {
            screen: 'AuthenticatedStack',
            params: {
              screen: 'PostRegistration',
            },
          });
          return;
        }

        navigation.navigate('RootDrawer', {
          screen: 'AuthenticatedStack',
          params: {
            screen: 'ConsumerMap',
          },
        });
      }

      if (APP_FLAVOR == 'D') {
        navigation.navigate('RootDrawer', {
          screen: 'AuthenticatedStack',
          params: {
            screen: 'DriverMap',
          },
        });
      }
    },
  });

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
    verifyRegistration();
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
      <AlertOverlay visible={loading} />
      <View>
        {/*---------------------------------------- BANNER ----------------------------------------*/}
        <Image source={VerificationBanner} style={{height: 200, width: '100%'}} resizeMode="cover" />

        {/*---------------------------------------- HIDDEN TEXT INPUT ----------------------------------------*/}

        {/*---------------------------------------- ENTERED MOBILE NUMBER ----------------------------------------*/}
        <View style={{paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'flex-end'}}>
          <Text>Enter the 6-digit code sent to</Text>
          <Text style={{fontWeight: 'bold'}}>{`+63 ${mobile}`}</Text>
        </View>

        {/*---------------------------------------- NUMBER BOXES ----------------------------------------*/}
        <View style={{position: 'relative'}}>
          <NumberBoxes verificationCode={verificationCode} onNumPress={onNumPress} />
          <TextInput
            caretHidden
            value={verificationCode}
            ref={inputRef}
            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
            keyboardType="number-pad"
            returnKeyType="next"
            onChangeText={value => {
              if (value.length <= 6) {
                setVerificationCode(value);
              }
            }}
            onSubmitEditing={onSubmit}
          />
        </View>

        {/*---------------------------------------- RESEND CODE ----------------------------------------*/}
        {/* <Text style={styles.resend}>Didn't received it?</Text>
        <Text style={[styles.resend, {fontWeight: 'bold'}]}>{`Request new code in ${count}`}</Text> */}
      </View>

      {/*---------------------------------------- SUBMIT BUTTON ----------------------------------------*/}
      <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Continue</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  null,
  mapDispatchToProps,
)(Verification);

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
  },
  resend: {
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
});
