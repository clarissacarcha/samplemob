import React, {useRef, useEffect, useState} from 'react';
import {Text, View, TextInput, StyleSheet, Image} from 'react-native';
import BackgroundLanding from '../../../../assets/images/BackGroundLanding.png';
import CONSTANTS from '../../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const Location = ({
  onChange,
  inputRef,
  selectedInput,
  onChangeSelectedInput,
  titleOrigin,
  title,
  onChangeOrigin,
}) => {
  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE, paddingHorizontal: 16, marginBottom: 15}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={selectedInput == 'P' ? styles.containerInput : styles.textContainerInput}>
          <FA5Icon name="map-pin" size={18} color={CONSTANTS.COLOR.YELLOW} style={{marginLeft: 16}} />
          {selectedInput == 'P' ? (
            <TextInput
              ref={inputRef}
              onChangeText={value => onChangeOrigin(value)}
              style={styles.input}
              // placeholder={titleOrigin ? titleOrigin : pickUpValue}
              value={titleOrigin}
            />
          ) : (
            <TouchableOpacity onPress={() => onChangeSelectedInput('P')}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  paddingHorizontal: 10,
                }}>
                {titleOrigin}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 19}}>
        <View style={selectedInput == 'D' ? styles.containerInput : styles.textContainerInput}>
          <FA5Icon name="map-marker-alt" size={18} color={CONSTANTS.COLOR.ORANGE} style={{marginLeft: 16}} />
          {selectedInput == 'D' ? (
            <TextInput
              ref={inputRef}
              onChangeText={value => onChange(value)}
              style={styles.input}
              placeholder="Where to?"
              value={title}
            />
          ) : (
            <TouchableOpacity onPress={() => onChangeSelectedInput('D')}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  paddingHorizontal: 10,
                }}>
                {!title ? 'Where to?' : title}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    marginLeft: 12,
    color: CONSTANTS.COLOR.DARK,
    width: '100%',
  },
  containerInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  textContainerInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
});
