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

export const MessageModal = ({navigation, isVisible, setIsVisible}) => {
  
  return (
    <>
      <View style= {{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Modal transparent = {true} visible = {isVisible} animationType = "none"  >
            <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.65)'}}>
              
              <View style = {{
                backgroundColor: 'white', 
                width: '90%',
                borderRadius: 10, 
                alignItems: 'center', 
                justifyContent: 'center',
                // paddingHorizontal: 30, 
                padding: 15
              }}>
                {/* <Image 
                  source = {require('../../../../assets/icons/promptsuccess.png')}
                  style = {{height: '60%', width: '65%', alignSelf: 'center', resizeMode: 'stretch'}}
                />
                <Text style ={styles.title}>Your order has been placed!</Text>
                <Text style ={styles.text}>Your order has been placed successfully. Please visit My Orders to check the progress and other details.</Text>
                <View style = {styles.row}>
                  <TouchableOpacity style = {styles.whiteButton} onPress = {() => {setIsVisible(false), navigation.navigate("ToktokMallHome")}}>
                    <Text style = {styles.whiteButtonText}>Continue shopping</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {
                      setIsVisible(false)
                      navigation.navigate("ToktokMallMyOrders", { tab: 0})
                    }
                  }>
                    <Text style = {styles.buttonText}>Go to My Orders</Text>
                  </TouchableOpacity>    
                </View> */}                
                <Text style ={styles.title}>Unable to Checkout</Text>
                <Text style ={styles.text}>
									Sorry, you don't have a toktokwallet account yet. Please create an account and top up to proceed in checkout.
								</Text>
								<View>
									<TouchableOpacity>
										<Text style={{color: COLOR.ORANGE, textDecorationLine: 'underline'}}>Create toktokwallet account</Text>
									</TouchableOpacity>
								</View>
								<View style={{height: '15%'}} />
                <View style = {styles.row}>                  
                  <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {
                      setIsVisible(false)                      
                    }
                  }>
                    <Text style = {styles.buttonText}>Ok</Text>
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
  title: { color: '#000', fontSize: 24, flex: 0, marginTop: 0, textAlign: 'center'},
  text: {color: '#9E9E9E', fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, flex: 0, paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center'},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  button: { padding: 10, backgroundColor: COLOR.ORANGE, alignItems: 'center', justifyContent: 'center', borderRadius: 5 , width: '45%' },
  buttonText: {color: 'white', fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M},
  whiteButton: { padding: 8, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', 
    borderRadius: 5, borderWidth: 1, borderColor: COLOR.ORANGE , width: '45%', marginRight: 20, fontSize: 11
  },
  whiteButtonText: {color: COLOR.ORANGE, fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M},
})