/**
 * @format
 * @flow
 */

import React, {useContext, useEffect, useState} from 'react';

import type {PropsType} from './types';
import {Container, FeeInformation, InputContainer} from './Styled';
import {CustomTextInput, CustomAmountInput, CustomSelectionList} from 'toktokwallet/components';
import {TransactionVerifyContext} from '../../TransactionVerifyContextProvider';
//HELPER
import {
  moderateScale,
  formatAmount,
  numberFormat,
  numericRegex,
  alphanumericRegex,
  maxLengthRegex,
  minLengthRegex,
  currencyCode,
} from 'toktokbills/helper';

import {Keyboard} from 'react-native';

const processFieldValue = (fieldValue, fieldWidth, fieldType) => {
  // 0 = min | 1 = exact | 2 = max
  return fieldType != 0 ? maxLengthRegex(fieldValue, fieldWidth) : fieldValue;
};

const BillsForm = (props: PropsType): React$Node => {
  const {
    data,
    fees,
    errorMessages,
    changeDataValue,
    changeErrorMessages,
    changeAmount,
    changeFeesValue,
    postComputeConvenienceFee,
    getConvenienceFeeText,
  } = useContext(TransactionVerifyContext);
  const {billItemSettings, headerHeight} = props;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {
    firstFieldName,
    firstFieldFormat,
    firstFieldWidth,
    firstFieldWidthType,
    firstFieldMinWidth,
    secondFieldName,
    secondFieldFormat,
    secondFieldWidth,
    secondFieldWidthType,
    secondFieldMinWidth,
    commissionRateDetails,
  } = billItemSettings;

  //CONVENIENCE FEE
  const convenienceFee = `${numberFormat(parseFloat(commissionRateDetails?.providerServiceFee))}`;
  const toktokSeviceFee = `${numberFormat(parseFloat(commissionRateDetails?.systemServiceFee))}`;
  const convenienceFeeText = getConvenienceFeeText({convenienceFee, toktokSeviceFee});

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

  const changeData = (fieldType, fieldValue, fieldFormat, fieldWidth, fieldWidthType) => {
    const formatValue = fieldFormat === 1 ? numericRegex(fieldValue) : alphanumericRegex(fieldValue);
    const finalValue = processFieldValue(formatValue, fieldWidth, fieldWidthType);
    changeDataValue(fieldType, finalValue);
  };

  return (
    <Container>
      <InputContainer>
        <CustomTextInput
          label={firstFieldName}
          onChangeText={value => {
            changeData('firstField', value, firstFieldFormat, firstFieldWidth, firstFieldWidthType);
            changeErrorMessages('firstField', '');
          }}
          value={data.firstField}
          errorMessage={errorMessages.firstField}
          keyboardType={firstFieldFormat == 1 ? 'numeric' : 'default'}
          maxLength={firstFieldWidthType == 1 || firstFieldWidthType == 2 ? firstFieldWidth : null}
          returnKeyType="done"
        />
      </InputContainer>
      <InputContainer>
        <CustomTextInput
          label={secondFieldName}
          onChangeText={value => {
            changeData('secondField', value, secondFieldFormat, secondFieldWidth, secondFieldWidthType);
            changeErrorMessages('secondField', '');
          }}
          value={data.secondField}
          errorMessage={errorMessages.secondField}
          keyboardType={secondFieldFormat == 1 ? 'numeric' : 'default'}
          maxLength={secondFieldWidthType == 1 || secondFieldWidthType == 2 ? secondFieldWidth : null}
          returnKeyType="done"
        />
      </InputContainer>
      <InputContainer>
        <CustomTextInput
          label="Email Address"
          onChangeText={value => {
            changeDataValue('emailAddress', value);
            changeErrorMessages('emailAddress', '');
          }}
          value={data.emailAddress}
          returnKeyType="done"
          errorMessage={errorMessages.emailAddress}
        />
      </InputContainer>
      <CustomAmountInput
        label={'Payment Amount'}
        value={data.amount}
        onChangeText={value => {
          changeAmount(value);
        }}
        errorMessage={errorMessages.amount}
        // onBlur={computeConvenienceFee}
      />
      <FeeInformation>{convenienceFeeText}</FeeInformation>
    </Container>
  );
};

export default BillsForm;
