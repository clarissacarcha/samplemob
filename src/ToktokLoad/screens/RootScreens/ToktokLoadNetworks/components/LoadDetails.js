import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, Image} from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";
import { useThrottle } from 'src/hooks';

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { VerifyContext } from "./VerifyContextProvider";
import { heart_fill_icon, heart_no_fill_icon, heart_selected_fill_icon } from "src/ToktokLoad/assets/icons";

//COMPONENTS
import { LoadingIndicator } from "src/ToktokLoad/components";
export const LoadDetails = ({ item, index, networkId, onPressFavorite, patchFavoriteLoading, postFavoriteLoading }) => {
  
  const { selectedLoad, setSelectedLoad, loads, setLoads } = useContext(VerifyContext);
  const { amount, name, favorite } = item;

  const isSelected = selectedLoad[networkId]?.id == item.id;
  const colorAmount = isSelected ? "#fff" : "#F6841F";
  const colorDesc = isSelected ? "#fff" : "#707070";

  const onPressThrottled = useThrottle(onPressFavorite, 1000);

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
      <View style={{ paddingHorizontal: moderateScale(20) }}>
        <Text style={[ styles.amount, { color: colorDesc }]}>PHP {amount}</Text>
        <Text style={[ styles.loadName, { color: colorDesc }]}>{name}</Text>
      </View> 
      <View style={styles.heartIconContainer}>
        { patchFavoriteLoading || postFavoriteLoading ? (
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
  },
  loadName: {
    fontSize: FONT_SIZE.M,
    marginTop: 5
  }
})


