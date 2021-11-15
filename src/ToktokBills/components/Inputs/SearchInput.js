import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Platform,FlatList,ActivityIndicator,Image} from 'react-native'
import { sortBy } from 'lodash'
import { Separator } from 'toktokbills/components'
import { search_ic } from 'toktokbills/assets/icons'
import { HeaderBack , HeaderTitle } from 'src/revamp'
import { moderateScale } from 'toktokbills/helper'

import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE , MARGIN } = CONSTANTS

export const SearchInput = ({search = "", setSearch}) => {

  const filterSearch = (val) => {
    setSearch(val);
  }

  return (
    <View style={styles.searchField}>
      <View style={[styles.inputContainer,{flexDirection: "row"}]}>
        <Image style={styles.icon} resizeMode="center" source={search_ic}/>
        <TextInput 
          style={styles.input}
          placeholder="Search cable/internet provider"
          onChangeText={filterSearch}
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
    backgroundColor:"white",
  },
  contactlist: {
    flex: 1,
    padding: MARGIN.M,
  },
  inputContainer: {
    paddingHorizontal: 5,
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
    marginLeft: 5,
    alignSelf: "center",
    flex: 1
  },
  icon: {
    height: moderateScale(25),
    width: moderateScale(40),
    alignSelf: "center",
    tintColor: "#F6841F"
  }
})
