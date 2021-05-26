import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import {COLOR, DARK, FONT_MEDIUM, FONT_REGULAR, SIZES} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5' 
import { BlackButton } from '../../../../../revamp'

const SecurewithPIN = ({navigation,walletinfo})=> {

    return (
        <View style={styles.container}>
            <View style={{flex: 1,alignItems:"center"}}>
                <View style={styles.lockIcon}>
                        <Image style={{height: 40,width: 40}} source={require('../../../../../assets/icons/walletVerify.png')}/>
                </View>
                <Text style={{fontFamily: FONT_MEDIUM,fontSize: SIZES.XL,marginTop: 35}}>Setup your toktokwallet PIN</Text>
                <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.S,marginTop: 5}}>Click the "Set Up PIN" button to create your toktokwallet PIN.</Text>
                <View style={{marginTop: 20}}>
                    <Text style={{fontFamily: FONT_REGULAR,marginBottom: 1,fontSize: SIZES.S}}><FIcon5 color="orange" name="check" />  Cashless transactions will be enabled after updating your PIN</Text>
                </View>
            </View>
            <View style={styles.btns}>
                <BlackButton label="Set Up PIN" onPress={()=>navigation.replace("ToktokWalletCreatePin", {walletinfo})} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
        marginTop: 30,
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
        justifyContent:"flex-end",
        width: "100%"
    },

})


export default SecurewithPIN