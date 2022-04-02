import React from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import constants from '../../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

export const NotesToDriver = ({dropDownRef}) => {
  return (
    <View>
      <View
        style={{
          backgroundColor: '#F8F8F8',
          flexDirection: 'row',
          textAlign: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}>
        <FA5Icon name="map-pin" size={18} color={constants.COLOR.YELLOW} style={{marginRight: 10}} />
        <Text>Bonifacio High Street - Central Square</Text>
      </View>
      <Text style={{fontSize: constants.FONT_SIZE.M, fontFamily: constants.FONT_FAMILY.BOLD, paddingVertical: 10}}>
        Notes to Driver
      </Text>
      <TextInput
        ref={dropDownRef}
        // value={description}
        placeholder="e.g. I have two luggage"
        keyboardType="default"
        // onChangeText={(value) => setDescription(value)}
        style={styles.Input}
        numberOfLines={5}
        multiline
      />
    </View>
  );
};
const styles = StyleSheet.create({
  Input: {
    height: 69,
    textAlignVertical: 'top',
    borderColor: '#EAEAEA',
    borderWidth: 1,
    fontSize: 11,
    padding: 8,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    width: '100%',
  },
});
