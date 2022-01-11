import React from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {LIGHT, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT} from '../../../../../res/variables';

const NotesForm = ({value, onChange}) => {
  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT.BOLD}}>Notes to Rider</Text>
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

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(NotesForm);

const styles = StyleSheet.create({
  box: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: COLOR.LIGHT,
  },
  spacing: {height: 2},
});
