import React, {useState} from 'react';
import {AmountLimitHelper, currencyCode} from 'toktokwallet/helper';
import {useNavigation} from '@react-navigation/native';
import {AlertOverlay} from 'src/components';
import {OrangeButton} from 'toktokwallet/components';
import validator from 'validator';

export const ProceedButton = ({route, formData, setFormData, setErrorMessages, errorMessages, tokwaAccount}) => {
  const navigation = useNavigation();
  const {merchant, branch, terminal, qrCode} = route.params;

  const checkAmount = () => {
    let errorM = '';
    if (+formData.amount >= 1 && +formData.amount <= tokwaAccount.wallet.transferableBalance) {
      errorM = '';
    } else if (+formData.amount < 1 && formData.amount !== '') {
      errorM = `The minimum amount allowed is ${currencyCode}1`;
    } else if (+formData.amount > tokwaAccount.wallet.transferableBalance) {
      errorM = 'You have insufficient balance. Kindly cash in or enter a lower amount.';
    } else {
      errorM = 'This is a required field';
    }

    changeErrorMessages('amount', errorM);
    return !errorM;
  };

  const changeErrorMessages = (key, value) => {
    setErrorMessages(prev => ({...prev, [key]: value}));
  };

  const reviewAndConfirm = async () => {
    const isValidAmount = checkAmount();

    if (isValidAmount) {
      setFormData(prev => ({...prev, note: formData.note.trim()}));
      return navigation.navigate('ToktokWalletMerchantPaymentSummary', {
        formData: {...formData, note: formData.note.trim()},
        merchant,
        branch,
        terminal,
        qrCode,
      });
    }
  };

  return (
    <>
      {/* <AlertOverlay visible={loading} /> */}
      <OrangeButton label="Proceed" hasShadow onPress={reviewAndConfirm} />
    </>
  );
};
