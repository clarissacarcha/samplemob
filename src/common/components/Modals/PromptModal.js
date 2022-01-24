import React from 'react'
import { View , Modal , Text , StyleSheet , Image , Dimensions , TouchableOpacity} from 'react-native'
import { useThrottle } from 'src/hooks'
import { moderateScale } from 'toktokwallet/helper'
import Error from 'src/common/assets/globalert/Error.png'
import Question from 'src/common/assets/globalert/Question.png'
import Success from 'src/common/assets/globalert/Success.png'
import Warning from 'src/common/assets/globalert/Warning.png'
import CONSTANTS from 'common/res/constants';

const { width } = Dimensions.get("window")
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE  , SHADOW } = CONSTANTS

const TOKWA_ERROR_ICON = require('../../../assets/toktokwallet-assets/error.png');
const TOKWA_SUCCESS_ICON = require('../../../assets/toktokwallet-assets/success.png');

export const PromptModal = ({
  type,
  title,
  message,
  visible,
  setVisible,
  onPress,
  children,
  event
}) => {
  const closeModal = ()=> setVisible(false)
  const onThrottledPress = useThrottle(onPress? onPress : closeModal, 2000)

  let icon = Error
  switch(type){
    case "success":
      icon = event === "TOKTOKWALLET" ? TOKWA_SUCCESS_ICON : Success;
      break;
    case "error":
      icon = event === "TOKTOKWALLET" ? TOKWA_ERROR_ICON : Error;
      break;
    case "warning":
      icon = Warning;
      break;
    case "question":
      icon = Question;
      break;
    default: 
      break;
  }

  return (
    <Modal 
      visible={visible}
      transparent={true}
      onRequestClose={closeModal ? closeModal : onThrottledPress}
      style={styles.container}
    >
      <View style={styles.modalBody}>
        <View style={styles.content}>
          <Image source={icon} style={event === "TOKTOKWALLET" ? styles.smallIcon : styles.largeIcon} />
          { !!title && (
            <Text
              style={[
                styles.successText,
                { color: event === "TOKTOKWALLET" ? "black" : type == "warning" ? "#FFBF00" : "#F73C21" }
              ]}
            >
              {title}
            </Text>
          )}
          <Text style={styles.messageText}>{message}</Text>
          {children}
          <TouchableOpacity
            onPress={onThrottledPress}
            style={[styles.btn, { backgroundColor: event === "TOKTOKWALLET" ? "#FDBA1C" : COLOR.ORANGE}]}
          >
            <Text style={[styles.btnText, { color: event === "TOKTOKWALLET" ? "black" : "white" }]}>OK</Text>
          </TouchableOpacity>
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
    backgroundColor:"rgba(0,0,0, 0.7)",
    justifyContent:"center",
    alignItems:"center",
  },
  content: {
    width: width * 0.8,
    backgroundColor:"white",
    borderRadius: SIZE.BORDER_RADIUS,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(20),
    alignItems:'center'
  },
  successText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL, 
    textAlign:"center",
    marginTop: 10,
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
  largeIcon: {
    width: moderateScale(160),
    height: moderateScale(160),
    resizeMode: "contain",
  },
  button: {
    justifyContent:"flex-end",
    width: "50%",
    marginTop: moderateScale(20)
  },
  btn: {
    height: moderateScale(40),
    width: moderateScale(100),
    borderRadius: 5,
    backgroundColor: COLOR.ORANGE,
    justifyContent:"center",
    alignItems:'center',
    marginTop: moderateScale(20),
  },
  btnText: {
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(FONT_SIZE.L),
    color: "white",
  },
  smallIcon: {
    width: moderateScale(100),
    height: moderateScale(100),
    resizeMode: "contain",
  }
})
