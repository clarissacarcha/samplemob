import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Keyboard, Platform} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import {CustomAmountInput, MobileNumberInput, CustomTextInput} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
const {FONT_SIZE, SIZE} = CONSTANTS;

export const Forms = ({
  tokwaAccount,
  recipientInfo,
  formData,
  setFormData,
  errorMessages,
  setErrorMessages,
  headerHeight,
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const changeDataValue = (key, value) => {
    setFormData(prev => ({...prev, [key]: value}));
  };

  const changeErrorMessages = (key, value) => {
    setErrorMessages(prev => ({...prev, [key]: value}));
  };

  const changeAmount = value => {
    changeDataValue('amount', value);
  };

  return (
    <View style={styles.container}>
      <View style={{marginBottom: moderateScale(15)}}>
        <MobileNumberInput
          label="Send Money to "
          name={formData.recipientName}
          value={formData.recipientMobileNo.replace('+63', '')}
          editable={false}
          hasFavorite
          hasContacts
        />
      </View>
      <View style={{marginBottom: moderateScale(15)}}>
        <CustomAmountInput
          label="Enter Amount"
          value={formData.amount}
          onChangeText={value => {
            changeAmount(value);
            changeErrorMessages('amount', '');
          }}
          errorMessage={errorMessages.amount}
        />
      </View>
      <View style={{marginBottom: moderateScale(15)}}>
        <CustomTextInput
          label="Email Address"
          value={formData.emailAddress}
          onChangeText={value => {
            changeDataValue('emailAddress', value);
            changeErrorMessages('emailAddress', '');
          }}
          errorMessage={errorMessages.emailAddress}
        />
      </View>
      <View
        style={{
          marginBottom:
            isKeyboardVisible && Platform.OS === 'ios' ? moderateScale(headerHeight * 2) : moderateScale(15),
        }}>
        <CustomTextInput
          label="Note (optional)"
          value={formData.note}
          maxLength={320}
          placeholder="Enter note here"
          onChangeText={value => changeDataValue('note', value)}
          textAlignVertical="top"
          numberOfLines={4}
          multiline={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  amount: {
    height: SIZE.FORM_HEIGHT,
    paddingHorizontal: 5,
    width: '100%',
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    borderRadius: 5,
    flexDirection: 'row',
    fontSize: FONT_SIZE.M,
  },
});
