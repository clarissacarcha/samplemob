import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from "react-native";
import {VectorIcon, ICON_SET} from 'src/revamp';
//COMPONENTS
import { OrangeButton } from "src/ToktokLoad/components";
import { VerifyContext } from "../VerifyContextProvider";

//UTIL
import { moderateScale } from "toktokload/helper";

//FONTS & COLORS
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

//IMAGES
import { contact_icon } from "toktokload/assets/icons";
import { blank } from 'toktokload/assets/ads'

//SELF IMPORTS
import {Advertisement} from "../Advertisement";

import { NetworkListModal } from "../NetworkListModal";

export const LoadCategory = ({ navigation , activeCategory , activeTab }) => {
  const {
    mobileErrorMessage,
    setMobileErrorMessage,
    mobileNumber,
    setMobileNumber,
    setSubContainerStyle
  } = useContext(VerifyContext);
  const [visible,setVisible] = useState(false);
  const [activeNetwork,setActiveNetwork] = useState(null)

  useEffect(()=>{
    setActiveNetwork(null)
  },[activeTab])

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

  const ads = [{ id: 1, image: blank }]

  return (
    <View style={styles.container}>
      <NetworkListModal 
          visible={visible}
          setVisible={setVisible}
          activeNetwork={activeNetwork}
          setActiveNetwork={setActiveNetwork}
      />
      <View style={[styles.inputContainer , {flexDirection:"column"}]}>
        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>Select {activeCategory()?.name ? activeCategory().name : ""}</Text>
        <TouchableOpacity 
            style={{
                    backgroundColor: "#F8F8F8",
                    height: moderateScale(40),
                    borderRadius: moderateScale(5),
                    justifyContent: "center",
                    flexDirection:"row",
                    paddingHorizontal: moderateScale(10),
                    marginTop: 16
            }}
            onPress={()=>setVisible(true)}
        >
            <View style={{flex:1,justifyContent:'center'}}>
              {
                activeNetwork 
                ? <View style={{flexDirection:"row",alignItems:"center"}}>
                     <Image source={blank} style={styles.networkImage} resizeMode="contain"/>
                     <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S,marginLeft: 5}}>{activeNetwork.name}</Text>
                  </View>
                : <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Select {activeCategory()?.name ? activeCategory().name : ""}..</Text>
              }   
            </View>
            <View style={{justifyContent:"center",alignItems:"flex-end"}}>
                <VectorIcon size={15} iconSet={ICON_SET.Entypo} name="chevron-thin-down"/>
            </View>
        </TouchableOpacity>
      </View>
              {
                activeNetwork &&
                <>
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,marginTop: 16}}>Buy Load For</Text>
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
                </>
              }

            {mobileErrorMessage != "" && <Text style={styles.errorMessage}>{mobileErrorMessage}</Text>}
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Advertisement ads={ads}/>
              <View style={{marginTop: 20}}/>
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
  },
  networkImage: {
    height:  moderateScale(40),
    width:  moderateScale(40),
  }
})


