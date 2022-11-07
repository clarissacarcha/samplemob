/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {Button, ButtonImage, ButtonText, ErrorText, Label, Container} from './Styled';
import moment from 'moment';
import {DateModal} from 'toktokwallet/components';

const processValue = (selectedValue, placeholder, dateFormat, displaySelectedValue) => {
  if (selectedValue === '') {
    return placeholder;
  } else if (displaySelectedValue) {
    return displaySelectedValue;
  } else {
    return moment(selectedValue).format(dateFormat);
  }
};

const CustomDateInput = (props: PropsType): React$Node => {
  const {
    selectedValue,
    errorMessage,
    onSelectedValue,
    label = '',
    dateFormat = 'MM/DD/YYYY',
    placeholder = 'mm/dd/yyyy',
    minDate,
    isMinDateToday = false,
    displaySelectedValue,
    hasIcon = true,
  } = props;
  const btnText = processValue(selectedValue, placeholder, dateFormat, displaySelectedValue);
  const hasError = !!errorMessage;

  const [visible, setVisible] = useState(false);

  const onDateChange = date => {
    onSelectedValue(date);
  };

  return (
    <Container label={label}>
      <DateModal
        onDateChange={onDateChange}
        visible={visible}
        setVisible={setVisible}
        value={selectedValue}
        minDate={minDate}
        isMinDateToday={isMinDateToday}
      />
      {label !== '' && <Label>{label}</Label>}
      <Button hasError={hasError} onPress={() => setVisible(true)}>
        <ButtonText selectedValue={selectedValue}>{btnText}</ButtonText>
        {hasIcon && <ButtonImage />}
      </Button>
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
};

export default CustomDateInput;
