import React from 'react';
import {Text, View, StatusBar, StyleSheet, Image, TouchableOpacity, Platform} from 'react-native';
import ToktokgoIcon from '../../../../assets/images/ToktokgoLandingIcon.png';
import CONSTANTS from '../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ArrowLeft from '../../../../assets/icons/arrow-left-icon.png';

export const Header = ({navigation, constants}) => {
  return (
    <View style={styles.headerBox}>
      <View style={{marginTop: StatusBar.currentHeight, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={{paddingLeft: 18}} onPress={() => navigation.pop()}>
          <Image style={{height: 15, width: 10}} source={ArrowLeft} resizeMode={'contain'} />
        </TouchableOpacity>
        <View style={styles.greetingBox}>
          <Image source={ToktokgoIcon} resizeMode={'contain'} style={{height: 25, width: 87}} />
        </View>
        {constants.iosVersionDisableBeta && Platform.OS == 'ios' ? (
          <></>
        ) : (
          <Text style={{fontSize: CONSTANTS.FONT_SIZE.XS - 1, color: CONSTANTS.COLOR.ORANGE}}>BETA</Text>
        )}
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  greetingBox: {
    // marginTop: StatusBar.currentHeight,
    // justifyContent: 'center',
    // alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: CONSTANTS.SIZE.MARGIN,
    flexDirection: 'row',
    marginLeft: '30%',
  },
  greetingText: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
});
