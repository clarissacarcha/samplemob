import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CheckBox from 'react-native-check-box';

export const DeleteFooter = ({onDelete, style,...rest}) => {
  return (
    <>
    	<View style={styles.container} >
        <View style={styles.subContainer}>                        
          <View style={styles.deleteContainer}>
            <TouchableOpacity onPress={onDelete} style={[styles.button, style]} {...rest}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff', 
    position: 'absolute', 
    bottom: 0, 
    width: '100%'
  },
  subContainer: {
    flexDirection: 'row', 
    paddingVertical: 15, 
    paddingHorizontal: 15
  },
  deleteContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center'
  },
  button: {
    backgroundColor: '#F6841F', 
    paddingVertical: 15, 
    paddingHorizontal: 50, 
    borderRadius: 5
  },
  deleteText: {
    fontSize: 14, 
    color: '#fff'
  }
})