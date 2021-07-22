import React from 'react';
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native';
import { HeaderBack, HeaderTitle, HeaderRight, Voucher } from '../../../Components';
import { useNavigation } from '@react-navigation/core';
import { COLOR, FONT, FONT_SIZE } from '../../../../res/variables';
import CustomIcon from '../../../Components/Icons';

const testdata = [{
  type: "FREE SHIPPING",
  label: "Free Shipping Voucher",
  description: "Valid until: 5.14.2021",
  status: 0,
}, {
  type: "FREE SHIPPING",
  label: "Free Shipping Voucher",
  description: "Valid until: 5.14.2021",
  status: 0
}, {
  type: "FREE SHIPPING",
  label: "Free Shipping Voucher",
  description: "Valid until: 5.14.2021",
  status: 1
}]

const Item = ({data}) => {
  return (
      <>
        <View style={{flex: 0.5, height: 2, backgroundColor: '#F7F7FA'}} />  
        <View style={{paddingVertical: 15, paddingHorizontal: 15, flexDirection: 'row'}}>
          <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{height: 50, width: 50, backgroundColor: '#FCC442', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 5}}>
             <Text style={{textAlign: 'center', fontSize: 9, fontWeight: '600', color: "#fff", textTransform: 'uppercase'}}>{data.type}</Text> 
            </View>
          </View>
          <View style={{flex: 9, justifyContent: 'center'}}>
            <Text>{data.label}</Text>
            <Text style={{color: "#9E9E9E", fontSize: 11}}>{data.description}</Text>
          </View>
          <View style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{backgroundColor: data.status == 1 ? "#FFFCF4" : '#F6841F', borderRadius: 5, paddingVertical: 2, paddingHorizontal: 10}}>
              <Text style={{fontSize: 12, color: data.status == 1 ? "#F6841F" : "#FFF"}}>{data.status == 1 ? "Claimed" : "Claim"}</Text>
            </View>
          </View>
        </View>
      </>
  )
}


export const ToktokMallVouchersClaim = ({navigation}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Vouchers', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      
      <FlatList 
        data={testdata}
        renderItem={({item}) => <Item data={item} />}
      />
      <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
      <View style={{height: 15}}></View>

    </View>
  );
};