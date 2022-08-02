import React, {useRef, useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';
import constants from '../../../../../common/res/constants';
import {NumberBoxes} from 'toktokwallet/components';

export const EnterOTPScreen = ({onSubmit}) => {
  const session = useSelector(state => state.session);
  const mobileNumber = session.user.person.mobileNumber;
  const [pinCode, setPinCode] = useState('');

  const inputRef = useRef();

  const onNumPress = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  return (
    <View>
      <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 35}}>
        <Text style={{fontFamily: constants.FONT_FAMILY.REGULAR, fontSize: constants.FONT_SIZE.L}}>Enter OTP</Text>
        <Text
          style={{
            fontFamily: constants.FONT_FAMILY.REGULAR,
            fontSize: constants.FONT_SIZE.M,
            textAlign: 'center',
            marginTop: 8,
          }}>
          To confirm your account deletion, enter the OTP we have sent to your mobile number ending with{' '}
          {mobileNumber.substring(9, 13)}
        </Text>
      </View>
      <View style={{paddingTop: 13}}>
        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={true} />
        <TextInput
          caretHidden
          value={pinCode}
          ref={inputRef}
          style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
          keyboardType="number-pad"
          returnKeyType="done"
          onChangeText={value => {
            if (value.length <= 6) {
              const num = value.replace(/[^0-9]/g, '');
              setPinCode(num);
            }
          }}
          onSubmitEditing={pinCode.length == 6 ? onSubmit : null}
        />
      </View>
    </View>
  );
};
