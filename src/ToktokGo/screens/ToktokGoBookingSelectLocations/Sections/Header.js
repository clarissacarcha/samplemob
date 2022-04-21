import React from 'react';
import {Image, View, StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ArrowLeft from '../../../../assets/icons/arrow-left-icon.png';

export const Header = ({navigation}) => {
  return (
    <View style={styles.headerBox}>
      <View style={styles.greetingBox}>
        <TouchableOpacity style={{paddingLeft: 10}} onPress={() => navigation.pop()}>
          <Image style={{height: 15, width: 10}} source={ArrowLeft} resizeMode={'contain'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerBox: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 16,
    shadowColor: '#000',
  },
  greetingBox: {
    backgroundColor: 'red',
    marginTop: StatusBar.currentHeight,
    marginLeft: 5,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: CONSTANTS.SIZE.MARGIN,
  },
  greetingText: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
});
