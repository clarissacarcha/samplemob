import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {VERIFY_PIN_CODE} from 'toktokwallet/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';
import {EnterPinValidator} from 'toktokwallet/components';
import {useAlert, usePrompt} from 'src/hooks';
import {AlertOverlay} from 'src/components';
import CONSTANTS from 'common/res/constants';
import {TransactionUtility} from 'toktokwallet/util';

const {FONT_FAMILY: FONT, FONT_SIZE, COLOR} = CONSTANTS;
const {width, height} = Dimensions.get('window');

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

export const VerifyPin = ({pageIndex, setPageIndex, setOldTPIN}) => {
  const prompt = usePrompt();
  const [showPin, setShowPin] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const navigation = useNavigation();

  const [errorMessage, setErrorMessage] = useState('');

  const [verifyPinCode, {data, error, loading}] = useLazyQuery(VERIFY_PIN_CODE, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({verifyPinCode}) => {
      setPageIndex(state => state + 1);
      setOldTPIN(pinCode);
    },
    onError: error => {
      // onErrorAlert({alert, error})
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        setErrorMessage,
      });
    },
  });

  useEffect(() => {
    if (pinCode.length > 0) {
      setErrorMessage('');
    }
    if (pinCode.length == 6) {
      verifyPinCode({
        variables: {
          input: {
            pinCode: pinCode,
          },
        },
      });
      // callBackFunc({pinCode , data})
    }
  }, [pinCode, verifyPinCode]);

  const onPressForgotTPIN = () => {
    navigation.navigate('ToktokWalletRecoveryMethods', {type: 'TPIN', event: 'forgot'});
  };

  return (
    <>
      <AlertOverlay visible={loading} />
      <EnterPinValidator
        label="Enter Current TPIN"
        hasBack={false}
        pinCode={pinCode}
        showPin={showPin}
        errorMessage={errorMessage}
        setPinCode={setPinCode}
        onPressForgotPin={onPressForgotTPIN}
        numberOfBox={6}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    justifyContent: 'center',
    padding: 16,
    flex: 1,
  },
  inputView: {
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 25,
    width: 30,
  },
});
