import React from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {LIGHT, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';

const ItemsToPurchaseForm = ({value, onChange}) => {
  return (
    <View>
      <Text style={{fontFamily: FONT.BOLD}}>Promo Code</Text>
      <View style={styles.spacing} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="ex. TOKTOK2020"
        placeholderTextColor={LIGHT}
      />
    </View>
  );
};

export default ItemsToPurchaseForm;

const styles = StyleSheet.create({
  input: {
    height: 50,
    backgroundColor: '#f7f7fa',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  spacing: {height: 2},
});
