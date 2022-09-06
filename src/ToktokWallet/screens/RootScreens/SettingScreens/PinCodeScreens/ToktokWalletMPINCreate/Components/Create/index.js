import React, {useState, useRef, useEffect} from 'react';
import {EnterNewConfirmPinValidator} from 'toktokwallet/components';

export const Create = ({pinCode, setPinCode, pageIndex, setPageIndex, tokwaAccount}) => {
  const [newPinCode, setNewPinCode] = useState('');
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const numberOfBox = 4;

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  const checkfIfSequential = newPinCode => {
    let isPinSequential = false;
    let a = +newPinCode[1] - +newPinCode[0];
    let b = +newPinCode[2] - +newPinCode[1];
    let c = +newPinCode[3] - +newPinCode[2];
    // if(a == 1 && b == 1 && c == 1){
    //     isPinSequential = true
    // }
    if (a == b && b == c && c == a) {
      isPinSequential = true;
    }
    return isPinSequential;
  };

  const onSubmit = () => {
    if (newPinCode.length >= numberOfBox && newPinCode !== '') {
      let isWeakPin = true;
      for (let x = 0; x < newPinCode.length; x++) {
        if (newPinCode[0] !== newPinCode[x]) {
          isWeakPin = false;
          break;
        }
      }
      if (isWeakPin || checkfIfSequential(newPinCode)) {
        setShowPin(true);
        return setErrorMessage(
          `Your MPIN must not contain ${isWeakPin ? 'repeating' : 'sequential'} digits ex. ${
            isWeakPin ? '0000' : '1234'
          }`,
        );
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
      label="Enter New MPIN"
      type="MPIN"
      showPin={showPin}
      setShowPin={setShowPin}
      onConfirm={onSubmit}
      onNumPress={onNumPress}
      onChangeText={val => {
        setNewPinCode(val);
        setErrorMessage('');
      }}
      numberOfBox={numberOfBox}
    />
  );
  // return (
  //   <View style={styles.container}>
  //     <View style={styles.content}>
  //       {!tokwaAccount.mpinCode && (
  //         <Text
  //           style={{
  //             marginVertical: 20,
  //             marginHorizontal: 10,
  //             textAlign: 'center',
  //             fontFamily: FONT.REGULAR,
  //             fontSize: FONT_SIZE.S,
  //           }}>
  //           ka-toktok, do not forget your MPIN, keep it to yourself and do not share this with anyone.
  //         </Text>
  //       )}
  //       <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD, marginTop: 20, alignSelf: 'center'}}>
  //         {tokwaAccount.mpinCode ? 'Enter' : 'Setup'} {tokwaAccount.mpinCode ? 'New ' : ''}MPIN
  //       </Text>
  //       <View style={{position: 'relative', marginTop: 20}}>
  //         <NumberBoxes pinCode={newPinCode} onNumPress={onNumPress} showPin={showPin} numberOfBox={4} />
  //         <TextInput
  //           caretHidden
  //           value={newPinCode}
  //           ref={inputRef}
  //           style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
  //           keyboardType="number-pad"
  //           returnKeyType="done"
  //           onChangeText={value => {
  //             if (value.length <= 4) {
  //               const num = value.replace(/[^0-9]/g, '');
  //               setNewPinCode(num);
  //             }
  //           }}
  //           onSubmitEditing={newPinCode.length == 4 ? onSubmit : null}
  //         />

  //         {errorMessage != '' && (
  //           <Text style={{fontFamily: FONT.REGULAR, fontSize: 12, color: COLOR.RED, alignSelf: 'center'}}>
  //             {errorMessage}
  //           </Text>
  //         )}

  //         <TouchableOpacity
  //           style={{marginTop: height * 0.07, paddingVertical: 10, alignItems: 'center'}}
  //           onPress={() => setShowPin(!showPin)}>
  //           <Text style={{color: COLOR.ORANGE, fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>
  //             {showPin ? 'Hide MPIN' : 'Show MPIN'}
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //     <View style={{padding: 16}}>
  //       {newPinCode.length < 4 ? <DisabledButton label="Next" /> : <YellowButton label="Next" onPress={onSubmit} />}
  //     </View>
  //     <BuildingBottom />
  //   </View>
  // );
};
