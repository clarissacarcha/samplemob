import React from 'react'
import {View,Text,StyleSheet,Image,Platform ,StatusBar,TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'
import { HeaderBack, HeaderTitle } from '../Headers'
import { moderateScale, getStatusbarHeight } from 'toktokbills/helper'
import MIcon from 'react-native-vector-icons/MaterialIcons';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const Header = ({ label, elevation = 3, zIndex = 1 })=> {

  return (
    <View style={[ styles.header, { elevation, zIndex }]} >
      <HeaderBack />
      <Text style={styles.headerLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    paddingRight: 16,
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: 'row',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    paddingTop: Platform.OS == "ios" ? 0 : getStatusbarHeight,
    height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80),
    marginBottom: 1,
  },
  headerLabel: {
    flex: 1,
    color: COLOR.BLACK,
    textAlign: 'center',
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    marginRight: 15,
  },
})  