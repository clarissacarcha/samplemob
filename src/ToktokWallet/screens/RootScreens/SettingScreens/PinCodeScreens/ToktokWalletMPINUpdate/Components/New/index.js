import React, {useRef, useState} from 'react';
import {EnterNewConfirmPinValidator} from 'toktokwallet/components';

export const New = ({pinCode, setPinCode, pageIndex, setPageIndex}) => {
  const inputRef = useRef();
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const numberOfBox = 4;

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const checkfIfSequential = pinCode => {
    let isPinSequential = false;
    let a = +pinCode[1] - +pinCode[0];
    let b = +pinCode[2] - +pinCode[1];
    let c = +pinCode[3] - +pinCode[2];
    if (a === b && b === c && c === a) {
      isPinSequential = true;
    }
    return isPinSequential;
  };

  const onSubmit = () => {
    if (pinCode.length >= numberOfBox && pinCode !== '') {
      let isWeakPin = true;
      for (let x = 0; x < pinCode.length; x++) {
        if (pinCode[0] !== pinCode[x]) {
          isWeakPin = false;
          break;
        }
      }
      if (isWeakPin || checkfIfSequential(pinCode)) {
        setShowPin(true);
        return setErrorMessage(
          `Your MPIN must not contain ${isWeakPin ? 'repeating' : 'sequential'} digits ex. ${
            isWeakPin ? '0000' : '1234'
          }`,
        );
      }
      setPageIndex(oldstate => oldstate + 1);
    }
  };

  return (
    <EnterNewConfirmPinValidator
      errorMessage={errorMessage}
      pinCode={pinCode}
      label="Enter New MPIN"
      type="MPIN"
      showPin={showPin}
      setShowPin={setShowPin}
      onConfirm={onSubmit}
      onNumPress={onNumPress}
      onChangeText={val => {
        setPinCode(val);
        setErrorMessage('');
      }}
      numberOfBox={numberOfBox}
    />
  );
};
