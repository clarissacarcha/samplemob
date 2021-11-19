import React, { useState, useEffect } from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import CustomIcon from '../../../../Components/Icons'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import {placeholder} from '../../../../assets';
import {useNavigation} from "@react-navigation/native";

export const Item = ({active, data, onSelect}) => {

  const navigation = useNavigation()
  const [orderStatus, setOrderStatus] = useState({})

  useEffect(() => {
    if(data){
      setOrderStatus(data.orderStatusLatest)
    }
  }, [data])

	const getImage = (raw) => {

		if(typeof raw == "object" && raw != null){
      if(raw.length > 0){
        return {uri: raw[0].filename}
      }else{
        return placeholder
      }
    }else {
      return placeholder
    }
	}

  return (
  	<>
      <TouchableOpacity 
        onPress={() => {          
          navigation.push("ToktokMallOrderDetails", {...data, onBack: onSelect})
        }}
        style={{flexDirection: 'row', backgroundColor: data.read && data.read == 1 ? '#fff' : '#FFFCF4'}}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingHorizontal: 15}}>
          <Image 
            source={getImage(data?.images)} 
            style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 5}}
          />
        </View>
        <View style={{flex: 8, paddingVertical: 20, paddingHorizontal: 0}}>
          <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>{orderStatus?.content?.title}</Text>
          <Text style={{fontSize: 11, color: "#9E9E9E"}}>{orderStatus?.content?.description}</Text>
        </View>
        <View style={{flex: 2.5, paddingVertical: 20, paddingHorizontal: 15}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: "#9E9E9E", fontSize: 10}}>{orderStatus?.content?.formatDate}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: "#9E9E9E", fontSize: 10}}>{orderStatus?.content?.formatTime}</Text>
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