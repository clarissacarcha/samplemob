import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Platform} from 'react-native';
import moment from 'moment';

import {DARK} from '../../res/constants';
import {SizedBox} from '../widgets/SizedBox';

import OrderTypeSelectInput from './widgets/OrderTypeSelectInput';
import ScheduledDateInput from './widgets/ScheduledDateInput';

const Widget = ({initialData, onChange, marginTop, marginBottom}) => {
  const {orderType, scheduledDate} = initialData;
  const [selectedOrderType, setSelectedOrderType] = useState(orderType);
  const [selectedscheduledDate, setSelectedscheduledDate] = useState(scheduledDate);

  const onAsapSelected = () => {
    onChange({
      orderType: 'ASAP',
      scheduledDate: moment().format('YYYY-MM-DD').toString(),
    });
  };

  const onScheduledSelected = (date) => {
    onChange({
      orderType: 'SCHEDULED',
      scheduledDate: date,
    });
  };

  /**
   * Synchronize changes on Order Type and Scheduled Date
   */
  const onAnyChange = (value) => {
    // If Order Type changed
    if (['ASAP', 'SCHEDULED'].includes(value)) {
      setSelectedOrderType(value);
      if (value === 'ASAP') {
        onAsapSelected();
      } else {
        onScheduledSelected(moment().format('YYYY-MM-DD').toString());
      }
    }
    // If Scheduled Date changed
    else {
      setSelectedscheduledDate(value);
      onScheduledSelected(value);
    }
  };

  return (
    <>
      {marginTop && <SizedBox />}
      <View style={styles.container}>
        <Text style={styles.label}>Order Type</Text>
        {/*-------------------- ORDER TYPE PICKER --------------------*/}
        <OrderTypeSelectInput initialValue={selectedOrderType} onChange={onAnyChange} />

        {/*-------------------- DATE PICKER --------------------*/}
        {selectedOrderType === 'SCHEDULED' && (
          <ScheduledDateInput initialValue={selectedscheduledDate} onChange={onAnyChange} />
        )}
      </View>
      {marginBottom && <SizedBox />}
    </>
  );
};

Widget.propTypes = {
  initialData: {
    orderType: PropTypes.string.isRequired,
    scheduledDate: PropTypes.string.isRequired,
  },
  onChange: PropTypes.func.isRequired,
};

export const OrderTypeInput = Widget;

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS !== 'android' && {
      zIndex: 10,
    }),
  },
  label: {
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
});
