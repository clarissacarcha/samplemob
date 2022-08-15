import React, {useState, useEffect, useRef} from 'react';
import { Platform } from 'react-native';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, Modal,  Alert } from 'react-native';
import { COLOR, FONT, FONT_SIZE } from '../../../res/variables';
import {successIcon, errorIcon, warningIcon, questionIcon, alertIcon} from '../../assets'
import CustomIcon from '../Icons'

const Wrapper = ({children}) => {
  return Platform.OS === 'ios'? <>{children}</> : <View style={styles.centeredView}>{children}</View>
}

export const AlertModal = ({navigation, isVisible, setIsVisible, onPress, type, message}) => {
  
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    setModalVisible(isVisible)
  }, [isVisible])

  const getIconByType = () => {
    if(type == "Success") return successIcon
    else if(type == "Error") return errorIcon
    else if(type == "Warning") return warningIcon
    else if(type == "Question") return questionIcon
  }

  return (
      <Wrapper>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}       
      >
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
          <View style={{backgroundColor: 'white', width: '80%', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 5}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 0}}>
              <TouchableOpacity onPress={() => {
                setModalVisible(!modalVisible)
                setIsVisible(false)
              }} style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                <CustomIcon.EvIcon name="close" size={24} color="#F6841F" />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12}}>              
              <View>
                <Image 
                  source={alertIcon}
                  style={{width: 130, height: 120, resizeMode: 'stretch', overflow: 'hidden'}}
                />
              </View>
              <View style={{paddingVertical: 12}} />
              <Text style={{fontSize: 23, color: "#FFbF00", fontFamily: FONT.REGULAR, textAlign: 'center'}}>Are you sure you want to leave this page?</Text>
              <View style={{paddingVertical: 12}} />
              <View style = {{flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style = {styles.whiteButton} onPress = {() => {setIsVisible(false)}}>
                    <Text style = {styles.whiteButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.filledButton} onPress = {() => {
                  if(onPress){
                    onPress()
                    setIsVisible(false)
                    navigation.goBack()
                  }else{
                    setIsVisible(false)
                    navigation.goBack()
                  }
                }}>
                    <Text style = {styles.filledButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    position: 'absolute'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  filledButton: {
    backgroundColor: COLOR.ORANGE,
    marginLeft: 15,
    borderRadius: 5,
    height: 50,
    width: '40%',
    alignItems: 'center', justifyContent: 'center'
  },
  filledButtonText: {
    color: 'white', fontFamily: FONT.REGULAR, fontSize: 15
  },
  whiteButton: {
    borderColor: COLOR.ORANGE,
    borderWidth: 1,
    marginRight: 0,
    borderRadius: 5,
    height: 50,
    width: '40%',
    alignItems: 'center', justifyContent: 'center'
  },
  whiteButtonText: {
    color: COLOR.ORANGE, fontFamily: FONT.REGULAR, fontSize: 15
  }
});