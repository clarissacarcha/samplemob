import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { FONT } from '../../../res/variables';
import {successIcon, errorIcon, warningIcon, questionIcon} from '../../assets'
import CustomIcon from '../Icons'
const {width, height} = Dimensions.get('window')

export const CustomModal = ({setIsVisible, type, message}) => {
    const dispatch = useDispatch()
  

  const getIconByType = () => {
    if(type == "Success") return successIcon
    else if(type == "Error") return errorIcon
    else if(type == "Warning") return warningIcon
    else if(type == "Question") return questionIcon
  }

  return (
      <View style={styles.centeredView}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
          <View style={{backgroundColor: 'white', width: '80%', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 5}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 0}}>
              <TouchableOpacity onPress={() => {
                dispatch({type: 'TOKTOK_MALL_CLOSE_MODAL'})
              }} style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                <CustomIcon.EvIcon name="close" size={24} color="#F6841F" />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12}}>              
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
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    position: 'absolute',
    zIndex: 999,
    width: width,
    height: height,
    overflow: 'visible'
  }
});