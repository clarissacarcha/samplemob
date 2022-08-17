import React, {useState} from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity} from 'react-native';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';

import {Price} from '../../../../../helpers';
import CustomIcon from '../../../../../Components/Icons';
import {coppermask, clothfacemask, voucherbg, placeholder} from '../../../../../assets';
import { FONT } from '../../../../../../res/variables';
import Animated, {interpolate, Extrapolate, useCode, set} from 'react-native-reanimated'

export const RenderVariations = ({data, navigate}) => {

  if(data.length == 0) return null

  const getImageSource = (imgs) => {
    if(typeof imgs == "object" && imgs.length > 0){
      return {uri: imgs[0].filename}
    }else {
      return placeholder
    }
  }

  const getVariationTypes = () => {
    return ""
    let res = ""
    if(!data || data.length == 0) return res
    data.map((item, i) => {
      res += `${item?.variantProducts.length} ${item?.variantType || ''}${i < data.length - 1 ? ", " : ""}`
    })
    return res
  }

  return (
    <>
      <View style={{paddingVertical: 8, paddingHorizontal: 8}}>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <View style={{flex: 2, flexDirection: 'row', paddingHorizontal: 8}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Select Variation </Text>
                </View>
                {/* <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={{fontSize: 14, color: "#9E9E9E"}}>({getVariationTypes()})</Text>
                </View> */}
              </View>
              <View style={{flex: 0, flexDirection: 'row-reverse'}}>
                <TouchableOpacity onPress={navigate} style={{flex: 0}}>
                  <CustomIcon.MCIcon name="chevron-right" size={24} color="#F6841F" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'column'}}>
            <View style={{paddingHorizontal: 8, flexDirection: 'row', paddingVertical: 8}}>        

              {data && data.length > 0 && data.map((item, index) => {
                if(index == 5){
                  return (
                    <>
                      <ImageBackground 
                        source={getImageSource(item.images)}
                        style={{marginRight: 4}}
                        imageStyle={{width: 48, height: 48, resizeMode: 'cover', borderColor: "#D7D7D7", borderRadius: 2, borderWidth: 1}}
                      >
                        <TouchableOpacity style={{width: 48, height: 48, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontSize: 9, textAlign: 'center', color: "#fff"}}>+{data?.length - index} more</Text>
                        </TouchableOpacity>
                      </ImageBackground>
                    </>
                  )
                }else if(index < 5){
                  return (
                    <>
                      <TouchableOpacity onPress = {navigate} style={{marginRight: 4}}>
                        <Image source={getImageSource(item.images)} style={{width: 48, height: 48, resizeMode: 'cover', borderColor: "#D7D7D7", borderRadius: 2, borderWidth: 1}} />
                      </TouchableOpacity>
                    </>
                  )
                }              
              })}

            </View>
            </View>
    
          </View>
          <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
    </>
  )
}