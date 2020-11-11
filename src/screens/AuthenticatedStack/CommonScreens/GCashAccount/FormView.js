import React from 'react';
import {View, Text, ScrollView, StyleSheet, TextInput} from 'react-native';

import {COLOR, DARK, MEDIUM} from '../../../../res/constants';

export default ({data, status}) => {
  const {mobileNumber, firstName, middleName, lastName, streetAddress, birthdate} = data;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.label}>Status</Text>
          <TextInput value={status} style={styles.input} editable={false} />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput value={mobileNumber} style={styles.input} editable={false} />

          <Text style={styles.label}>First Name</Text>
          <TextInput value={firstName} style={styles.input} editable={false} />

          <Text style={styles.label}>Middle Name (Optional)</Text>
          <TextInput value={middleName} style={styles.input} editable={false} />

          <Text style={styles.label}>Last Name</Text>
          <TextInput value={lastName} style={styles.input} editable={false} />

          <Text style={styles.label}>Street Address</Text>
          <TextInput value={streetAddress} style={styles.input} editable={false} />

          <Text style={styles.label}>Birthdate</Text>
          <TextInput value={birthdate} style={styles.input} editable={false} />
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
    color: MEDIUM,
  },
  header: {
    marginHorizontal: 20,
    // borderWidth: 1,
    borderColor: COLOR,
    borderRadius: 5,
    paddingLeft: 20,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    color: COLOR,
    fontFamily: 'Rubik-Medium',
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
