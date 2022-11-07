/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {ButtonOpacity, ButtonWithoutFeedback, CustomModal, CustomDatePicker} from './Styled';
import moment from 'moment';

const processMinimumDate = (isMinDateToday, minDate) => {
  if (isMinDateToday && minDate) {
    return new Date(minDate);
  } else if (isMinDateToday) {
    return new Date();
  } else if (minDate) {
    return new Date(minDate);
  } else {
    return new Date('1900-01-01');
  }
};

const processMaximumDate = (isMinDateToday, maxDate) => {
  if (isMinDateToday) {
    return new Date(moment().add(18, 'years'));
  } else if (maxDate) {
    return new Date(maxDate);
  } else {
    return new Date(moment().subtract(18, 'years'));
  }
};

const processInitialDate = (isMinDateToday, minDate) => {
  if (isMinDateToday) {
    return new Date();
  } else if (minDate) {
    return new Date(minDate);
  } else {
    return new Date(moment().subtract(25, 'years'));
  }
};

const DateModal = (props: PropsType): React$Node => {
  const {visible, setVisible, value, onDateChange, minDate, maxDate, isMinDateToday} = props;
  const minimumDate = processMinimumDate(isMinDateToday, minDate);
  const maximumDate = processMaximumDate(isMinDateToday, maxDate); // restrict only 18yrs.old up
  const initialDate = processInitialDate(isMinDateToday, minDate);

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
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            open={visible}
          />
        </ButtonWithoutFeedback>
      </ButtonOpacity>
    </CustomModal>
  );
};

export default DateModal;
