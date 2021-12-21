import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, Image, Dimensions} from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";
import { useThrottle } from 'src/hooks';

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { VerifyContext } from "../VerifyContextProvider";
import { heart_fill_icon, heart_no_fill_icon, heart_selected_fill_icon } from "src/ToktokLoad/assets/icons";

//COMPONENTS
import { LoadingIndicator } from "src/ToktokLoad/components";

const { width, height } = Dimensions.get("screen");
export const LoadDetails = ({
  item,
  index,
  networkId,
  onPressFavorite,
  patchFavoriteLoading,
  postFavoriteLoading,
  loadFavorite
}) => {
  
  const { selectedLoad, setSelectedLoad, loads, setLoads } = useContext(VerifyContext);
  const { amount, name, favorite, descriptions } = item;

  const isSelected = selectedLoad[networkId]?.id == item.id;
  const colorAmount = isSelected ? "#fff" : "#F6841F";
  const colorDesc = isSelected ? "#fff" : "#707070";
  const numberOfLines = isSelected ? null : 1;

  const onPressThrottled = useThrottle(onPressFavorite, 500);

  const imgSelected = () => {
    if(favorite){
      return isSelected ? heart_selected_fill_icon : heart_fill_icon
    } else {
      return isSelected ? heart_no_fill_icon : heart_selected_fill_icon
    }
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if(isSelected){
          const {[networkId]: item, ...data} = selectedLoad;
          setSelectedLoad(data);
        } else {
          setSelectedLoad(prev => ({ ...prev, [networkId]: item }));
        }
      }}
      style={[
        styles.container,
        { backgroundColor: isSelected ? "rgba(246,132,31,0.8)" : "#fff"}
      ]}
    >
      <View style={[styles.amountContainer, { borderColor: colorAmount }]}>
        <Text style={[ styles.amount, { color: colorAmount }]}>₱{amount}</Text>
      </View>
      <View style={{ paddingHorizontal: moderateScale(20), flex: 1}}>
        <Text style={[ styles.loadName, { color: colorDesc }]}>{name}</Text>
        { !!descriptions && (
          <Text style={[ styles.descriptions, { color: colorDesc }]} numberOfLines={numberOfLines}>
            {descriptions}
          </Text>
        )}
      </View> 
      <View style={styles.heartIconContainer}>
        { (patchFavoriteLoading || postFavoriteLoading) && loadFavorite == item.id ? (
          <LoadingIndicator isLoading={true} size="small" />
        ) : (
          <TouchableOpacity
            onPress={onPressThrottled}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          >
            <Image source={imgSelected()} style={styles.heartIcon} />
          </TouchableOpacity>
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
    flex: 1,
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
})


