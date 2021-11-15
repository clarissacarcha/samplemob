import React from 'react';
import { View , Text , StyleSheet , Modal , Dimensions , Image } from 'react-native';
import {useThrottle} from 'src/hooks'
import { OrangeButton } from '../Buttons';
import SuccessIcon from 'toktokwallet/assets/images/success.png';
import ErrorIcon from 'toktokwallet/assets/images/error.png';
import WarningIcon from 'toktokwallet/assets/images/warning.png';
import CONSTANTS from 'common/res/constants';
import { success_icon, error_icon } from 'toktokload/assets/icons';
import { moderateScale } from 'toktokload/helper';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;
const { width , height } = Dimensions.get("window");

export const PromptModal = ({visible , title , message , onPress , event , children , closeModal = null})=> {

  const onPressThrottled = useThrottle(onPress , 2000);
  let imageIcon = success_icon;
  switch(event){
    case "success":
        imageIcon = success_icon;
        break
    case "error":
        imageIcon = error_icon;
        break;
    default: 
        break;
  }

  return (
    <Modal 
      visible={visible}
      transparent={true}
      onRequestClose={closeModal ? closeModal : onPressThrottled}
      style={styles.container}
    >
      <View style={styles.modalBody}>
        <View style={styles.content}>
          <Image
            source={imageIcon}
            style={styles.imageIcon}
          />
          <Text style={styles.successText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>
          {children}
          <View style={styles.button}>
            <OrangeButton label="Ok" onPress={onPressThrottled}/>
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
    padding: moderateScale(20),
    alignItems:'center'
  },
  successText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL, 
    textAlign:"center",
    marginVertical: 10,
    marginHorizontal: 20,
    color: "#F6841F"
  },
  messageText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    textAlign:"center",
    marginHorizontal: 20,
  },
  imageIcon: {
    width: moderateScale(170),
    height: moderateScale(170),
    resizeMode: "contain"
  },
  button: {
    justifyContent:"flex-end",
    width: "50%",
    marginTop: moderateScale(20)
  }
})
