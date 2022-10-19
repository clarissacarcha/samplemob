import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FIcon from 'react-native-vector-icons/Feather';

import CONSTANTS from 'common/res/constants';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const {height, width} = Dimensions.get('window');

const CROP_AREA_WIDTH = width * 0.45;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH - 60;
const ChooseImage = ({placement, setImage, index, hasError}) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.push('ToktokWalletValidIDCamera', {setImage, placement: placement});
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chooseImage, {alignItems: 'center', borderColor: hasError ? '#ED3A19' : COLOR.ORANGE}]}>
      <FIcon name="camera" color="#F6841F" size={20} />
      <Text style={styles.photoText}>Take a photo</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  photoText: {
    color: '#000000',
    marginTop: 5,
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.REGULAR,
  },
  chooseImage: {
    height: Platform.OS === 'ios' ? CROP_AREA_HEIGHT - 4 : CROP_AREA_HEIGHT - 5,
    width: Platform.OS === 'ios' ? CROP_AREA_WIDTH - 4 : CROP_AREA_WIDTH - 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 7,
    borderStyle: 'dashed',

    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#FEFAF6',
  },
});

export default ChooseImage;
