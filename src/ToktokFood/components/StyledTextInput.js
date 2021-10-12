import React from 'react';
import {TextInput, View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import ContentLoader from 'react-native-easy-content-loader';

import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {markerIcon} from 'toktokfood/assets/images';

import {getStatusbarHeight, verticalScale, moderateScale, getDeviceWidth} from 'toktokfood/helper/scale';

const StyledTextInput = ({onChangeText, label, value, error = true}) => {
  const renderIcon = () => {
    const iconColor = error ? '#F6841F' : '#06A44E';
    const iconName = error ? 'times-circle' : 'check-circle';

    return <FIcon5 name={iconName} size={17} color={iconColor} />;
  };

  return (
    <View style={styles.container}>
      <TextInput value={value} onChangeText={onChangeText} style={styles.input} placeholder={label} />

      {renderIcon()}
    </View>
  );
};

export default StyledTextInput;

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
    // marginHorizontal: 10,
    // borderWidth: 1,
    // borderColor: '#E5EAEA',
    // borderRadius: 5,
    paddingLeft: 10,
    height: moderateScale(40),
    // color: DARK,
    fontSize: FONT_SIZE.M,
  },
});
