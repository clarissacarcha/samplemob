import React from 'react';
import {Text, View, StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../common/res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';

export const Header = ({navigation, title}) => {
  return (
    <View style={styles.headerBox}>
      <View style={styles.greetingBox}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Text>
            <MIcon name={'keyboard-arrow-left'} size={25} color={CONSTANTS.COLOR.ORANGE} />
          </Text>
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center', marginRight: 30}}>
          <Text style={styles.greetingText}>{title}</Text>
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
    marginBottom: 14,
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
