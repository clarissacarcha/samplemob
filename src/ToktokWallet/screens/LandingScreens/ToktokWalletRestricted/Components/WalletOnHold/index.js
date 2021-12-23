import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT, SIZE } = CONSTANTS

export const WalletOnHold = ({navigation,walletinfo})=> {

    return (
        <View style={styles.container}>
            <View style={{flex:1,justifyContent:"flex-start",alignItems:"center",marginTop: 60}}>
                <View style={styles.lockIcon}>
                        {/* <FIcon5 name="lock" /> */}
                        <Image style={{height: 40,width: 40}} resizeMode="contain" source={require('toktokwallet/assets/icons/lock.png')} />
                </View>
                <Text style={{fontFamily: FONT.BOLD,fontSize: 20,marginTop: 35, textAlign:'center'}}>Wallet is on hold</Text>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M, textAlign:'center'}}>Click the "Recover" button to recover toktokwallet.</Text>
            </View>

            <View style={{flex: 1}}>
                <View style={styles.btns}>
                    <TouchableOpacity onPress={()=>navigation.pop()} style={[styles.btn,{backgroundColor:"#F7F7FA", marginRight: 10}]}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.L,color:"gray"}}>Do it later</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>navigation.replace("ToktokWalletRecoveryMethods" , {type: "TPIN"})} style={[styles.btn,{backgroundColor:COLOR.YELLOW,marginLeft: 10}]}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.L}}>Recover</Text>
                    </TouchableOpacity>
                </View>
            </View>
          
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    lockIcon: {
        height: 80,
        width: 80,
        backgroundColor:"#FCB91A",
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center"
    },
    btns: {
        flex: 1,
        flexDirection:"row",
        height: SIZE.FORM_HEIGHT,
        width: "100%",
        alignItems: 'flex-end'
    },
    btn: {
        // width: 120,
        width: "100%",
        flex: 1,
        height: SIZE.FORM_HEIGHT,
        justifyContent:"center",
        borderRadius: 5,
        alignItems:"center"
    }
})
