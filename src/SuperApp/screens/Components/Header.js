import React from 'react';
import {Text, View, StatusBar, StyleSheet, TouchableOpacity, Image} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';

export const Header = ({navigation, title}) => {
  return (
    <View style={styles.headerBox}>
      <View style={styles.greetingBox}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center', marginRight: 30}}>
          <Text style={styles.greetingText}>{title}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  iconDimensions: {
    width: 10,
    height: 15,
    marginLeft: 16,
  },
  headerBox: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  greetingBox: {
    flexDirection: 'row',
    marginTop: StatusBar.currentHeight,
    marginLeft: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: CONSTANTS.SIZE.MARGIN,
  },
  greetingText: {
    color: CONSTANTS.COLOR.BLACK,
    fontSize: CONSTANTS.FONT_SIZE.XL + 1,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
  },
});
