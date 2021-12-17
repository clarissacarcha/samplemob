import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity,Dimensions} from 'react-native'
import { BlackButton, ICON_SET, VectorIcon, YellowButton } from 'src/revamp'
import {BuildingBottom} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const {width,height} = Dimensions.get("window")

const Reminder = ({children})=> {
    return (
        <View style={{flexDirection: "row",marginVertical: 5}}>
            <View style={{padding: 2, borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                <VectorIcon size={12} iconSet={ICON_SET.Feather} name="check"/>
            </View>
           {children}
    </View>
    )
}


export const SecureWithMPIN = ({navigation,walletinfo})=> {

    return (
        <View style={styles.container}>
            <View style={{alignItems:"center",marginTop: 10,flex:1 ,}}>
                <View style={styles.lockIcon}>
                        <Image style={{height: 89,width: 89}} source={require('toktokwallet/assets/icons/walletVerify.png')}/>
                </View>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.XL,marginTop: 20, textAlign:'center'}}>Set Up your toktokwallet MPIN</Text>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,marginTop: 5, textAlign:'center'}}>Click the "Set Up MPIN" button to create your toktokwallet MPIN.</Text>
            </View>
            <View style={{flex: 1,alignItems:"center",justifyContent:"flex-start"}}>
                        <Text style={{textAlign:"left",fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10,}}>Reminders</Text>
                        <View>
                            {/* <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.ORANGE}}>Cashless transactions</Text> will be enabled after</Text>
                            </Reminder>
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M,marginLeft: 28}}>updating your MPIN</Text>
                            */}
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>Use a <Text style={{color: COLOR.ORANGE}}>secure</Text> MPIN combination</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.ORANGE}}>Remember</Text> your MPIN</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.ORANGE}}>Never share</Text> your MPIN with anyone</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>If you think your MPIN is no longer a secret, </Text>      
                            </Reminder>
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M,marginLeft: 28}}><Text style={{color: COLOR.ORANGE}}>change your</Text> MPIN immediately</Text>
                        </View>
                   
                </View>
            <View style={styles.btns}>
                <YellowButton label="Set Up MPIN" onPress={()=>navigation.push("ToktokWalletMPINCreate", {walletinfo})} />
            </View>
           <BuildingBottom/>
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
