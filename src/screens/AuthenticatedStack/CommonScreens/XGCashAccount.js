import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {GET_GCASH_ACCOUNT} from '../../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {COLOR, DARK, MEDIUM, LIGHT} from '../../../res/constants';
import {HeaderBack, HeaderTitle} from '../../../components';
import {BlackButton} from '../../../components/ui/BlackButton';

const DatePickerModal = ({visible, hidePicker, onDateSelect}) => {
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
            <BlackButton onPress={onConfirm} label="Confirm" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const GCashAccount = ({navigation, constants, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['GCash', 'Account']} />,
  });

  const [mobileNumber, setMobileNumber] = useState('');
  const [firstName, setfirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setlastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const [pickerVisible, setPickerVisible] = useState(false);

  console.log(JSON.stringify(session.user.person.id, null, 4));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            value={mobileNumber}
            onChangeText={(value) => setMobileNumber(value)}
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor={MEDIUM}
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={(value) => {
              setfirstName(value);
            }}
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor={MEDIUM}
          />

          <Text style={styles.label}>Middle Name (Optional)</Text>
          <TextInput
            value={middleName}
            onChangeText={(value) => {
              setMiddleName(value);
            }}
            style={styles.input}
            placeholder="Middle Name"
            placeholderTextColor={MEDIUM}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={(value) => {
              setlastName(value);
            }}
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor={MEDIUM}
          />

          <Text style={styles.label}>Street Address</Text>
          <TextInput
            value={streetAddress}
            onChangeText={(value) => {
              setStreetAddress(value);
            }}
            style={styles.input}
            placeholder="Street Address"
            placeholderTextColor={MEDIUM}
          />

          <Text style={styles.label}>Birthdate</Text>
          <TouchableOpacity onPress={() => setPickerVisible(true)}>
            <View style={[styles.input, {justifyContent: 'center'}]}>
              {birthdate === '' ? (
                <Text style={{color: MEDIUM}}>Select Birthdate</Text>
              ) : (
                <Text style={{color: MEDIUM}}>{birthdate}</Text>
              )}
            </View>
          </TouchableOpacity>

          <BlackButton onPress={() => {}} label="Save" />

          <DatePickerModal
            visible={pickerVisible}
            hidePicker={() => setPickerVisible(false)}
            locale="en"
            onDateSelect={(value) => {
              setBirthdate(value);
              setPickerVisible(false);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(GCashAccount);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 20,
    height: 50,
    color: DARK,
  },
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },

  pickerContainerStyle: {
    height: 30,
    flex: 1,
  },
  pickerStyle: {
    backgroundColor: 'white',
    borderColor: MEDIUM,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  pickerDropDown: {
    backgroundColor: 'white',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: MEDIUM,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  pickerView: {
    backgroundColor: 'white',
    paddingTop: 20,
    borderRadius: 10,
  },
});
