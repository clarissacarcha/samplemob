import React from 'react'
import {View,Text,StyleSheet,Image,Platform ,StatusBar,TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'
import { HeaderBack } from './HeaderBack'
import { moderateScale , scale } from 'toktokbills/helper'
import MIcon from 'react-native-vector-icons/MaterialIcons';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const HeaderTitle = ({isRightIcon, rightIcon = null, rightIconOnPress, isLogo, label ,labelColor = "black" , backButtonColor = "black" , headerBackLabel = "", headerStyle = {}})=> {

    return (
      <View style={[ styles.header, headerStyle ]}>
        {
          isLogo
          ? <Image resizeMode="contain" style={{height: moderateScale(23),width: moderateScale(130)}} source={require('toktokwallet/assets/images/toktokwallet.png')} />
          : <Text style={{fontSize: moderateScale(FONT_SIZE.L),fontFamily: FONT.BOLD,color: labelColor}}>{label}</Text>
        }
      </View>
    )
}

const styles = StyleSheet.create({
 
})  