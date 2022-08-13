/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {Button, ButtonImage, ButtonText, ErrorText} from './Styled';
import moment from 'moment';
import {DateModal} from 'toktokwallet/components';

const CustomDateInput = (props: PropsType): React$Node => {
  const {selectedValue, errorMessage, onSelectedValue} = props;
  const btnText = !selectedValue ? 'mm/dd/yy' : moment(selectedValue).format('MM/DD/YYYY');
  const hasError = !!errorMessage;

  const [visible, setVisible] = useState(false);

  const onDateChange = date => {
    onSelectedValue(date);
  };

  return (
    <>
      <DateModal onDateChange={onDateChange} visible={visible} setVisible={setVisible} value={selectedValue} />
      <Button hasError={hasError} onPress={() => setVisible(true)}>
        <ButtonText selectedValue={selectedValue}>{btnText}</ButtonText>
        <ButtonImage />
      </Button>
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </>
  );
};

export default CustomDateInput;
