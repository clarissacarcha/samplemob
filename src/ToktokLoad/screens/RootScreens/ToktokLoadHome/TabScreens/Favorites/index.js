import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs} from "src/ToktokLoad/components";
import { FavoriteList, VerifyContextProvider, VerifyContext } from "./components";

//FONTS & COLORS
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

const MainComponent = ({ navigation, route }) => {
 
  const { selectedLoad, setSelectedLoad } = useContext(VerifyContext);
  
  return (
    <View style={styles.container}>
      <FavoriteList navigation={navigation} />
    </View>
  );
};

export const Favorites = ({ navigation, route }) => {

  return (
    <VerifyContextProvider>
      <MainComponent navigation={navigation} route={route} />
    </VerifyContextProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    alignItems: "center",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10)
  },
  headerText: {
    color: "#707070",
    fontSize: FONT_SIZE.M
  },
  mobileNo: {
    fontSize: 20
  }
})


