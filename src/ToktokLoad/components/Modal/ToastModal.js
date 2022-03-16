import React, {useEffect} from 'react'
import { View , Text , StyleSheet , Image , Dimensions , TouchableOpacity} from 'react-native'
import { useThrottle } from 'src/hooks'
import { moderateScale } from 'toktokwallet/helper'

import CONSTANTS from 'common/res/constants';
import Modal from 'react-native-modal';
import { check_icon } from 'toktokload/assets/icons'

const { width } = Dimensions.get("screen")
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE  , SHADOW } = CONSTANTS

export const ToastModal = ({
  type,
  title,
  message,
  visible,
  setVisible,
  onPress,
  children,
  event
}) => {

  useEffect(() => {
    if(visible){
      setTimeout(() => {
        setVisible(prev => ({ ...prev, show: false }))
      }, 1000)
    }
  }, [visible])

  return (
    <Modal 
      isVisible={visible}
      transparent={true}
      useNativeDriver={true} 
      style={styles.container}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
    >
      <View style={styles.modalBody}>
        <View style={styles.content}>
          <Image source={check_icon} style={{ width: moderateScale(70), height: moderateScale(70), resizeMode: "contain", marginBottom: moderateScale(15) }} />
          { !!title && (
            <Text style={[ styles.successText, { color: "#F6841F" } ]}>
              {title}
            </Text>
          )}
          {!!message && <Text style={styles.messageText}>{message}</Text> }
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBody: {
    flex: 1,
    // backgroundColor:"rgba(0,0,0, 0.7)",
    justifyContent:"center",
    alignItems:"center",
  },
  content: {
    width: width * 0.5,
    backgroundColor:"white",
    borderRadius: SIZE.BORDER_RADIUS,
    padding: moderateScale(20),
    alignItems:'center'
  },
  successText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L, 
    textAlign:"center",
    marginBottom: moderateScale(10),
    marginHorizontal: moderateScale(20),
    color: "#F6841F"
  },
  messageText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    textAlign:"center",
    marginHorizontal: moderateScale(20),
    marginTop: 10,
  },
})
