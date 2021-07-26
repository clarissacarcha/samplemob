import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, Modal} from 'react-native';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'
import AntDesgin from 'react-native-vector-icons/dist/AntDesign'
const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]
const REAL_WIDTH = Dimensions.get('window').width;

export const CheckoutModal = ({navigation, isVisible, setIsVisible}) => {
  

  return (
    <>
      <View style= {{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop: 22}}>
          <Modal transparent = {true} visible = {isVisible} animationType = "none"  >
            <View style = {{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
              <View style = {{backgroundColor: 'white', width: '90%',borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                paddingHorizontal: 20, 
              }}>
                {/* <AntDesgin 
                  name = {'checkcircleo'}
                  size = {90}
                  color = {'#F6841F'}
                /> */}
                <Image 
                  source = {require('../../../../assets/icons/promptsuccess.png')}
                  // style = {{height: '40%' , resizeMode: 'cover', width: '40%', alignSelf: 'center'}}
                  style = {{height: '30%', width: '40%', alignSelf: 'center'}}
                />
                <Text style ={styles.title}>Your order has been placed!</Text>
                <Text style ={styles.text}>Your order has been placed successfully. Please visit My Orders to check the progress and other details.</Text>
                <View style = {styles.row}>
                  <TouchableOpacity style = {styles.whiteButton} onPress = {() => {setIsVisible(false), navigation.navigate("ToktokMallHome")}}>
                    <Text style = {styles.whiteButtonText}>Continue shopping</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style = {styles.button} onPress = {() => {setIsVisible(false), navigation.navigate("ToktokMallMyOrders", { tab: 0})}}>
                    <Text style = {styles.buttonText}>Go to My Orders</Text>
                  </TouchableOpacity>    
                </View>
              </View>
            </View>
            
          </Modal>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    // height: 200,
    // width: 200,
    margin: 20,
    // marginTop: '40%',
    
    backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center', alignSelf: 'center',
    // shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
    // shadowOffset: {
    //     width: 0, height: 2
    // }
  },
  title: { color: COLOR.ORANGE, fontFamily: FONT.BOLD, fontSize: 24, flex: 0, paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center'},
  text: {color: '#9E9E9E', fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, flex: 0, paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center'},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', top: 20 },
  button: { padding: 10, backgroundColor: COLOR.ORANGE, alignItems: 'center', justifyContent: 'center', borderRadius: 5 , width: '45%' },
  buttonText: {color: 'white', fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M},
  whiteButton: { padding: 10, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', 
    borderRadius: 5, borderWidth: 1, borderColor: COLOR.ORANGE , width: '45%', marginRight: 20
  },
  whiteButtonText: {color: COLOR.ORANGE, fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M},
})