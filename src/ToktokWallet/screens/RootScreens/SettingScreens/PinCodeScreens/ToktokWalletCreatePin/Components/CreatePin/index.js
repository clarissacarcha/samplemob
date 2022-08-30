import React, {useState, useRef, useEffect} from 'react';
import {EnterNewConfirmPinValidator} from 'toktokwallet/components';

export const CreatePin = ({pinCode, setPinCode, pageIndex, setPageIndex, tokwaAccount}) => {
  const [newPinCode, setNewPinCode] = useState('');
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const onSubmit = () => {
    if (newPinCode.length >= 6 && newPinCode !== '') {
      let isWeakPin = true;
      for (let x = 0; x < newPinCode.length; x++) {
        if (newPinCode[0] !== newPinCode[x]) {
          isWeakPin = false;
          break;
        }
      }
      if (isWeakPin) {
        setShowPin(true);
        return setErrorMessage('Your TPIN must not contain repeating digits ex. 000000');
      }
      setPageIndex(oldstate => oldstate + 1);
      setPinCode(newPinCode);
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [newPinCode]);

  return (
    <EnterNewConfirmPinValidator
      errorMessage={errorMessage}
      pinCode={newPinCode}
      label="Enter New TPIN"
      type="TPIN"
      showPin={showPin}
      setShowPin={setShowPin}
      onConfirm={onSubmit}
      onNumPress={onNumPress}
      onChangeText={val => {
        setNewPinCode(val);
        setErrorMessage('');
      }}
    />
  );
};
