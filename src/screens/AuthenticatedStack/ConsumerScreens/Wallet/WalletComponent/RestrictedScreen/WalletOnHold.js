import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import {BUTTON_HEIGHT, COLOR, DARK, FONT_MEDIUM, FONT_REGULAR, SIZES} from '../../../../../../res/constants'

const WalletOnHold = ({navigation,walletinfo})=> {

    return (
        <View style={styles.container}>
            <View style={{flex:1,justifyContent:"flex-start",alignItems:"center",marginTop: 30}}>
                <View style={styles.lockIcon}>
                        {/* <FIcon5 name="lock" /> */}
                        <Image style={{height: 50,width: 40}} resizeMode="contain" source={require('../../../../../../assets/icons/lock.png')} />
                </View>
                <Text style={{fontFamily: FONT_MEDIUM,fontSize: 20,marginTop: 40}}>Wallet is on hold</Text>
                <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.M}}>Click the "Recover" button to recover toktokwallet.</Text>
            </View>

            <View style={{flex: 1}}>
                <View style={styles.btns}>
                    <TouchableOpacity onPress={()=>navigation.pop()} style={[styles.btn,{borderWidth: 1,borderColor:"gray", marginRight: 10}]}>
                        <Text style={{fontFamily: FONT_REGULAR,fontSize:SIZES.M,color:"gray"}}>Do it later</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>navigation.replace("ToktokWalletRecoveryMethods")} style={[styles.btn,{backgroundColor:DARK,marginLeft: 10}]}>
                    <Text style={{fontFamily: FONT_REGULAR,fontSize:SIZES.M,color:COLOR}}>Recover</Text>
                    </TouchableOpacity>
                </View>
            </View>
          
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lockIcon: {
        height: 100,
        width: 100,
        backgroundColor:"#FCB91A",
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center"
    },
    btns: {
        flex: 1,
        flexDirection:"row",
        height: BUTTON_HEIGHT,
        width: "100%",
        alignItems: 'flex-end'
    },
    btn: {
        // width: 120,
        width: "100%",
        flex: 1,
        height: BUTTON_HEIGHT,
        justifyContent:"center",
        borderRadius: 5,
        alignItems:"center"
    }
})


export default WalletOnHold