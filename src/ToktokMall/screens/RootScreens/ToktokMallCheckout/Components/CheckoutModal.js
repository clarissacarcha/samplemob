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

export const CheckoutModal = ({navigation, isVisible, setIsVisible, goToOrders}) => {
  

  return (
    <>
      <View style= {styles.container}>
          <Modal transparent = {true} visible = {isVisible} animationType = "none"  >
            <View style = {styles.subContainer}>
              
              <View style = {styles.promptContainer}>
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
                <Image 
                  source = {require('../../../../assets/icons/promptsuccess.png')}
                  style = {styles.promptImage}
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
                      goToOrders()
                    }
                  }>
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
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  subContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  },
  title: { 
    color: COLOR.ORANGE, 
    fontFamily: FONT.BOLD, 
    fontSize: 24, 
    flex: 0, 
    marginTop: 0, 
    textAlign: 'center'
  },
  promptImage: {
    height: '50%', 
    width: '65%', 
    alignSelf: 'center', 
    resizeMode: 'contain'
  },
  promptContainer: {
    backgroundColor: COLOR.WHITE, 
    width: '90%',
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 15
  },
  text: {
    color: COLOR.GRAY, 
    fontFamily: FONT.REGULAR, 
    fontSize: FONT_SIZE.M, 
    flex: 0, 
    paddingVertical: 10, 
    paddingHorizontal: 10, 
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 10 
  },
  button: { 
    padding: 10, 
    backgroundColor: COLOR.ORANGE, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 5, 
    width: '45%' 
  },
  buttonText: {
    color: COLOR.WHITE, 
    fontFamily: FONT.REGULAR, 
    fontSize: FONT_SIZE.M
  },
  whiteButton: { 
    padding: 8, 
    backgroundColor: COLOR.WHITE,
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 5, 
    borderWidth: 1, 
    borderColor: COLOR.ORANGE , 
    width: '45%',
    marginRight: 20, 
    fontSize: FONT_SIZE.S
  },
  whiteButtonText: {
    color: COLOR.ORANGE, 
    fontFamily: FONT.REGULAR, 
    fontSize: FONT_SIZE.M
  },
})