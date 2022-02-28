import React from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity, Dimensions} from 'react-native'
import { OrangeButton } from 'toktokbills/components'
import { moderateScale } from 'toktokbills/helper'

import CONSTANTS from 'common/res/constants'
const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const {width,height} = Dimensions.get("window")

export const TransactionModal = ({ visible, setVisible, children })=> {

  return (
    <Modal
      visible={visible}
      setVisible={setVisible}
      transparent={true}
      onRequestClose={() => setVisible(false)}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.subContainer}>
          {children}
          <View style={styles.btnContainer}>
            <OrangeButton
              label="OK"
              btnStyle={{ height: moderateScale(40) }}
              onPress={() => setVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor:"rgba(0,0,0, 0.1)",
    justifyContent:"center",
    alignItems:"center"
  },
  labelText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  subContainer: {
    width: width * 0.75,
    backgroundColor:"white",
    borderRadius: 5,
    padding: moderateScale(20),
  },
  btnContainer: {
    justifyContent:"flex-end",
    width: "40%",
    alignSelf:"center",
    marginTop: moderateScale(20)
  }
})
