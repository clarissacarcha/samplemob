/**
 * @format
 * @flow
 */

import React, {createContext, useState} from 'react';

import type {PropsType} from './types';
import {} from './Styled';
import {useAccount} from 'toktokwallet/hooks';
import {numberFormat, currencyCode} from 'toktokwallet/helper';

//GRAPHQL & HOOKS
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

export const TransactionVerifyContext: React$Context<any> = createContext<any>();
const {Provider} = TransactionVerifyContext;

const secondFieldValue = (itemCode, user, favoriteDetails) => {
  switch (itemCode) {
    case 'SSS':
      return favoriteDetails ? favoriteDetails.secondFieldValue : `${user.person.firstName} ${user.person.lastName}`;
    case 'PAG_IBIG':
      const mobNum = favoriteDetails ? favoriteDetails.secondFieldValue : user.username;
      return mobNum.includes('+63') ? mobNum.replace('+63', '') : mobNum.replace('0', '');
    default:
      return '';
  }
};
export const TransactionVerifyContextProvider = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const {tokwaAccount} = useAccount();
  const {user} = useSelector(state => state.session);
  const {children, favoriteDetails, itemCode} = props;
  const secondField = secondFieldValue(itemCode, user, favoriteDetails);

  const [data, setData] = useState({
    emailAddress: user.person.emailAddress,
    firstField: favoriteDetails ? favoriteDetails.firstFieldValue : '', //sss = prn; pag-ibig = account number;
    secondField: secondField, //sss = customer name; pag-ibig = contact number;
    amount: '',
    periodCoveredFrom: '', //pag-ibig
    periodCoveredTo: '', //pag-ibig
    paymentType: {name: '', id: ''}, //pag-ibig
    payorType: {description: '', id: ''}, //sss
  });
  const [errorMessages, setErrorMessages] = useState({
    amount: '',
    emailAddress: '',
    firstField: '',
    secondField: '',
    payorType: '',
    paymentType: '',
    periodCoveredFrom: '',
    periodCoveredTo: '',
  });
  const [fees, setFees] = useState({
    systemServiceFee: 0,
    providerServiceFee: 0,
    totalServiceFee: 0,
    type: '',
    feeInformation: '',
  });
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [sssMembershipTypes, setSssMembershipTypes] = useState([]);
  const [pagibigPaymentTypes, setPagibigPaymentTypes] = useState([]);

  const changeDataValue = (key, value) => {
    setData(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeAmount = value => {
    changeErrorMessages('amount', '');
    const num = value.replace(/[^0-9.]/g, '');
    const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
    if (!checkFormat) {
      return;
    }
    let decimalValueArray = num.split('.');
    if (decimalValueArray[0].length > 7) {
      return;
    }
    changeDataValue('amount', num[0] === '.' ? '0.' : num);
  };

  const changeErrorMessages = (key, value) => {
    setErrorMessages(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeFeesValue = (key, value) => {
    setFees(oldstate => ({...oldstate, [key]: value}));
  };

  const getConvenienceFeeText = ({convenienceFee, toktokSeviceFee}) => {
    if (convenienceFee > 0 && toktokSeviceFee > 0) {
      return `Additional ${currencyCode}${convenienceFee} convenience fee and ${currencyCode}${toktokSeviceFee} toktok service fee will be charge in this transaction.`;
    } else if (convenienceFee > 0) {
      return `Additional ${currencyCode}${convenienceFee} convenience fee will be charge in this transaction.`;
    } else if (toktokSeviceFee > 0) {
      return `Additional ${currencyCode}${toktokSeviceFee} toktok service fee will be charge in this transaction.`;
    } else {
      return 'Convenience Fee is waived for this transaction.';
    }
  };

  const processErrorMessage = (fieldValue, fieldName, fieldWidth, fieldType, minWidth) => {
    // 0 = min | 1 = exact | 2 = max

    if (fieldValue.length < minWidth) {
      return `${fieldName} must be minimum of ${minWidth} characters`;
    }
    switch (fieldType) {
      case 0:
        return fieldValue.length < fieldWidth ? `${fieldName} must be minimum of ${fieldWidth} characters` : '';
      case 1:
        return fieldValue.length < fieldWidth ? `${fieldName} must be ${fieldWidth} characters in length` : '';
      case 2:
        return fieldValue.length > fieldWidth ? `${fieldName} length must be ${fieldWidth} characters or less` : '';

      default:
        return '';
    }
  };

  const checkIsValidField = (key, fieldValue, fieldName, fieldWidth, fieldType, minWidth) => {
    let errorMessage = fieldValue
      ? processErrorMessage(fieldValue, fieldName, fieldWidth, fieldType, minWidth)
      : 'This is a required field';

    changeErrorMessages(key, errorMessage);
    return !errorMessage;
  };

  const isFieldRequired = (key, value, type) => {
    const errorType = type === 'selection' ? 'Please make a selection' : 'This is a required field';
    const error = !value ? errorType : '';
    changeErrorMessages(key, error);
    return !error;
  };

  const checkContactNumber = (key, value) => {
    let error = value === '' ? 'This is a required field' : '';
    if (error === '' && value.length < 10) {
      error = 'Invalid contact number';
    }
    changeErrorMessages(key, error);
    return !error;
  };

  return (
    <Provider
      value={{
        data,
        setData,
        errorMessages,
        changeErrorMessages,
        changeDataValue,
        fees,
        changeFeesValue,
        changeAmount,
        getConvenienceFeeText,
        processErrorMessage,
        isInsufficientBalance,
        setIsInsufficientBalance,
        checkIsValidField,
        isFieldRequired,
        checkContactNumber,
        sssMembershipTypes,
        setSssMembershipTypes,
        pagibigPaymentTypes,
        setPagibigPaymentTypes,
      }}>
      {children}
    </Provider>
  );
};
