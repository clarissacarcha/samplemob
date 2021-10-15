import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
import { Price, FormatToText } from '../../../../helpers/formats';
// import { COLOR, FONT } from '../../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { useNavigation } from '@react-navigation/core';
import { FONT } from '../../../../../res/variables';

const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]


export const Payment = ({ list, payment, total, setPaymentMethod, currentBalance, setCurrenctBalance}) => {

  const navigation = useNavigation()
  // const [currentBalance, setCurrenctBalance] = useState(0)

  

  return (
    <>
    <View style={styles.container}>
        <Text style = {{marginLeft: 15, marginTop: 15, fontSize: 14, fontFamily: FONT.BOLD}}>Payment Method</Text>
        <View style={{paddingTop: 15}} />
        {parseFloat(currentBalance) < parseFloat(total) ? 
          <View style={{backgroundColor: '#FFFCF4', padding:10}}>
            <Text style={{color: '#F6841F', fontSize: 12, textAlign: 'center'}}>*insufficient funds! Kindly top up to add funds in your toktokwallet.</Text>
          </View> :
          <View style={{height: 8}} />
        }
        <TouchableOpacity 
          // style ={{...styles.item, backgroundColor: payment == 'toktokwallet' ? '#FFEBBC' : 'white' }}
          style ={{...styles.item, backgroundColor: parseFloat(currentBalance) < parseFloat(total) ? 'white' : 'rgba(255, 235, 188, 0.25)' }}
          onPress = {() => {
            setPaymentMethod("toktokwallet")
          }}
        >
          <View style ={{flexDirection: 'row', alignItems: 'center', flex: 1  }}>
            {/* <View style ={{height: 18, width: 18, backgroundColor: '#F6841F', }} /> */}
            <Image source={require("../../../../assets/icons/wallet.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
            <Text style = {{marginLeft: 10, fontWeight: 'bold', color: '#F6841F'}}>totokwallet</Text>
          </View>
          <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 2.5  }}>
            <Text style = {{marginLeft: 5, fontWeight: 'bold', color: '#929191'}}>(Balance {FormatToText.currency(currentBalance)})</Text>
            <TouchableOpacity onPress={() => {

              navigation.navigate("ToktokWalletPaymentOptions" , {
                amount: 1000,
                  onCashIn: ({balance}) => {
                    setCurrenctBalance(balance)
                  },
              })

            }}>
              <Text style = {{ alignSelf: 'flex-end', color: '#F6841F'}}>Top up</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity 
          style ={{...styles.item, backgroundColor: payment == 'paypanda' ? '#FFEBBC' : 'white' }}
          onPress = {() => {setPaymentMethod("paypanda")}}
        >
          <View style ={{height: 20, width: 20, backgroundColor: '#F9B71A', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require("../../../../assets/icons/cod.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
          </View>
          <Text style = {{marginLeft: 10, fontWeight: 'bold', color: '#F6841F'}}>Paypanda</Text>
        </TouchableOpacity> */}

        {/* {list && list.length > 0 && list.map((item, i) => {
          return (
            <>
              <TouchableOpacity 
                style ={{...styles.item, backgroundColor: payment == item?.paycode ? '#FFEBBC' : 'white' }}
                onPress = {() => {setPaymentMethod(item?.paycode)}}
              >
                <View style ={{height: 20, width: 20, backgroundColor: '#F9B71A', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={require("../../../../assets/icons/cod.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
                </View>
                <Text style = {{marginLeft: 10, fontWeight: 'bold', color: '#F6841F'}}>{item?.description}</Text>
              </TouchableOpacity>
            </>
          )
        })} */}

        <View style={{height: 30}} />

      </View>
      </>
    )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 0, backgroundColor: 'white', marginTop: 8,  },
  itemContainer: {flexDirection: 'row', justifyContent: 'flex-start'},
  itemImage: {flex: 0.3, height: 100, width: 100},
  itemprice: {color: '#F6841F', marginRight: 10},
  itemSaleOff: {textDecorationLine: 'line-through', color: '#9E9E9E'},
  deliveryfeeContainer: {borderWidth: 1, borderColor: '#FDDC8C', marginLeft: 15, marginRight: 15, padding: 10, borderRadius: 5},
  item: {
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, padding: 15, borderBottomColor: '#F7F7FA', 
  }
})