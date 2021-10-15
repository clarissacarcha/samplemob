import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, Modal,  Alert } from 'react-native';
import { COLOR, FONT, FONT_SIZE } from '../../../res/variables';
import {successIcon, errorIcon, warningIcon, questionIcon} from '../../assets'
import CustomIcon from '../Icons'

export const DynamicMessageModal = ({navigation, isVisible, setIsVisible, type, title, message, buttons}) => {
  
  const [modalVisible, setModalVisible] = useState(isVisible || false)

  const getIconByType = () => {
    if(type == "Success") return successIcon
    else if(type == "Error") return errorIcon
    else if(type == "Warning") return warningIcon
    else if(type == "Question") return questionIcon
  }

  const getTextColorByType = () => {

    if(type == "Success") return "#F6841F"
    else if(type == "Error") return "#F6841F"
    else if(type == "Warning") return "#FFBF00"
    else if(type == "Question") return "#F6841F"
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
          <View style={{backgroundColor: 'white', width: '80%', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 5}}>
            {/* <View style={{flexDirection: 'row', paddingHorizontal: 0}}>
              <TouchableOpacity onPress={() => {
                setModalVisible(!modalVisible)
                setIsVisible(false)
              }} style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                <CustomIcon.EvIcon name="close" size={24} color="#F6841F" />
              </TouchableOpacity>
            </View> */}
            <View style={{height: 10}} />
            <View style={{alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12}}>              
              <View>
                <Image 
                  source={getIconByType()}
                  style={{width: 130, height: 120, resizeMode: 'stretch', overflow: 'hidden'}}
                />
              </View>
              <View style={{height: 10}} />
              <Text style={{fontSize: 25, color: getTextColorByType(), fontFamily: FONT.BOLD, textAlign: 'center'}}>{title}</Text>
              <View style={{height: 10}} />
              <Text style={{fontSize: 13, color: "#525252", fontFamily: FONT.REGULAR, textAlign: 'center'}}>{message}</Text>              
							<View style={{height: 12}} />
            </View>

            {buttons.length > 0 && buttons.map((btn) => {

              return (
                <>
                <TouchableOpacity 
                  onPress={btn.onPress} 
                  style={{
                    flex: 1, 
                    backgroundColor: 'white', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    paddingVertical: 8, 
                    marginHorizontal: 8,
                    borderRadius: 5, 
                    borderWidth: 1, 
                    borderColor: "#F6841F",
                    ...btn.containerStyle
                  }}>
                  <Text style={{fontSize: 13,  color: "#F6841F", ...btn.labelStyle}}>{btn.label}</Text> 
                </TouchableOpacity>
                </>
              )

            })}

            <View style={{height: 15}} />

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