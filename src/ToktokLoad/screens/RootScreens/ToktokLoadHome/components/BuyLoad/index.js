import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from "react-native";

//COMPONENTS
import { OrangeButton } from "src/ToktokLoad/components";
import { VerifyContext } from "../VerifyContextProvider";

//UTIL
import { moderateScale } from "toktokload/helper";

//FONTS & COLORS
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

//IMAGES
import { contact_icon } from "toktokload/assets/icons";

export const BuyLoad = ({ navigation }) => {

  const {
    mobileErrorMessage,
    setMobileErrorMessage,
    mobileNumber,
    setMobileNumber,
    setSubContainerStyle
  } = useContext(VerifyContext);

  const onChangeText = (value) => {
    let mobile = value.replace(/[$-/:-?{-~!"#^_`\[\] ]/g, "");
  
    if(mobile.length != 0 && (mobile.substring(0, 2) != "09" || mobile.length != 11)){
      setMobileErrorMessage("Enter 11-digits valid mobile number");
    } else {
      setMobileErrorMessage("");
    }
  
    if((mobile.length == 1 || mobile.length == 2) && (mobileNumber.length == "" || mobileNumber.length == 1)){
      setMobileNumber("09")
    } else {
      setMobileNumber(mobile)
    }
  }

  const onPressNext = () => {
    navigation.navigate("ToktokLoadNetworks", { mobileNumber });
  }

  const onSelectContact = (number) => {
    onChangeText(number)
  }

  const onPressContacts = () => {
    navigation.navigate("ToktokLoadContacts",  { onSelectContact });
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.input} >
          <TextInput
            value={mobileNumber}
            onChangeText={onChangeText}
            placeholder="Enter 11-digits mobile number"
            keyboardType="number-pad"
            returnKeyType="done"
            maxLength={11}
          />
        </View>
        <TouchableOpacity
          onPress={onPressContacts}
          style={styles.contactsContainer}
        >
          <Image source={contact_icon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {mobileErrorMessage != "" && <Text style={styles.errorMessage}>{mobileErrorMessage}</Text>}
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <OrangeButton
          label="Next"
          disabled={!mobileNumber || mobileErrorMessage}
          onPress={onPressNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: moderateScale(16),
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: moderateScale(15)
  },
  input: {
    backgroundColor: "#F8F8F8",
    height: moderateScale(40),
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    justifyContent: "center",
    flex: 1,
  },
  contactsContainer: {
    backgroundColor: "#F6841F",
    padding: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(5),
    marginLeft: moderateScale(10)
  },
  errorMessage: {
    fontSize: FONT_SIZE.S,
    color:"#F93154",
    paddingVertical: moderateScale(10)
  },
  icon: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "contain"
  }
})


