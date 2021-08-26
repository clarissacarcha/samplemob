import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Platform, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
import { FONT } from '../../../../../res/variables';
import CustomIcon from '../../../../Components/Icons';

const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]

export  const Vouchers = ({ navigation, vouchers, setVouchers, vcode, setvCode}) => {

  const renderVouchers = () => {
    // if (vouchers.length > 0){
      return vouchers.map((data, i) => {
        return(
          <>
            <View style={{flex: 0.5, height: 2, backgroundColor: '#F7F7FA'}} />  
            <View style={{paddingVertical: 15, paddingHorizontal: 15, flexDirection: 'row'}}>
              <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{height: 50, width: 50, backgroundColor: '#FCC442', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 5}}>
                <Text style={{textAlign: 'center', fontSize: 9, fontWeight: '600', color: "#fff", textTransform: 'uppercase'}}>{data.type}</Text> 
                </View>
              </View>
              <View style={{flex: 10, justifyContent: 'center'}}>
                <Text>{data.label}</Text>
                <Text style={{color: "#9E9E9E", fontSize: 11}}>{data.description}</Text>
              </View>
              
            </View>
          </>
        )
      })
    // }
  }
    
  return (
    <>
      <View style = {styles.container2}>
        <TouchableOpacity activeOpacity={1} style = {styles.container} onPress = {() => {
          // navigation.navigate("ToktokMallVouchersClaim", {tab: 1, vouchers: vouchers, setVouchers: setVouchers})
        }}>
        {/* <TouchableOpacity style = {styles.container} onPress = {() => {navigation.navigate("ToktokMallMyVouchersClaim", {tab: 1})}}> */}
            <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Voucher</Text>
            {/* <TouchableOpacity onPress = {() => {alert(JSON.stringify(vouchers))}}>
              <CustomIcon.FA5Icon name="chevron-right" size={11} color="#F6841F" />
            </TouchableOpacity> */}
        </TouchableOpacity>
        <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
        {/* {renderVouchers()} */}
        <View style={{paddingVertical: 8, paddingHorizontal: 15}}>
          <View style={{
            padding: Platform.OS === 'ios' ? 10 : 0,
            backgroundColor: '#F8F8F8',
            marginTop: 10,
            borderRadius: 5,
            alignItems: 'flex-start',
          }}>
            <TextInput
              value={vcode}
              style={{marginLeft: 10, width: '100%'}}
              placeholder="Input voucher (optional)"
              onChangeText={(val) => setvCode(val)}
            />
          </View>
          <View style={{paddingVertical: 8}} />
        </View>
      </View>
        
    </>
  )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 15, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'  },
  container2: { backgroundColor: 'white', marginTop: 8,  }

})