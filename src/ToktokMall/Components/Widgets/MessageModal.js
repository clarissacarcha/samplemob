import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, Modal,  Alert } from 'react-native';
import { COLOR, FONT, FONT_SIZE } from '../../../res/variables';
import {successIcon, errorIcon, warningIcon, questionIcon} from '../../assets'
import CustomIcon from '../Icons'

export const MessageModal = ({navigation, isVisible, setIsVisible, type, message}) => {
  
  const [modalVisible, setModalVisible] = useState(isVisible || false)

  const getIconByType = () => {
    if(type == "Success") return successIcon
    else if(type == "Error") return errorIcon
    else if(type == "Warning") return warningIcon
    else if(type == "Question") return questionIcon
  }

  return (
    <>
      <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}       
      >
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
          <View style={{backgroundColor: 'white', width: '80%', paddingVertical: 20, paddingHorizontal: 24, borderRadius: 5}}>
            <View style={{flexDirection: 'row', paddingHorizontal: -15}}>
              <TouchableOpacity onPress={() => {
                setModalVisible(!modalVisible)
                setIsVisible(false)
              }} style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                <CustomIcon.EvIcon name="close" size={24} color="#F6841F" />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>              
              <View>
                <Image 
                  source={successIcon}
                  style={{width: 130, height: 120, resizeMode: 'stretch', overflow: 'hidden'}}
                />
              </View>
              <View style={{paddingVertical: 12}} />
              <Text style={{fontSize: 20, color: "#F6841F", fontFamily: FONT.REGULAR, textAlign: 'center'}}>{message}</Text>
              <View style={{paddingVertical: 12}} />
            </View>
          </View>
        </View>
      </Modal>
      
    </View>
    </>
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
  }
});