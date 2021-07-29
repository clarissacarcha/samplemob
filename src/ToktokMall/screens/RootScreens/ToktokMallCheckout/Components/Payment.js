import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
// import { COLOR, FONT } from '../../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { useNavigation } from '@react-navigation/core';

const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]


export const Payment = ({ payment, setPaymentMethod}) => {

  const navigation = useNavigation()

  return (
    <>
    <View style={styles.container}>
        <Text style = {{marginLeft: 15, marginTop: 15}}>Select Payment Method</Text>
        { payment == 0 ? 
          <View style = {{backgroundColor: '#FFFCF4', padding:10}}>
            <Text style = {{color: '#F6841F', fontSize: 12, textAlign: 'center'}}>*insufficient funds! Kindly top up to add funds in your toktokwallet.</Text>
          </View> :
          <></>
        }
        <TouchableOpacity 
          style ={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, padding: 15, borderBottomColor: '#F7F7FA', backgroundColor: payment == 0 ? '#FFEBBC' : 'white' }}
          onPress = {() => {setPaymentMethod(0)}}
        >
          <View style ={{flexDirection: 'row', alignItems: 'center', flex: 1  }}>
            {/* <View style ={{height: 18, width: 18, backgroundColor: '#F6841F', }} /> */}
            <Image source={require("../../../../assets/icons/wallet.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
            <Text style = {{marginLeft: 10, fontWeight: 'bold', color: '#F6841F'}}>totokwallet</Text>
          </View>
          <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 3  }}>
            <Text style = {{marginLeft: 5, fontWeight: 'bold', color: '#929191'}}>(Balance Php 200.00)</Text>
            <TouchableOpacity onPress={() => {
              navigation.push("ToktokWalletHomePage")
            }}>
              <Text style = {{ alignSelf: 'flex-end', color: '#F6841F'}}>Top up</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style ={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, padding: 15, borderBottomColor: '#F7F7FA', backgroundColor: payment == 1 ? '#FFEBBC' : 'white' }}
          onPress = {() => {setPaymentMethod(1)}}
        >
          <View style ={{height: 20, width: 20, backgroundColor: '#F9B71A', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require("../../../../assets/icons/cod.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
          </View>
          <Text style = {{marginLeft: 10, fontWeight: 'bold', color: '#F6841F'}}>Cash on delivery</Text>
        </TouchableOpacity>
      </View>
      </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 0, backgroundColor: 'white', marginTop: 15,  },
  itemContainer: {flexDirection: 'row', justifyContent: 'flex-start'},
  itemImage: {flex: 0.3, height: 100, width: 100},
  itemprice: {color: '#F6841F', marginRight: 10},
  itemSaleOff: {textDecorationLine: 'line-through', color: '#9E9E9E'},
  deliveryfeeContainer: {borderWidth: 1, borderColor: '#FDDC8C', marginLeft: 15, marginRight: 15, padding: 10, borderRadius: 5}
})