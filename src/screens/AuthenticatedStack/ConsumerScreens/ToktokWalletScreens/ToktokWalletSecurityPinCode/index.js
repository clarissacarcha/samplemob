import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../graphql';
import {VERIFY_PIN_CODE} from '../../../../../graphql/toktokwallet';
import {useLazyQuery} from '@apollo/react-hooks';
import {useAlert} from '../../../../../hooks/useAlert';
import {onError, onErrorAlert} from '../../../../../util/ErrorUtility';
import {YellowButton} from '../../../../../revamp';
import {DisabledButton} from '../Components';
import {AlertOverlay} from '../../../../../components/AlertOverlay';

const {height, width} = Dimensions.get('window');

const numWordArray = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
};

const NumberBox = ({onPress, value}) => (
  <TouchableHighlight onPress={onPress} underlayColor={COLOR.YELLOW} style={{borderRadius: 10, marginHorizontal: 5}}>
    <View style={styles.inputView}>
      <Text style={{fontSize: 25, fontFamily: FONT.BOLD}}>{value ? '•' : ''}</Text>
    </View>
  </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress}) => {
  const numberBoxes = [];
  var i;
  for (i = 0; i <= 5; i++) {
    numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} />);
  }
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
      {numberBoxes}
    </View>
  );
};

const ToktokWalletSecurityPinCode = ({navigation, route}) => {
  const [pinCode, setPinCode] = useState('');
  const inputRef = useRef();
  const alert = useAlert();

  const [pinCodeAttempts, setPinCodeAttempts] = useState({
    visible: false,
    attempts: '',
  });

  const [verifyPinCode, {data, error, loading}] = useLazyQuery(VERIFY_PIN_CODE, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({verifyPinCode}) => {
      if (verifyPinCode.result == 1) {
        setPinCodeAttempts({
          visible: false,
          attempts: '',
        });
        route.params.onConfirm();
      } else {
        if (verifyPinCode.remainingAttempts == 0) {
          navigation.navigate('ToktokWalletHomePage');
          navigation.replace('ToktokWalletHomePage');
          return navigation.push('ToktokWalletRestricted', {component: 'onHold'});
        }

        setPinCodeAttempts({
          visible: true,
          attempts: verifyPinCode.remainingAttempts,
        });
      }
    },
    onError: (error) => {
      onErrorAlert({alert, error});
    },
  });

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onSubmit = () => {
    verifyPinCode({
      variables: {
        input: {
          pinCode: pinCode,
        },
      },
    });
  };

  // useEffect(()=>{

  // },[pinCode])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS == 'ios' ? 40 : 10}
      style={styles.container}>
      <AlertOverlay visible={loading} />
      <View style={styles.content}>
        <View style={styles.pincodeContent}>
          <View style={{marginTop: 165, height: 200, width: width, alignItems: 'center', paddingHorizontal: 16}}>
            <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>Enter your pin</Text>
            <View style={{marginTop: 30, flexDirection: 'row'}}>
              <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} />
              <TextInput
                caretHidden
                value={pinCode}
                ref={inputRef}
                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                keyboardType="numeric"
                returnKeyType="done"
                onChangeText={(value) => {
                  setPinCodeAttempts((oldstate) => ({
                    ...oldstate,
                    visible: false,
                  }));
                  if (value.length <= 6) {
                    setPinCode(value);
                  }
                }}
              />
            </View>
            {pinCodeAttempts.visible && (
              <Text
                style={{
                  fontFamily: FONT.REGULAR,
                  color: 'red',
                  alignSelf: 'center',
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                Incorrect PIN. You can try {numWordArray[pinCodeAttempts.attempts]} ({pinCodeAttempts.attempts}) more{' '}
                {pinCodeAttempts.attempts == 1 ? 'time' : 'times'} before your account will be temporarily blocked.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.proceedBtn}>
          {pinCode.length < 6 ? (
            <DisabledButton label="Proceed" />
          ) : (
            <YellowButton delay={5000} label="Proceed" onPress={onSubmit} />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  pincodeContent: {
    flex: 1,
  },
  inputView: {
    backgroundColor: '#F7F7FA',
    borderRadius: 5,
    height: 48,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    paddingHorizontal: 20,
    fontSize: 25,
    width: 30,
  },
  proceedBtn: {
    height: 70,
    width: '100%',
    padding: 16,
    justifyContent: 'flex-end',
  },
});

export default ToktokWalletSecurityPinCode;
