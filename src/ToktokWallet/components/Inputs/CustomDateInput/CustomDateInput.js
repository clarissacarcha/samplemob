/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {Button, ButtonImage, ButtonText, ErrorText, Label} from './Styled';
import moment from 'moment';
import {DateModal} from 'toktokwallet/components';

const CustomDateInput = (props: PropsType): React$Node => {
  const {selectedValue, errorMessage, onSelectedValue, label, dateFormat = 'MM/DD/YYYY'} = props;
  const btnText = !selectedValue ? 'mm/dd/yyyy' : moment(selectedValue).format(dateFormat);
  const hasError = !!errorMessage;

  const [visible, setVisible] = useState(false);

  const onDateChange = date => {
    onSelectedValue(date);
  };

  return (
    <>
      <DateModal onDateChange={onDateChange} visible={visible} setVisible={setVisible} value={selectedValue} />
      {label !== '' && <Label>{label}</Label>}
      <Button hasError={hasError} onPress={() => setVisible(true)}>
        <ButtonText selectedValue={selectedValue}>{btnText}</ButtonText>
        <ButtonImage />
      </Button>
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </>
  );
};

export default CustomDateInput;
