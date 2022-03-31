import React, {useRef, useEffect, useState} from 'react';
import {Text, View, TextInput, StyleSheet, Image} from 'react-native';
import BackgroundLanding from '../../../../assets/images/BackGroundLanding.png';
import CONSTANTS from '../../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

export const Location = ({onChange, inputRef}) => {
  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE}}>
      <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, paddingBottom: 20}}>
        <FA5Icon name="map-pin" size={18} color={CONSTANTS.COLOR.YELLOW} style={{marginLeft: 2}} />
        <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, paddingHorizontal: 10}}>
          Inoza Tower, 40th Street, Bonifacio Global City
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.containerInput}>
          <FA5Icon
            name="map-marker-alt"
            size={20}
            color={CONSTANTS.COLOR.ORANGE}
            style={{padding: 10, marginLeft: 10}}
          />

          <TextInput
            ref={inputRef}
            onChangeText={value => onChange(value)}
            style={styles.input}
            placeholder="Where to?"
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    paddingLeft: 5,
    height: 50,
    color: CONSTANTS.COLOR.DARK,
    borderColor: '#F8F8F8',
    width: '88%',
  },
  containerInput: {
    marginHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#F8F8F8',
    borderColor: '#F8F8F8',
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
});
