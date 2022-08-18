import React from 'react';
import {View, TouchableOpacity, Text, Dimensions, Platform, StyleSheet, Image} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'toktokwallet/helper';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const {height, width} = Dimensions.get('window');

const CROP_AREA_WIDTH = width * 0.45;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH - 60;

const ImageIDSet = ({validID, placement, setImage, index}) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.push('ToktokWalletValidIDCamera', {setImage, placement: placement, checkTimeout: true});
  };

  return (
    <>
      {/* <Text>{JSON.stringify(validID)}</Text>
        <Text>{placement}</Text>
        <Text>{index}</Text> */}
      <View style={[styles.chooseImage]}>
        <Image
          resizeMode="cover"
          style={{
            height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT - 6 : CROP_AREA_HEIGHT - 10,
            width: Platform.OS === 'ios' ? CROP_AREA_WIDTH - 6 : CROP_AREA_WIDTH - 13,
            borderRadius: 5,
          }}
          source={{uri: placement == 'front' ? validID.frontFilename : validID.backFilename}}
        />
        <TouchableOpacity onPress={onPress} style={styles.changePhoto}>
          <FIcon name="camera" color="#F6841F" size={25} />
          <Text style={styles.changeText}>Change Photo</Text>
        </TouchableOpacity>
        <View style={styles.overlay} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chooseImage: {
    height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT - 4 : CROP_AREA_HEIGHT - 5,
    width: Platform.OS === 'ios' ? CROP_AREA_WIDTH - 4 : CROP_AREA_WIDTH - 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 7,
    borderStyle: 'dashed',
    borderColor: COLOR.ORANGE,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  chooseImageText: {
    color: COLOR.YELLOW,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    marginTop: -2,
  },
  changePhoto: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  changeText: {
    color: COLOR.WHITE,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    marginTop: moderateScale(5),
  },
  overlay: {
    backgroundColor: 'black',
    opacity: 0.3,
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
});

export default ImageIDSet;
