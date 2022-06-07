import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, Dimensions, Modal,  Alert, StatusBar } from 'react-native';
import { COLOR, FONT, FONT_SIZE } from '../../../res/variables';
import AntDesgin from 'react-native-vector-icons/dist/AntDesign'

const Confirm = ({onCancel, onConfirm}) => {
  return (
    <>
      
    </>
  )
}

export const AddressModal = ({navigation, isVisible, setIsVisible, type}) => {
  
  const [modalVisible, setModalVisible] = useState(isVisible || false)

  return (
    <>
      <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
        style={{height: Dimensions.get("screen").height}}
      >
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)', height: Dimensions.get("screen").height}}>
          <View style={{backgroundColor: 'white', width: '90%', paddingVertical: 20, paddingHorizontal: 20, borderRadius: 5}}>
              <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16}}>
                <Text style={{color: "#F6841F", fontSize: 22, textAlign: 'center'}}> Are you sure you want to delete this address?</Text>
              </View>
              <View style={{paddingVertical: 8}} />
      				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        				<TouchableOpacity onPress={onCancel} style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 5, borderWidth: 1, borderColor: "#F6841F"}}>
          				<Text style={{fontSize: 13, color: "#F6841F"}}>Cancel</Text>    
        				</TouchableOpacity>
        				<View style={{flex: 0.2}} />
        				<TouchableOpacity onPress={onConfirm} style={{flex: 1, backgroundColor: '#F6841F', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 5}}>
          				<Text style={{fontSize: 13, color: "#fff"}}>Confirm</Text>    
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    position: 'absolute',
    height: Dimensions.get("screen").height
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