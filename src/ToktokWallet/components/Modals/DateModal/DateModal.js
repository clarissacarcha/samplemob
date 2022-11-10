/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {ButtonOpacity, ButtonWithoutFeedback, CustomModal, CustomDatePicker} from './Styled';
import moment from 'moment';

const DateModal = (props: PropsType): React$Node => {
  const {visible, setVisible, value, onDateChange, minDate, maxDate} = props;
  const minimumDate = minDate ? minDate : new Date('1900-01-01');
  const maximumDate = maxDate ? maxDate : moment().subtract(18, 'years'); // restrict only 18yrs.old up
  const initialDate = new Date(moment().subtract(25, 'years'));

  const onPressClose = () => {
    setVisible(false);
  };

  return (
    <CustomModal visible={visible} onRequestClose={onPressClose}>
      <ButtonOpacity onPress={onPressClose}>
        <ButtonWithoutFeedback>
          <CustomDatePicker
            date={value === '' ? initialDate : new Date(value)}
            onDateChange={date => {
              onDateChange(date);
            }}
            maximumDate={new Date(maximumDate)}
            minimumDate={new Date(minimumDate)}
            open={visible}
          />
        </ButtonWithoutFeedback>
      </ButtonOpacity>
    </CustomModal>
  );
};

export default DateModal;
