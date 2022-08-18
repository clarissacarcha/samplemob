import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Image, Dimensions, Platform} from 'react-native';
import {VectorIcon, ICON_SET} from 'src/revamp';
import {useThrottle} from 'src/hooks';
import {upload_icon} from 'toktokwallet/assets';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

const {width} = Dimensions.get('screen');
const CROP_AREA_WIDTH = width * 0.45;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH - 60;

const Form = ({item, index, onPress, onPressRemove}) => {
  const onPressThrottled = useThrottle(() => onPress(index), 1000);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.formName}>{item.name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
          <TouchableOpacity
            onPress={onPressThrottled}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderStyle: 'dashed',
              borderColor: item.errorMessage !== '' ? '#ED3A19' : COLOR.ORANGE,
              borderWidth: 1,
              borderRadius: 5,
              marginBottom: 5,
              paddingHorizontal: 20,
              paddingVertical: 20,
              backgroundColor: '#FEFAF6',
              height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT - 4 : CROP_AREA_HEIGHT - 5,
              width: Platform.OS === 'ios' ? CROP_AREA_WIDTH - 4 : CROP_AREA_WIDTH - 10,
            }}>
            <Image source={upload_icon} style={{width: 25, height: 25, resizeMode: 'contain'}} />
            <Text style={styles.uploadText}>Upload a file</Text>
            <Text style={styles.supportFile}>Supports JPG, JPEG, PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
      {item.errorMessage !== '' && <Text style={styles.errorMessage}>{item.errorMessage}</Text>}
      {item.filename !== '' && (
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={styles.filename}>
            <Text style={styles.filenameText}>{item.filename}</Text>
            <TouchableHighlight
              hitSlop={{top: 40, right: 40, bottom: 40, left: 40}}
              onPress={() => {
                onPressRemove(index);
              }}
              underlayColor={'transparent'}>
              <VectorIcon color={'#9E9E9E'} size={15} iconSet={ICON_SET.AntDesign} name="close" />
            </TouchableHighlight>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  formName: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    textAlign: 'left',
  },
  uploadText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
  },
  supportFile: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#525252',
    marginTop: 5,
  },
  filename: {
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  filenameText: {
    marginRight: 10,
    color: '#525252',
  },
  errorMessage: {
    marginHorizontal: 16,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#ED3A19',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLOR.LIGHT,
    marginHorizontal: 16,
  },
});

export default Form;
