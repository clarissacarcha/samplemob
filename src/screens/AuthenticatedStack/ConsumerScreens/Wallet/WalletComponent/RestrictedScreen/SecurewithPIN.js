import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import {COLOR, DARK, FONT_MEDIUM, FONT_REGULAR} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5' 

const SecurewithPIN = ({navigation,walletinfo})=> {

    return (
        <>
            <View style={styles.lockIcon}>
                     <Image style={{height: 50,width: 50}} source={require('../../../../../../assets/icons/walletVerify.png')}/>
            </View>
            <Text style={{fontFamily: FONT_MEDIUM,fontSize: 20,marginTop: 40}}>Setup your wallet PIN</Text>
            <Text style={{fontFamily: FONT_REGULAR,fontSize: 12}}>Click the "Set up PIN" button to create your toktok wallet PIN.</Text>
            <View style={{marginTop: 20}}>
                <Text style={{fontFamily: FONT_REGULAR,marginBottom: 1,fontSize: 12}}><FIcon5 color="orange" name="check" />  Cashless transactions will be enabled after updating your PIN</Text>
            </View>
            <View style={styles.btns}>
                <TouchableOpacity onPress={()=>navigation.pop()} style={[styles.btn,{borderWidth: 1,borderColor:"gray"}]}>
                    <Text style={{fontFamily: FONT_REGULAR,fontSize:12,color:"gray"}}>Do it later</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.replace("TokTokWalletSettingsPinCode", {walletinfo})} style={[styles.btn,{backgroundColor:DARK}]}>
                <Text style={{fontFamily: FONT_REGULAR,fontSize:12,color:COLOR}}>Set up PIN</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    lockIcon: {
        height: 100,
        width: 100,
        backgroundColor:"#FCB91A",
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center"
    },
    btns: {
        flexDirection:"row",
        marginTop: 40
    },
    btn: {
        width: 120,
        marginHorizontal: 5,
        padding: 8,
        justifyContent:"center",
        borderRadius: 5,
        alignItems:"center"
    }
})


export default SecurewithPIN