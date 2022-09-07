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
import {GET_VERIFY_MPIN} from 'toktokwallet/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
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
export const Verify = ({pageIndex, setPageIndex, setOldMPIN}) => {
  const navigation = useNavigation();
  const [pinCode, setPinCode] = useState('');
  const inputRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const prompt = usePrompt();
  const numberOfBox = 4;

  const [getVerifyMPIN, {loading}] = useLazyQuery(GET_VERIFY_MPIN, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getVerifyMPIN}) => {
      setErrorMessage('');
      setPageIndex(state => state + 1);
      setOldMPIN(pinCode);
    },
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        setErrorMessage,
      });
    },
  });

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  useEffect(() => {
    if (pinCode.length > 0) {
      setErrorMessage('');
    }
    if (pinCode.length === numberOfBox) {
      getVerifyMPIN({
        variables: {
          input: {
            mpinCode: pinCode,
          },
        },
      });
    }
  }, [pinCode, getVerifyMPIN]);

  const forgotPIN = () => {
    navigation.navigate('ToktokWalletRecoveryMethods', {type: 'MPIN', event: 'FORGOT MPIN'});
  };

  return (
    <>
      <AlertOverlay visible={loading} />
      <EnterPinValidator
        label="Enter Current MPIN"
        hasBack={false}
        pinCode={pinCode}
        errorMessage={errorMessage}
        setPinCode={setPinCode}
        onPressForgotPin={forgotPIN}
        numberOfBox={numberOfBox}
        type="MPIN"
        onNumPress={onNumPress}
      />
    </>
  );
};
