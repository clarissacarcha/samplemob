import React, {useState, useRef, useEffect} from 'react';
import {EnterNewConfirmPinValidator} from 'toktokwallet/components';

export const CreateConfirmPin = ({pinCode, setPageIndex, walletinfo, patchPincodeToktokWallet, tokwaAccount}) => {
  const [confirmpinCode, setConfirmPinCode] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef();

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
      onChangeText={val => {
        setConfirmPinCode(val);
      }}
      onNumPress={onNumPress}
    />
  );
};
