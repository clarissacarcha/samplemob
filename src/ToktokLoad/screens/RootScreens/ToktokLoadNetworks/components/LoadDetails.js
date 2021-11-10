import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, Image} from "react-native";
//UTIL
import { moderateScale } from "toktokload/helper";
//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { VerifyContext } from "./VerifyContextProvider";
import { heart_fill_icon, heart_no_fill_icon, heart_selected_fill_icon } from "src/ToktokLoad/assets/icons";

export const LoadDetails = ({ item, index, network, onPressFavorite }) => {
  
  const { selectedLoad, setSelectedLoad, loads, setLoads } = useContext(VerifyContext);
  const { price, description, isFavorite } = item;

  const isSelected = selectedLoad[network]?.id == item.id;
  const colorPrice = isSelected ? "#fff" : "#F6841F";
  const colorDesc = isSelected ? "#fff" : "#707070";

  const imgSelected = () => {
    if(isFavorite){
      return isSelected ? heart_selected_fill_icon : heart_fill_icon
    } else {
      return isSelected ? heart_no_fill_icon : heart_selected_fill_icon
    }
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if(isSelected){
          const {[network]: item, ...data} = selectedLoad;
          setSelectedLoad(data);
        } else {
          setSelectedLoad(prev => ({ ...prev, [network]: item }));
        }
      }}
      style={[
        styles.container,
        { backgroundColor: isSelected ? "rgba(246,132,31,0.8)" : "#fff"}
      ]}
    >
      <View style={[styles.priceContainer, { borderColor: colorPrice }]}>
        <Text style={[ styles.price, { color: colorPrice }]}>₱{price}</Text>
      </View>
      <View style={{ paddingHorizontal: moderateScale(20) }}>
        <Text style={[ styles.price, { color: colorDesc }]}>PHP {price}</Text>
        <Text style={{ fontSize: FONT_SIZE.M, color: colorDesc }}>{description}</Text>
      </View> 
      <TouchableOpacity onPress={onPressFavorite} style={styles.heartIconContainer}>
        <Image
          source={imgSelected()}
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(15),
    flexDirection: "row",
    alignItems: "center"
  },
  priceContainer: {
    borderWidth: 1,
    borderRadius: moderateScale(100),
    paddingHorizontal: Platform.OS == "ios" ? moderateScale(10) : moderateScale(8),
    paddingVertical: Platform.OS == "ios" ? moderateScale(15) : moderateScale(10),
    justifyContent: "center",
    alignItems: "center"
  },
  price: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
    marginTop: Platform.OS == "ios" ? 0 : -2
  },
  heartIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "contain"
  },
  heartIconContainer: {
    flex: 1,
    alignItems: "flex-end"
  }
})


