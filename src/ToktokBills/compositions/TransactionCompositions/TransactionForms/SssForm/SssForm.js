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

const SssForm = (props: PropsType): React$Node => {
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
          label="Payment Reference Number (PRN)"
          onChangeText={value => {
            changeData('firstField', value, 1, 14, 1);
            changeErrorMessages('firstField', '');
          }}
          value={data.firstField}
          errorMessage={errorMessages.firstField}
          keyboardType={'numeric'}
          maxLength={14}
          returnKeyType="done"
        />
      </InputContainer>
      <InputContainer>
        <CustomSelectionList
          selectedValue={data.payorTypeName}
          label="Payor Type"
          data={[
            {description: 'Farmers & Fisherman'},
            {description: 'Non-working Spouse'},
            {description: 'Overseas Filipino Worker (OFW)'},
            {description: 'Self-employed'},
            {description: 'Voluntary'},
          ]}
          onSelectedValue={({value}) => {
            changeDataValue('payorTypeName', value);
            changeErrorMessages('payorTypeName', '');
          }}
          errorMessage={errorMessages.payorTypeName}
          placeholder="Select Payor Type"
        />
      </InputContainer>
      <InputContainer>
        <CustomTextInput
          label="Customer Name"
          onChangeText={value => {
            changeDataValue('secondField', value);
            changeErrorMessages('secondField', '');
          }}
          value={data.secondField}
          returnKeyType="done"
          maxLength={30}
          errorMessage={errorMessages.secondField}
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
        label={'Enter Amount'}
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

export default SssForm;
