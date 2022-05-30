import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { FONT } from '../../../../../res/variables';
import AIcons from 'react-native-vector-icons/dist/AntDesign';
import { destination} from './../../../../assets';

export const AddressForm = ({data, onEdit}) => {
    
  return (
      <View style = {styles.container}>
        <View style={{ height: 3, backgroundColor: '#F7F7FA'}} />
        <View style = {styles.address}>
          <Image style={styles.image} source={destination} />
          <View style={{flex:10, paddingHorizontal:13}}>
            <Text style={{fontSize: 13, fontFamily: FONT.BOLD}}>Home</Text>
            <Text style={styles.addressText}>{data?.fullAddress || data?.address}</Text>
            <Text style={styles.addresscontact_number}>{data?.receiverContact || ""}</Text>
          </View>
          <TouchableOpacity onPress={onEdit}>
            <AIcons name={'right'} size={15} color={'#F6841F'}/>
          </TouchableOpacity>
        </View>
      </View>  
    )
}

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', marginTop: 0},
  address:{flexDirection: 'row', alignItems: 'flex-start',paddingVertical:16, paddingHorizontal: 16},
  image:{height: 15, width: 13, resizeMode: 'contain',marginTop:3},
  addresscontact_number: {color: '#525252',marginTop: 3, fontSize: 11,},
  addressText: {marginTop: 3, fontSize: 11, textTransform: 'capitalize',color: '#525252'}
})
