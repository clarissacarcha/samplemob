import React, {useRef, useState, useEffect} from 'react';
import {EnterNewConfirmPinValidator} from 'toktokwallet/components';

export const NewPin = ({pinCode, setPinCode, pageIndex, setPageIndex}) => {
  const inputRef = useRef();
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onSubmit = () => {
    if (pinCode.length >= 6 && pinCode !== '') {
      let isWeakPin = true;
      for (let x = 0; x < pinCode.length; x++) {
        if (pinCode[0] != pinCode[x]) {
          isWeakPin = false;
          break;
        }
      }
      if (isWeakPin) {
        setShowPin(true);
        return setErrorMessage('Your TPIN must not contain repeating digits ex. 000000');
      }
      setPageIndex(oldstate => oldstate + 1);
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [pinCode]);

  return (
    <EnterNewConfirmPinValidator
      errorMessage={errorMessage}
      pinCode={pinCode}
      label="Enter New TPIN"
      type="TPIN"
      showPin={showPin}
      setShowPin={setShowPin}
      onConfirm={onSubmit}
      onNumPress={onNumPress}
      onChangeText={val => {
        setPinCode(val);
        setErrorMessage('');
      }}
    />
  );
};
