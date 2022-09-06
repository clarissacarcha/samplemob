import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import {DisabledButton, NumberBoxes, BuildingBottom, OrangeButton} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {backgrounds} from 'toktokwallet/assets';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import tokwaLogo from 'toktokwallet/assets/images/tokwa_splash.png';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');
import {EnterNewConfirmPinValidator} from 'toktokwallet/components';

export const ConfirmPin = ({pinCode, pageIndex, setPageIndex, patchPincodeToktokWallet}) => {
  const inputRef = useRef();
  const [showPin, setShowPin] = useState(false);
  const [confirmpinCode, setConfirmPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onSubmit = () => {
    if (confirmpinCode.length === 6) {
      if (pinCode !== confirmpinCode) {
        return setErrorMessage('TPIN does not match. Please try again.');
      }
      return patchPincodeToktokWallet();
    } else {
      return setErrorMessage('');
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [confirmpinCode]);

  return (
    <EnterNewConfirmPinValidator
      errorMessage={errorMessage}
      pinCode={confirmpinCode}
      label="Confirm New TPIN"
      type="TPIN"
      showPin={showPin}
      setShowPin={setShowPin}
      onConfirm={onSubmit}
      onNumPress={onNumPress}
      onChangeText={val => {
        setConfirmPinCode(val);
      }}
    />
  );
};
