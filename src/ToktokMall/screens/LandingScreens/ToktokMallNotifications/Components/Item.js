import React, { useState, useEffect } from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import CustomIcon from '../../../../Components/Icons'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import {placeholder} from '../../../../assets';
import {useNavigation} from "@react-navigation/native";

export const Item = ({active, data, onSelect}) => {

  const navigation = useNavigation()

  useEffect(() => {
    // console.log(data)
  }, [])

	const getImage = (raw) => {
		if(typeof raw == "object" && raw != null) return {uri: raw.filename}
		else return placeholder
	}

  const getDesc = (str, ref) => {

    if(typeof str != "string") return <Text style={{color: "#9E9E9E", fontSize: 12}}>Order {ref} has been confirmed. Kindly wait for your order to be processed.</Text>
    else{
      if(str.includes("&id")){
        return (
          <>
            <Text style={{fontSize: 11, color: "#9E9E9E"}}>
              {str.split("&id")[0]}
              <Text style={{color: "#F6841F", fontSize: 12}}>{ref}</Text> 
              {str.split("&id")[1]}
            </Text>
          </>
        )
      }else{
        return (
          <Text style={{fontSize: 11, color: "#9E9E9E"}}>{str}</Text>
        )
      }
    }
  }

  const getTitle = (history) => {
    if(history && history.length > 0){
      return history[history.length - 1].action
    }else{
      return "Confirmed Order"
    }
  }

  const getDate = (parent) => {
    if(parent.date) return parent.date
    else return "--- --- ----"
  }

  const getTime = (parent) => {
    if(parent.time) return parent.time
    else return "00:00 PM"
  }

  const getContent = (history) => {
    if(history && history.length > 0){
      return history[history.length - 1].description
    }else{
      return null
    }
  }

  return (
  	<>
      <TouchableOpacity 
        onPress={() => {
          onSelect()
          navigation.navigate("ToktokMallOrderDetails", data)
        }}
        style={{flexDirection: 'row', backgroundColor: data.read && data.read == 1 ? '#fff' : '#FFFCF4'}}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingHorizontal: 15}}>
          <Image 
            source={getImage(data?.product?.image)} 
            style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 5}}
          />
        </View>
        <View style={{flex: 8, paddingVertical: 20, paddingHorizontal: 0}}>
          <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>{getTitle(data?.history)}</Text>
          {getDesc(data?.parent?.description, data?.referenceNum)}
          {/* {getContent(data?.history)} */}
        </View>
        <View style={{flex: 2.5, paddingVertical: 20, paddingHorizontal: 15}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: "#9E9E9E", fontSize: 10}}>{getDate(data?.parent)}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: "#9E9E9E", fontSize: 10}}>{getTime(data?.parent)}</Text>
          </View>
          {/* <TouchableOpacity onPress={() => {
            if(clicks == 0 && !active){
              setClicks(clicks + 1)
            }
            onSelect()
          }} style={{justifyContent: 'center', alignItems: 'center'}}>
            <CustomIcon.FeIcon name="chevron-down" size={25} color="#9E9E9E" />
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
      <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
    </>
  )
}