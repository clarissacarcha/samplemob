import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, Image, Dimensions} from "react-native";

//COMPONENTS
import { VerifyContext } from "../../../VerifyContextProvider";

//UTIL
import { moderateScale } from "toktokload/helper";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { heart_fill_icon, heart_no_fill_icon, heart_selected_fill_icon } from "src/ToktokLoad/assets/icons";

const { width, height } = Dimensions.get("screen");
export const FavoriteDetails = ({ item, index, setSelectedLoad, selectedLoad }) => {

  const { setSubContainerStyle } = useContext(VerifyContext);
  const { loadDetails, mobileNumber } = item;
  const { amount } = loadDetails;
  const isSelected = selectedLoad.id == item.id;
  const colorAmount = isSelected ? "#fff" : "#F6841F";
  const colorDesc = isSelected ? "#fff" : "#707070";
  const numberOfLines = isSelected ? null : 1;

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedLoad(isSelected ? {} : item);
      }}
      style={[
        styles.container,
        { backgroundColor: isSelected ? "rgba(246,132,31,0.8)" : "#fff"}
      ]}
      activeOpacity={.8}
    >
      <View style={[styles.amountContainer, { borderColor: colorAmount }]}>
        <Text style={[ styles.amount, { color: colorAmount }]}>₱{amount}</Text>
      </View>
      <View style={{ paddingLeft: moderateScale(20), flex: 1 }}>
        <Text style={[ styles.loadName, { color: colorDesc }]}>{loadDetails.name}</Text>
        <Text style={[ styles.descriptions, { color: colorDesc }]}>
          {loadDetails.networkDetails.name}
        </Text>
        { !!loadDetails.descriptions && (
          <Text style={[ styles.descriptions, { color: colorDesc }]} numberOfLines={numberOfLines}>
            {loadDetails.descriptions}
          </Text>
        )}
      </View> 
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(15),
    flexDirection: "row",
    alignItems: "center",
  },
  amountContainer: {
    borderWidth: 1,
    borderRadius: moderateScale(100),
    height: (height * .06) + FONT_SIZE.L,
    width: (height * .06) + FONT_SIZE.L,
    justifyContent: "center",
    alignItems: "center",
  },
  amount: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
    marginTop: Platform.OS == "ios" ? 0 : -2,
    textAlign: "center",
  },
  heartIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "contain"
  },
  heartIconContainer: {
    flex: 1,
    alignItems: "flex-end"
  },
  loadName: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  descriptions: {
    fontSize: FONT_SIZE.M,
    marginTop: 5
  }
});
