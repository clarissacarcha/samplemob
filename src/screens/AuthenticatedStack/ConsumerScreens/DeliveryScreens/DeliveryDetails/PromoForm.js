import React from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {LIGHT, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';

const PromoForm = ({value, onChange}) => {
  return (
    <View>
      <Text style={{fontFamily: FONT_MEDIUM}}>Promo Code</Text>
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

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(PromoForm);

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: LIGHT,
    borderRadius: 5,
    fontSize: 14,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: FONT_REGULAR,
  },
  spacing: {height: 5},
});
