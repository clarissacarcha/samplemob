import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, Image} from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";
import { useContacts } from 'toktokload/hooks';

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { heart_fill_icon, heart_no_fill_icon, heart_selected_fill_icon } from "src/ToktokLoad/assets/icons";

const checkContact = (number) => {
  let mobileNumber = number.replace(/\s/g, '').replace(/[()]/g, '');
  return mobileNumber.replace("+63", "0");
};

const processName = (contacts, mobileNumber) => {
  if(contacts.length > 0){
    let contact = contacts.find((val) => { return checkContact(val.number) === mobileNumber })
    return contact?.name ? contact.name : ""
  }
}
export const FavoriteDetails = ({ item, index, setSelectedLoad, selectedLoad }) => {

  const { contacts } = useContacts();
  const { loadDetails, mobileNumber } = item;
  const { amount } = loadDetails;
  const isSelected = selectedLoad.id == item.id;
  const colorAmount = isSelected ? "#fff" : "#F6841F";
  const colorDesc = isSelected ? "#fff" : "#707070";
  const contactName = processName(contacts, mobileNumber);

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedLoad(isSelected ? {} : item);
      }}
      style={[
        styles.container,
        { backgroundColor: isSelected ? "rgba(246,132,31,0.8)" : "#fff"}
      ]}
    >
      <View style={[styles.amountContainer, { borderColor: colorAmount }]}>
        <Text style={[ styles.amount, { color: colorAmount }]}>₱{amount}</Text>
      </View>
      <View style={{ paddingHorizontal: moderateScale(20) }}>
        <Text style={[ styles.amount, { color: colorDesc }]}>PHP {amount}</Text>
        { !!contactName && <Text style={{ fontSize: FONT_SIZE.M, color: colorDesc }}>{contactName}</Text> }
        <Text style={{ fontSize: FONT_SIZE.M, color: colorDesc }}>{mobileNumber}</Text>
      </View> 
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
  amountContainer: {
    borderWidth: 1,
    borderRadius: moderateScale(100),
    paddingHorizontal: Platform.OS == "ios" ? moderateScale(10) : moderateScale(8),
    paddingVertical: Platform.OS == "ios" ? moderateScale(15) : moderateScale(10),
    justifyContent: "center",
    alignItems: "center"
  },
  amount: {
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


