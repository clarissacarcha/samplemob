import React, {useState, useRef, useEffect} from 'react';
import {EnterNewConfirmPinValidator} from 'toktokwallet/components';

export const Confirm = ({pinCode, setPageIndex, walletinfo, patchPincodeToktokWallet, tokwaAccount}) => {
  const [confirmpinCode, setConfirmPinCode] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef();
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

  useEffect(() => {
    setErrorMessage('');
  }, [confirmpinCode]);

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
      }}
      onNumPress={onNumPress}
      numberOfBox={numberOfBox}
    />
  );
};
