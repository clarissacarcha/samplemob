import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {numberFormat, AmountLimitHelper, currencyCode} from 'toktokwallet/helper';
import {useNavigation} from '@react-navigation/native';
import {AlertOverlay} from 'src/components';
import {OrangeButton, PromptModal} from 'toktokwallet/components';
import validator from 'validator';
import {usePrompt} from 'src/hooks';

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
  const prompt = usePrompt();
  const [loading, setLoading] = useState(false);

  const checkAmount = () => {
    let errorM = '';

    if (+formData.amount >= 1 && +formData.amount <= tokwaAccount.wallet.transferableBalance) {
      errorM = '';
    } else if (+formData.amount < 1 && formData.amount !== '') {
      errorM = `The minimum amount allowed is ${currencyCode}1`;
    } else if (+formData.amount > tokwaAccount.wallet.transferableBalance) {
      errorM = `Transferable amount exceeded. The maximum amount allowed is ₱${numberFormat(
        tokwaAccount.wallet.transferableBalance,
      )}.`;
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

  const checkMobileNumber = () => {
    let errorM = formData.recipientMobileNo === '' ? 'This is a required field' : '';
    if (errorM === '') {
      errorM = formData.recipientMobileNo.length < 10 ? 'Invalid mobile number' : '';
    }
    if (errorMessages.recipientMobileNo !== '') {
      errorM = errorMessages.recipientMobileNo;
    }
    changeErrorMessages('recipientMobileNo', errorM);
    return !errorM;
  };

  const changeErrorMessages = (key, value) => {
    setErrorMessages(prev => ({...prev, [key]: value}));
  };

  const reviewAndConfirm = async () => {
    const isValidAmount = checkAmount();
    const isValidEmailAddress = checkEmail();
    const isValidMobileNumber = checkMobileNumber();
    let checkLimit = true;

    if (isValidAmount) {
      setLoading(true);
      checkLimit = await AmountLimitHelper.postCheckOutgoingLimit({
        amount: formData.amount,
        mobileNumber: `+63${formData.recipientMobileNo}`,
        setErrorMessage: value => {
          changeErrorMessages('amount', value);
        },
        setRecipientError: ({isRecipient, promptMessage}) => {
          if (isRecipient) {
            prompt({
              type: 'error',
              title: 'Transaction Failed',
              message: promptMessage,
              event: 'TOKTOKBILLSLOAD',
            });
          }
        },
      });
    }
    if (checkLimit && isValidEmailAddress && isValidAmount && isValidMobileNumber) {
      setLoading(false);
      setFormData(prev => ({...prev, note: formData.note.trim()}));
      return navigation.navigate('ToktokWalletSendMoneyPaymentSummary', {
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
      {/* <PromptModal
        visible={showPrompt.visible}
        event="error"
        message={showPrompt.message}
        title="Transaction Failed"
        onPress={() => setShowPrompt(prev => ({...prev, visible: false}))}
      /> */}
      <OrangeButton label="Proceed" hasShadow onPress={reviewAndConfirm} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
  },
});
