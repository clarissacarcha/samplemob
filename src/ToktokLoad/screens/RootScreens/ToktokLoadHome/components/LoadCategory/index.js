import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from "react-native";
import {VectorIcon, ICON_SET} from 'src/revamp';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_LOAD_CATEGORIES , GET_LOAD_CATEGORY_NETWORKS } from 'toktokload/graphql';
import { useLazyQuery } from '@apollo/react-hooks'
import { usePrompt } from 'src/hooks'
import { ErrorUtility } from 'toktokload/util';
import { useSelector } from 'react-redux'

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
    setSubContainerStyle,
    adHighlight
  } = useContext(VerifyContext);
  const [visible,setVisible] = useState(false);
  const [activeNetwork,setActiveNetwork] = useState(null)
  const [networks,setNetworks] = useState([])
  const prompt = usePrompt();
  const { user } = useSelector((state) => state.session);
  const formattedMobile = user?.username.replace("+63", "0");


  const [getLoadCategoryNetworks, {loading}] = useLazyQuery(GET_LOAD_CATEGORY_NETWORKS, {
    fetchPolicy:"network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
    onCompleted: ({getLoadCategoryNetworks})=> {
      setNetworks(getLoadCategoryNetworks)
    }
  })

  useEffect(()=>{
    setActiveNetwork(null)
  },[activeTab])

  useEffect(()=>{
    setMobileErrorMessage("")
    if(activeCategory()?.name == "Telco") setMobileNumber(formattedMobile)
  },[activeNetwork])

  const onChangeText = (value) => {
    
    let mobile = value.replace(/[$-/:-?{-~!"#^_`\[\] ]/g, "");
    if(activeCategory()?.name == "Telco"){
        if(mobile.length != 0 && (mobile.substring(0, 2) != "09" || mobile.length != 11)){
          setMobileErrorMessage(`Enter ${activeNetwork?.inputLength?.inputLength}-digits valid ${activeNetwork?.inputLength?.name}`);
        } else {
          setMobileErrorMessage("");
        }
      
        if((mobile.length == 1 || mobile.length == 2) && (mobileNumber.length == "" || mobileNumber.length == 1)){
          setMobileNumber("09")
        } else {
          setMobileNumber(mobile)
        }
        return
    }

    if(mobile.length != activeNetwork?.inputLength?.inputLength){
      setMobileErrorMessage(`Enter ${activeNetwork?.inputLength?.inputLength}-digits valid ${activeNetwork?.inputLength?.name}`);
    }else{
      setMobileErrorMessage("")
    }
    setMobileNumber(mobile)

    return
  }

  const onPressNext = () => {
    navigation.navigate("ToktokLoadNetworks", { mobileNumber , network: activeNetwork });
  }

  const onSelectContact = (number) => {
    onChangeText(number)
  }

  const onPressContacts = () => {
    navigation.navigate("ToktokLoadContacts",  { onSelectContact });
  }

  const openNetworks = ()=> {
    getLoadCategoryNetworks({
      variables: {
        input: {
          loadCategoryId: activeTab
        }
      }
    })
    setVisible(true)
  }

  const ads = [{ id: 1, image: blank }]

  return (
    <View style={styles.container}>
      <NetworkListModal 
          visible={visible}
          setVisible={setVisible}
          activeNetwork={activeNetwork}
          setActiveNetwork={setActiveNetwork}
          loading={loading}
          data={networks}
          activeCategory={activeCategory()?.name}
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
            onPress={openNetworks}
        >
            <View style={{flex:1,justifyContent:'center'}}>
              {
                activeNetwork 
                ? <View style={{flexDirection:"row",alignItems:"center"}}>
                     <Image source={{uri: activeNetwork.iconUrl}} style={styles.networkImage} resizeMode="contain"/>
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
                          placeholder={`${activeNetwork.inputLength.fieldPlaceholder}`}
                          keyboardType={activeNetwork.inputLength.fieldFormat == 2 ? "default" : "number-pad"}
                          returnKeyType="done"
                          maxLength={+activeNetwork?.inputLength?.inputLength}
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
              { adHighlight.length > 0 && <Advertisement ads={adHighlight}/> }
              <View style={{marginTop: 20}}/>
              <OrangeButton
                label="Next"
                disabled={!mobileNumber || mobileErrorMessage || !activeNetwork}
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
    height:  moderateScale(20),
    width:  moderateScale(20),
  }
})


