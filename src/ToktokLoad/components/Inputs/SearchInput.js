import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Platform,FlatList,ActivityIndicator,Image} from 'react-native'
import { sortBy } from 'lodash'
import { Separator } from 'toktokbills/components'
import { search_ic } from 'toktokbills/assets/icons'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import { moderateScale } from 'toktokbills/helper'

import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE , MARGIN } = CONSTANTS

export const SearchInput = ({search = "", onChangeText, placeholder, containerStyle }) => {

  return (
    <View style={[ styles.searchField, containerStyle ]}>
      <View style={[ styles.inputContainer, {flexDirection: "row"} ]}>
        <Image style={styles.icon} resizeMode="contain" source={search_ic}/>
        <TextInput 
          style={styles.input}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={search}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  searchField: {
    zIndex: 1,
    backgroundColor:"white",
  },
  contactlist: {
    flex: 1,
    padding: MARGIN.M,
  },
  inputContainer: {
    paddingHorizontal: moderateScale(15),
    height: SIZE.FORM_HEIGHT,
    fontSize: FONT_SIZE.M,
    borderRadius: 5,
    backgroundColor:"#F7F7FA",
    fontFamily: FONT.REGULAR
  },
  input: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    padding: 0,
    marginLeft: moderateScale(10),
    alignSelf: "center",
    flex: 1
  },
  icon: {
    height: moderateScale(20),
    width: moderateScale(20),
    alignSelf: "center",
    tintColor: "#F6841F"
  }
})
