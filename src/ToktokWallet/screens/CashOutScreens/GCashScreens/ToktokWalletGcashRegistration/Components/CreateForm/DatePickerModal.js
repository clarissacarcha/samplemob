import React, {useState} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Modal} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

import { YellowButton } from 'src/revamp';

export default ({visible, hidePicker, onDateSelect}) => {
  const minDate = new Date('1900-01-01');
  const todayDate = new Date();
  const [date, setDate] = useState(new Date());

  const onConfirm = () => {
    onDateSelect(moment(date).format('YYYY-MM-DD'));
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={hidePicker}>
      <TouchableWithoutFeedback onPress={hidePicker}>
        <View style={styles.modal}>
          <View style={styles.pickerView}>
            <DatePicker date={date} onDateChange={setDate} mode="date" maximumDate={todayDate} minimumDate={minDate} />
            <YellowButton onPress={onConfirm} label="Confirm" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  pickerView: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
  },
});
