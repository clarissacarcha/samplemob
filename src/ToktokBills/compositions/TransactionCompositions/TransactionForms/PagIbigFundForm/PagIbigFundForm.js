/**
 * @format
 * @flow
 */

import React, {useContext, useEffect, useState} from 'react';

import type {PropsType} from './types';
import {Container, FeeInformation, InputContainer, RowContainer, Space} from './Styled';
import {CustomTextInput, CustomAmountInput, MobileNumberInput} from 'toktokwallet/components';
import {CustomSelectionList, CustomDateInput} from 'toktokbills/components';
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
import moment from 'moment';

const processFieldValue = (fieldValue, fieldWidth, fieldType) => {
  // 0 = min | 1 = exact | 2 = max
  return fieldType != 0 ? maxLengthRegex(fieldValue, fieldWidth) : fieldValue;
};

const PagIbigFundForm = (props: PropsType): React$Node => {
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
    pagibigPaymentTypes,
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
        <CustomSelectionList
          selectedValue={data.paymentType?.description}
          label="Payment Type"
          data={pagibigPaymentTypes}
          onSelectedValue={({item}) => {
            changeDataValue('paymentType', item);
            changeErrorMessages('paymentType', '');
            changeErrorMessages('amount', '');
          }}
          errorMessage={errorMessages.paymentType}
          placeholder="Select Payor Type"
        />
      </InputContainer>
      <InputContainer>
        <CustomTextInput
          label="Account Number"
          onChangeText={value => {
            changeData('firstField', value, 1, 20, 1);
            changeErrorMessages('firstField', '');
          }}
          value={data.firstField}
          errorMessage={errorMessages.firstField}
          keyboardType={'numeric'}
          maxLength={20}
          returnKeyType="done"
        />
      </InputContainer>
      <InputContainer>
        <MobileNumberInput
          label="Contact Number"
          keyboardType={'number-pad'}
          value={data.secondField}
          onChangeText={value => {
            changeDataValue('secondField', value);
            changeErrorMessages('secondField', '');
          }}
          maxLength={10}
          errorMessage={errorMessages.secondField}
          isMinDateToday
        />
      </InputContainer>
      <RowContainer>
        <CustomDateInput
          label="Period Covered From"
          onSelectedValue={date => {
            changeDataValue('periodCoveredFrom', date);
            changeErrorMessages('periodCoveredFrom', '');
            if (data.periodCoveredTo && moment(date).isAfter(moment(data.periodCoveredTo))) {
              changeDataValue('periodCoveredTo', '');
            }
          }}
          selectedValue={data.periodCoveredFrom}
          displaySelectedValue={
            data.periodCoveredFrom !== ''
              ? moment(data.periodCoveredFrom).format('MM YYYY').replace(' ', '')
              : data.periodCoveredFrom
          }
          errorMessage={errorMessages.periodCoveredFrom}
          placeholder="mm yyyy"
          isMinDateToday
          hasIcon={false}
        />
        <Space />
        <CustomDateInput
          label="Period Covered To"
          onSelectedValue={date => {
            changeDataValue('periodCoveredTo', date);
            changeErrorMessages('periodCoveredTo', '');
          }}
          selectedValue={data.periodCoveredTo}
          displaySelectedValue={
            data.periodCoveredTo !== ''
              ? moment(data.periodCoveredTo).format('MM YYYY').replace(' ', '')
              : data.periodCoveredTo
          }
          errorMessage={errorMessages.periodCoveredTo}
          placeholder="mm yyyy"
          minDate={data.periodCoveredFrom}
          isMinDateToday
          hasIcon={false}
        />
      </RowContainer>
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

export default PagIbigFundForm;
