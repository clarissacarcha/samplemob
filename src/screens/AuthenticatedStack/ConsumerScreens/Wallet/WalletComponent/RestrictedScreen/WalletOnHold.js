import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import {COLOR, DARK, FONT_MEDIUM, FONT_REGULAR} from '../../../../../../res/constants'

const WalletOnHold = ({navigation,walletinfo})=> {

    return (
        <>
            <View style={styles.lockIcon}>
                    {/* <FIcon5 name="lock" /> */}
                    <Image style={{height: 50,width: 40}} resizeMode="contain" source={require('../../../../../../assets/icons/lock.png')} />
            </View>
            <Text style={{fontFamily: FONT_MEDIUM,fontSize: 20,marginTop: 40}}>Wallet is on hold</Text>
            <Text style={{fontFamily: FONT_REGULAR,fontSize: 12}}>Click the "Recover" button to recover wallet.</Text>
            <View style={styles.btns}>
                <TouchableOpacity onPress={()=>navigation.pop()} style={[styles.btn,{borderWidth: 1,borderColor:"gray"}]}>
                    <Text style={{fontFamily: FONT_REGULAR,fontSize:12,color:"gray"}}>Do it later</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.replace("TokToKWalletForgotPin")} style={[styles.btn,{backgroundColor:DARK}]}>
                <Text style={{fontFamily: FONT_REGULAR,fontSize:12,color:COLOR}}>Recover</Text>
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


export default WalletOnHold