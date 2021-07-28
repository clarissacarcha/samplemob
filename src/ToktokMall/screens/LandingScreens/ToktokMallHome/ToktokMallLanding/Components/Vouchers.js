import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import { COLOR, FONT } from '../../../../../../res/variables';
import { useNavigation } from '@react-navigation/core';
import CustomIcon from '../../../../../Components/Icons';

const testdata = [{
  type: "FREE SHIPPING",
  label: "Free Shipping Voucher",
  description: "Valid until: 5.14.2021"
}, {
  type: "20% OFF",
  label: "20% Off on all items",
  description: "Valid until: 5.25.2021"
}, {
  type: "40% OFF",
  label: "40% Off in Copper Mask Store",
  description: "Valid until: 5.25.2021"
}]


const Item = ({data}) => {
    return (
        <>
          <View style={{flex: 0.5, height: 2, backgroundColor: '#F7F7FA'}} />  
          <View style={{paddingVertical: 15, paddingHorizontal: 15, flexDirection: 'row'}}>
            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{height: 50, width: 50, backgroundColor: '#FCC442', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 5}}>
               <Text style={{textAlign: 'center', fontSize: 9, fontWeight: '600', color: "#fff", textTransform: 'uppercase'}}>{data.type}</Text> 
              </View>
            </View>
            <View style={{flex: 8, justifyContent: 'center'}}>
              <Text>{data.label}</Text>
              <Text style={{color: "#9E9E9E", fontSize: 11}}>{data.description}</Text>
            </View>
          </View>
        </>
    )
}

export const Vouchers = () => {

  const navigation = useNavigation();

    return (
        <>
          <View style={{flex: 1, paddingHorizontal: 15, paddingVertical: 0}}>
          <View style={{paddingVertical: 20, flexDirection: 'row'}}>
            <View style={{flex: 3}}>
              <ImageBackground 
                source={require("../../../../../../assets/toktokmall-assets/images/voucher-fill.png")} 
                style={{width: "100%", alignItems: 'center', justifyContent: 'center'}} 
                imageStyle={{resizeMode: 'cover'}}
              >
                <Text style={{color: "#fff", fontSize: 14}}>Vouchers</Text>
              </ImageBackground>
            </View>
            <View style={{flex: 6}}></View>
            <TouchableOpacity onPress={() => {
              navigation.navigate("ToktokMallVouchersClaim")
            }} style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{fontSize: 12, color: "#F6841F"}}>See all </Text>
            </TouchableOpacity>
            <View style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}>
              <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
            </View>
          </View>
        </View>
        <View>
          {testdata && testdata.map((item, i) => <Item data={item} />)}
        </View>
        <View style={{flex: 0.5, height: 2, backgroundColor: '#F7F7FA'}} />
        <View style={{height: 15}}></View>
        <View style={{flex: 0.5, height: 8, backgroundColor: '#F7F7FA'}} />
        </>
    )
}