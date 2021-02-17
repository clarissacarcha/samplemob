import React, {useState} from 'react';
import {Alert, View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import validator from 'validator';

import {DARK, MEDIUM} from '../../../../res/constants';
import {BlackButton} from '../../../../components/ui/BlackButton';

import DatePickerModal from './DatePickerModal';

export default ({onSubmit, status}) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  const [mobileNumber, setMobileNumber] = useState('');
  const [firstName, setfirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setlastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const onPress = () => {
    if (validator.isEmpty(mobileNumber, {ignore_whitespace: true})) {
      Alert.alert('', 'Please enter mobile number.');
      return;
    }

    if (validator.isEmpty(firstName, {ignore_whitespace: true})) {
      Alert.alert('', 'Please enter first name.');
      return;
    }

    if (validator.isEmpty(lastName, {ignore_whitespace: true})) {
      Alert.alert('', 'Please enter last name.');
      return;
    }

    if (validator.isEmpty(streetAddress, {ignore_whitespace: true})) {
      Alert.alert('', 'Please enter street address.');
      return;
    }

    if (validator.isEmpty(birthdate, {ignore_whitespace: true})) {
      Alert.alert('', 'Please select birthdate.');
      return;
    }

    onSubmit({
      mobileNumber,
      firstName,
      middleName,
      lastName,
      streetAddress,
      birthdate,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {status && (
            <>
              <Text style={styles.label}>Status</Text>
              <TextInput value={status} style={styles.input} editable={false} />
            </>
          )}

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            value={mobileNumber}
            onChangeText={(value) => setMobileNumber(value)}
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="numeric"
            returnKeyType="done"
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
            returnKeyType="done"
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
            returnKeyType="done"
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
            returnKeyType="done"
            placeholderTextColor={MEDIUM}
          />

          <Text style={styles.label}>Birthdate</Text>
          <TouchableOpacity onPress={() => setPickerVisible(true)}>
            <View style={styles.birthdate}>
              {birthdate === '' ? (
                <Text style={{color: MEDIUM}}>Select Birthdate</Text>
              ) : (
                <Text style={{color: MEDIUM}}>{birthdate}</Text>
              )}
            </View>
          </TouchableOpacity>

          <BlackButton onPress={onPress} label="Save" />

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
  birthdate: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 20,
    height: 50,
    color: DARK,
    justifyContent: 'center',
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
});
