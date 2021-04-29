import React from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {LIGHT, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';

const NotesForm = ({value, onChange}) => {
  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT_MEDIUM}}>Notes to Rider</Text>
      <View style={styles.spacing} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="ex. Fragile etc."
        placeholderTextColor={LIGHT}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(NotesForm);

const styles = StyleSheet.create({
  box: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: LIGHT,
    borderRadius: 5,
    fontSize: 14,
    paddingHorizontal: 10,
    fontFamily: FONT_REGULAR,
  },
  spacing: {height: 5},
});
