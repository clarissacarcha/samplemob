import React, {useRef, useEffect, useState} from 'react';
import {Text, View, TextInput, StyleSheet, Image, ActivityIndicator} from 'react-native';
import ClearTextInput from '../../../../assets/icons/EraseTextInput.png';
import CONSTANTS from '../../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DestinationIcon from '../../../../assets/icons/DestinationIcon.png';
import {isEmpty} from 'lodash';
import {ThrottledOpacity} from '../../../../components_section';
import {useDispatch} from 'react-redux';
export const Location = ({
  onChange,
  inputRef,
  selectedInput,
  onChangeSelectedInput,
  titleOrigin,
  title,
  onChangeOrigin,
  setSearchDestination,
  setSearchOrigin,
  loading,
}) => {
  const dispatch = useDispatch();

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
              placeholder={!titleOrigin ? 'Type your pick-up location' : titleOrigin}
              value={titleOrigin}
            />
          ) : (
            <ThrottledOpacity delay={500} onPress={() => onChangeSelectedInput('P')}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  paddingHorizontal: 10,
                }}>
                {!titleOrigin ? 'Type your pick-up location' : titleOrigin}
              </Text>
            </ThrottledOpacity>
          )}
          {loading && selectedInput == 'P' ? (
            <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
          ) : (
            !isEmpty(titleOrigin) &&
            selectedInput == 'P' && (
              <ThrottledOpacity
                delay={500}
                onPress={() => {
                  setSearchOrigin(null);
                  dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: null});
                }}>
                <Image source={ClearTextInput} style={{height: 10, width: 10}} resizeMode={'contain'} />
              </ThrottledOpacity>
            )
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 19}}>
        <View style={selectedInput == 'D' ? styles.containerInput : styles.textContainerInput}>
          {/* <FA5Icon name="map-marker-alt" size={18} color={CONSTANTS.COLOR.ORANGE} style={{marginLeft: 16}} /> */}
          <Image source={DestinationIcon} style={{height: 20, width: 20, marginLeft: 12}} resizeMode={'contain'} />
          {selectedInput == 'D' ? (
            <TextInput
              ref={inputRef}
              onChangeText={value => onChange(value)}
              style={styles.input}
              placeholder="Where to?"
              value={title}
            />
          ) : (
            <ThrottledOpacity delay={500} onPress={() => onChangeSelectedInput('D')}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  paddingHorizontal: 10,
                }}>
                {!title ? 'Where to?' : title}
              </Text>
            </ThrottledOpacity>
          )}
          {loading && selectedInput == 'D' ? (
            <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
          ) : (
            !isEmpty(title) &&
            selectedInput == 'D' && (
              <ThrottledOpacity
                delay={500}
                onPress={() => {
                  setSearchDestination(null);
                  dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: null});
                }}>
                <Image source={ClearTextInput} style={{height: 10, width: 10}} resizeMode={'contain'} />
              </ThrottledOpacity>
            )
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    marginLeft: 12,
    color: CONSTANTS.COLOR.BLACK,
    width: '80%',
    paddingVertical: 12,
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
