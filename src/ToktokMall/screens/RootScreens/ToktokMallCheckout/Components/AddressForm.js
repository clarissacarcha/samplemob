import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
import { FONT } from '../../../../../res/variables';

// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'
import Address from '../../ToktokMallAddresses/ToktokMallAddressesMenu/components/Adress'

export const AddressForm = ({data, onEdit}) => {
    
  return (
    <>
      <View style = {styles.container}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Delivery Address</Text>
          <TouchableOpacity onPress={onEdit}>
            <Text style={{color: '#F6841F'}}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View  style={styles.addressContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.addressfullName}>{data.receiverName}</Text>
            {/* <Text style={styles.addressdefaultText}>Default</Text> */}
          </View>
          <Text style={styles.addresscontact_number}>{data.receiverContact}</Text>
          <Text style={styles.addressText}>{data.address}</Text>
        </View>
      </View>  
    </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {paddingVertical: 8, paddingHorizontal: 15, backgroundColor: 'white', marginTop: 0,  },
  addressContainer: {borderRadius: 5, backgroundColor: '#F8F8F8', padding: 10, marginTop: 10, marginBottom: 10},
  addressdefaultText: {color: '#F6841F'},
  addressfullName: {textTransform: 'capitalize', fontSize: 14, fontFamily: FONT.REGULAR},
  addresscontact_number: {color: '#9E9E9E'},
  addressText: {marginTop: 10, fontSize: 13, textTransform: 'capitalize'}
})

// export default AddressForm