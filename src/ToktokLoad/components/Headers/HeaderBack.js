import React from "react";
import {StyleSheet, View, TouchableOpacity,Text } from "react-native";
import {useNavigation} from "@react-navigation/native";
import {throttle} from "lodash";
import { COLOR, FONT } from "src/res/variables"; 
import { moderateScale } from "toktokload/helper";
import {VectorIcon, ICON_SET} from 'src/revamp';

export const HeaderBack = ({onBack , color = "#F6841F" , label, isThinBack =  false}) => {
  const navigation = useNavigation();

  const onPress = throttle(
    () => {
      if (onBack) {
        onBack();
      } else {
        navigation.pop();
      }
    },
    1000,
    {trailing: false},
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.backContainer}>
      { isThinBack ? (
        <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-thin-left" color={color} size={moderateScale(16)}/>
      ) : (
        <VectorIcon iconSet={ICON_SET.FontAwesome5} name="chevron-left" color={color} size={moderateScale(16)}/>
      )}
       <Text style={{fontFamily: FONT.BOLD,fontSize: moderateScale(14),marginLeft: 5}}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  backContainer: {
    paddingHorizontal: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  }
});
