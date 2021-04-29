import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import {BUTTON_HEIGHT, COLORS, FONTS, SIZES} from '../../../../../res/constants'

const WalletOnHold = ({navigation,walletinfo})=> {

    return (
        <View style={styles.container}>
            <View style={{flex:1,justifyContent:"flex-start",alignItems:"center",marginTop: 60}}>
                <View style={styles.lockIcon}>
                        {/* <FIcon5 name="lock" /> */}
                        <Image style={{height: 40,width: 40}} resizeMode="contain" source={require('../../../../../assets/icons/lock.png')} />
                </View>
                <Text style={{fontFamily: FONTS.BOLD,fontSize: 20,marginTop: 35}}>Wallet is on hold</Text>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>Click the "Recover" button to recover toktokwallet.</Text>
            </View>

            <View style={{flex: 1}}>
                <View style={styles.btns}>
                    <TouchableOpacity onPress={()=>navigation.pop()} style={[styles.btn,{backgroundColor:"#F7F7FA", marginRight: 10}]}>
                        <Text style={{fontFamily: FONTS.BOLD,fontSize:SIZES.L,color:"gray"}}>Do it later</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>navigation.replace("ToktokWalletRecoveryMethods")} style={[styles.btn,{backgroundColor:COLORS.YELLOW,marginLeft: 10}]}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize:SIZES.L,color:COLORS.DARK}}>Recover</Text>
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