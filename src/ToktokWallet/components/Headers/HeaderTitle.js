import React from 'react'
import {View,Text,StyleSheet,Image,Platform ,StatusBar,TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'
import { HeaderBack , ICON_SET, VectorIcon } from 'src/revamp'
import { useNavigation } from '@react-navigation/native'
import { moderateScale } from 'toktokwallet/helper'
import MIcon from 'react-native-vector-icons/MaterialIcons';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const HeaderTitle = ({isRightIcon, rightIcon = null, rightIconOnPress, isLogo, label , labelFont, labelColor = "black" , backButtonColor = "black" , headerBackLabel = "", headerStyle = {}})=> {
    const navigation = useNavigation();
    const leaveTokwa = ()=> navigation.pop(2);
    
    return (
        <View style={[styles.header, headerStyle ]}>
            <View style={{flex: 1,flexDirection:"row"}}>
                {/* <HeaderBack onBack={leaveTokwa} color={backButtonColor} label={headerBackLabel}/> */}
                <HeaderBack color={backButtonColor} label={headerBackLabel}/>
            </View>
            <View style={{justifyContent:"center",alignItems:"center"}}>
            {
                isLogo
                ? <Image resizeMode="contain" style={styles.logo} source={require('toktokwallet/assets/images/toktokwallet.png')} />
                : <Text style={{fontSize: FONT_SIZE.L,fontFamily: labelFont ? labelFont : FONT.BOLD,color: labelColor}}>{label}</Text>
            }
            </View>
            {
                isRightIcon
                ? <TouchableOpacity onPress={rightIconOnPress} style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
                        <MIcon style={{marginRight: 16}} name="notifications" color={"black"} size={25} />
                    </TouchableOpacity>
                : <View style={{flex: 1}}/>
            }
           
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        // marginTop: Platform.OS === "ios" ? 22 : 42,
        marginTop: StatusBar.currentHeight + 12,
        height: moderateScale(24),
        width: "100%",
        flexDirection:"row"
    },
    logo: {
        height: moderateScale(23),
        width: moderateScale(130),
    },
})