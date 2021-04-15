import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import {COLOR, DARK, FONT_MEDIUM, FONT_REGULAR} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'

const VerifyWallet = ({navigation,walletinfo})=> {

    return (
        <>
            <Image style={{height: 120,width: 120}} resizeMode="contain" source={require('../../../../../../assets/images/toktokwallet.png')} />
            <Text style={{fontFamily: FONT_MEDIUM,fontSize: 20,marginTop: 35}}>Verify your toktok wallet</Text>
            <Text style={{fontFamily: FONT_REGULAR,fontSize: 12}}>Click the "Verify now" button to verify wallet.</Text>

            <View style={{marginTop: 20}}>
                <Text style={{fontFamily: FONT_REGULAR,marginBottom: 1,fontSize: 12}}><FIcon5 color="orange" name="check" />  Go cashless with toktok wallet</Text>
                <Text style={{fontFamily: FONT_REGULAR,fontSize: 12,marginBottom: 1}}><FIcon5 color="orange" name="check" />  Secure your wallet</Text>
                <Text style={{fontFamily: FONT_REGULAR,fontSize: 12,marginBottom: 1}}><FIcon5 color="orange" name="check" />  Enjoy convenient payment experience</Text>
                <Text style={{fontFamily: FONT_REGULAR,fontSize: 12,marginBottom: 1}}><FIcon5 color="orange" name="check" />  Unlock walllet features</Text>
            </View>
            <View style={styles.btns}>
                <TouchableOpacity onPress={()=>navigation.pop()} style={[styles.btn,{borderWidth: 1,borderColor:"gray"}]}>
                    <Text style={{fontFamily: FONT_REGULAR,fontSize:12,color:"gray"}}>Do it later</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.replace("TokTokWalletVerifyUser")} style={[styles.btn,{backgroundColor:DARK}]}>
                <Text style={{fontFamily: FONT_REGULAR,fontSize:12,color:COLOR}}>Verify Now</Text>
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


export default VerifyWallet