import React, {useRef, useState, useEffect} from 'react';
import {EnterNewConfirmPinValidator} from 'toktokwallet/components';

export const Confirm = ({pinCode, pageIndex, setPageIndex, patchPincodeToktokWallet}) => {
  const inputRef = useRef();
  const [showPin, setShowPin] = useState(false);
  const [confirmpinCode, setConfirmPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const numberOfBox = 4;

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onSubmit = () => {
    if (confirmpinCode.length === numberOfBox) {
      if (pinCode !== confirmpinCode) {
        return setErrorMessage('MPIN does not match! Please try again.');
      }
      return patchPincodeToktokWallet();
    } else {
      return setErrorMessage('');
    }
  };

  return (
    <EnterNewConfirmPinValidator
      errorMessage={errorMessage}
      pinCode={confirmpinCode}
      label="Confirm New MPIN"
      type="MPIN"
      showPin={showPin}
      setShowPin={setShowPin}
      onConfirm={onSubmit}
      onChangeText={val => {
        setConfirmPinCode(val);
        setErrorMessage('');
      }}
      onNumPress={onNumPress}
      numberOfBox={numberOfBox}
    />
  );
};
