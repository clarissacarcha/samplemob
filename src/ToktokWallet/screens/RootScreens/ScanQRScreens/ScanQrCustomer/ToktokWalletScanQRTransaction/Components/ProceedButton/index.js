import React, {useState} from 'react';
import {AmountLimitHelper, currencyCode, numberFormat} from 'toktokwallet/helper';
import {useNavigation} from '@react-navigation/native';
import {AlertOverlay} from 'src/components';
import {OrangeButton} from 'toktokwallet/components';
import validator from 'validator';

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
      <OrangeButton label="Proceed" hasShadow onPress={reviewAndConfirm} />
    </>
  );
};
