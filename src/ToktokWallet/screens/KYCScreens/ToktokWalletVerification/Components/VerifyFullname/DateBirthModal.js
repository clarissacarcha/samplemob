import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {YellowButton} from 'src/revamp';

const DateBirthModal = ({modalVisible, setModalVisible, birthInfo, changeBirthInfo, changeError}) => {
  const minDate = new Date('1900-01-01');
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth();
  const day = todayDate.getDate();
  // const maxDate = todayDate
  const maxDate = new Date(year - 18, month, day); // restrict only 18yrs.old up
  const initialDate = new Date(year - 25, month, day);

  const [bday, setBday] = useState(birthInfo.birthdate == '' ? initialDate : birthInfo.birthdate);

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      transparent={true}
      animationType="slide">
      <TouchableOpacity
        style={styles.dateModalContent}
        activeOpacity={1}
        onPress={() => {
          setModalVisible(false);
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.content}>
            <DatePicker
              date={birthInfo.birthdate == '' ? initialDate : birthInfo.birthdate}
              onDateChange={date => {
                changeBirthInfo('birthdate', date);
                changeError();
              }}
              mode="date"
              maximumDate={maxDate}
              minimumDate={minDate}
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
  },
  content: {
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default DateBirthModal;
