import React from 'react';
import {Text, TextInput, TouchableOpacity, View, StyleSheet} from 'react-native';
// import FIcon5 from 'react-native-vector-icons/FontAwesome5';

import {FONT_SIZE} from 'res/variables';

import {moderateScale} from 'toktokfood/helper/scale';

const StyledTextInput = ({
  onChangeText,
  onRemoveVoucher,
  label,
  value,
  error = null,
  hasIcon = false,
  placeholder = '',
}) => {
  const renderIcon = () => {
    // const iconColor = error ? '#F6841F' : '#06A44E';
    // const iconName = error ? 'times-circle' : 'check-circle';
    return (
      <TouchableOpacity onPress={onRemoveVoucher}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="characters"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={placeholder}
      />

      {hasIcon && renderIcon()}
    </View>
  );
};

export default StyledTextInput;

/* <FIcon5 name={iconName} size={17} color={iconColor} /> */

const styles = StyleSheet.create({
  container: {
    borderColor: '#E5EAEA',
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(8),
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    height: moderateScale(40),
    fontSize: FONT_SIZE.M,
  },
  removeText: {
    color: '#868686',
    marginHorizontal: 10,
  },
});
