import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
// import { COLOR, FONT } from '../../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'
import Address from '../../ToktokMallAddresses/ToktokMallAddressesMenu/components/Adress'
const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]

export const AddressForm = ({navigation , data , addressData, setAddressData ,defaultAddress , setDefaultAddress, addressLengthChanged ,setAddressLengthChanged}) => {

    
  return (
    <>
      <View style = {styles.container}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text>Delivery Address</Text>
          <TouchableOpacity onPress={() => {
              navigation.navigate("ToktokMallAddressesMenu", {
                addressData: addressData,  setDefaultAddress:setDefaultAddress, defaultAddress: defaultAddress
                , setAddressData: setAddressData,
                addressLengthChanged: addressLengthChanged ,setAddressLengthChanged: setAddressLengthChanged, screen: 'checkout'
              })
          }}>
            <Text style={{color: '#F6841F'}}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Address item = {data} screen = {'checkout'}/>
      </View>  
    </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 15, backgroundColor: 'white', marginTop: 15,  },
  

})

// export default AddressForm