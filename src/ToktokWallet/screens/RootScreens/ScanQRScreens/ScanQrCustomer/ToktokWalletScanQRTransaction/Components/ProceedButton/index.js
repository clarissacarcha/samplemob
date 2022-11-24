import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {moderateScale, AmountLimitHelper, currencyCode} from 'toktokwallet/helper';
import {useNavigation} from '@react-navigation/native';
import {AlertOverlay} from 'src/components';
import {OrangeButton} from 'toktokwallet/components';
import validator from 'validator';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const ProceedButton = ({
  swipeEnabled,
  setSwipeEnabled,
  note,
  recipientInfo,
  isCertify,
  setErrorMessage,
  errorMessage,
  formData,
  setFormData,
  setErrorMessages,
  errorMessages,
  tokwaAccount,
}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const checkAmount = () => {
    let errorM = '';

    if (+formData.amount >= 1 && +formData.amount <= tokwaAccount.wallet.transferableBalance) {
      errorM = '';
    } else if (+formData.amount < 1 && formData.amount !== '') {
      errorM = `The minimum amount allowed to transfer is ${currencyCode}1`;
    } else if (+formData.amount > tokwaAccount.wallet.transferableBalance) {
      errorM = 'You have insufficient balance';
    } else {
      errorM = 'This is a required field';
    }

    changeErrorMessages('amount', errorM);
    return !errorM;
  };

  const checkEmail = () => {
    let errorM = formData.emailAddress === '' ? 'This is a required field' : '';
    if (errorM === '' && !validator.isEmail(formData.emailAddress, {ignore_whitespace: true})) {
      errorM = 'Invalid email address format';
    }
    changeErrorMessages('emailAddress', errorM);
    return !errorM;
  };

  const changeErrorMessages = (key, value) => {
    setErrorMessages(prev => ({...prev, [key]: value}));
  };

  const reviewAndConfirm = async () => {
    const isValidAmount = checkAmount();
    const isValidEmailAddress = checkEmail();
    let checkLimit = true;

    if (isValidAmount) {
      setLoading(true);
      checkLimit = await AmountLimitHelper.postCheckOutgoingLimit({
        amount: formData.amount,
        mobileNumber: recipientInfo.mobileNumber,
        setErrorMessage: value => {
          changeErrorMessages('amount', value);
        },
      });
    }
    if (checkLimit && isValidEmailAddress && isValidAmount) {
      setLoading(false);
      setFormData(prev => ({...prev, note: formData.note.trim()}));
      return navigation.navigate('ToktokWalletScanQRPaymentSummary', {
        formData: {...formData, note: formData.note.trim()},
        recipientInfo,
      });
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertOverlay visible={loading} />
      {/* <View style={{paddingHorizontal: moderateScale(16), backgroundColor: 'white'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ToktokWalletTermsConditions')}
          style={{marginBottom: moderateScale(16)}}>
          <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S, color: '#525252'}}>
            Please review the accuracy of the details provided and read our{' '}
            <Text style={{color: COLOR.ORANGE, fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>
              Terms and Conditions
            </Text>{' '}
            before you proceed with your transaction.
          </Text>
        </TouchableOpacity>
      </View> */}
      <OrangeButton label="Proceed" hasShadow onPress={reviewAndConfirm} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
  },
});
