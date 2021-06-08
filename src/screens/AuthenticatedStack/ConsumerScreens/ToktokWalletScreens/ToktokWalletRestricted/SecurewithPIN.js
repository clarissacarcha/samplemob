import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import { FONTS, SIZES} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5' 
import { BlackButton, YellowButton } from '../../../../../revamp'

const SecurewithPIN = ({navigation,walletinfo})=> {

    return (
        <View style={styles.container}>
            <View style={{alignItems:"center",marginTop: 10,flex:1 ,}}>
                <View style={styles.lockIcon}>
                        <Image style={{height: 89,width: 89}} source={require('../../../../../assets/icons/walletVerify.png')}/>
                </View>
                <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.XL,marginTop: 20, textAlign:'center'}}>Setup your toktokwallet PIN</Text>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,marginTop: 5, textAlign:'center'}}>Click the "Set Up" button to create your toktokwallet PIN.</Text>
                <View style={{marginTop: 20}}>
                    <Text style={{fontFamily: FONTS.REGULAR,marginBottom: 1,fontSize: SIZES.S, textAlign:'center'}}><FIcon5 color="orange" name="check" />  Cashless transactions will be enabled after updating your PIN</Text>
                </View>
            </View>
            <View style={styles.btns}>
                <YellowButton label="Set Up" onPress={()=>navigation.replace("ToktokWalletCreatePin", {walletinfo})} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
        marginTop: 60,
        padding: 16,
    },
    lockIcon: {
        height: 160,
        width: 160,
        backgroundColor:"#FEEABA",
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center"
    },
    btns: {
        justifyContent:"flex-end",
        width: "100%"
    },

})


export default SecurewithPIN