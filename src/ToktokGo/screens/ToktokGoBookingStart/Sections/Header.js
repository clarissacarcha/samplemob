import React from 'react';
import {Text, View, StatusBar, StyleSheet, Image, TouchableOpacity} from 'react-native';
import ToktokgoIcon from '../../../../assets/images/ToktokgoLandingIcon.png';
import CONSTANTS from '../../../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';

export const Header = ({navigation}) => {
  return (
    <View style={styles.headerBox}>
      <View style={{marginTop: StatusBar.currentHeight, flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Text>
            <MIcon name={'keyboard-arrow-left'} size={25} color={CONSTANTS.COLOR.ORANGE} />
          </Text>
        </TouchableOpacity>
        <View style={styles.greetingBox}>
          <Image source={ToktokgoIcon} resizeMode={'contain'} style={{height: 25, width: 87, marginLeft: '40%'}} />
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: CONSTANTS.SIZE.MARGIN,
    flexDirection: 'row',
  },
  greetingText: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
});
