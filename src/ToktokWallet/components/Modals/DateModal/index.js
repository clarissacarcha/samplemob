import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, TouchableWithoutFeedback} from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {YellowButton} from 'src/revamp';

export const DateModal = ({visible, setVisible, value, onDateChange, isCurrentDate, minDate, maxDate}) => {
  const minimumDate = minDate ? minDate : new Date('1900-01-01');
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth();
  const day = todayDate.getDate();
  // const maxDate = todayDate
  const maximumDate = maxDate ? maxDate : new Date(year - 18, month, day); // restrict only 18yrs.old up
  const initialDate = new Date(year - 25, month, day);

  return (
    <Modal
      style={{margin: 0}}
      visible={visible}
      onRequestClose={() => setVisible(false)}
      transparent={true}
      animationType="slide">
      <TouchableOpacity
        style={styles.dateModalContent}
        activeOpacity={1}
        onPress={() => {
          setVisible(false);
        }}>
        <TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <DatePicker
              date={value == '' ? initialDate : value}
              onDateChange={date => {
                onDateChange(date);
              }}
              mode="date"
              maximumDate={maximumDate}
              minimumDate={minimumDate}
            />
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dateModalContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
