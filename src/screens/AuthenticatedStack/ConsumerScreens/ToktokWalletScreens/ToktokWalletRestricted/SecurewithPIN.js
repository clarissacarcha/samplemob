import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity,Dimensions} from 'react-native'
import { FONTS, SIZES} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5' 
import { BlackButton, ICON_SET, VectorIcon, YellowButton } from '../../../../../revamp'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables'
import {BuildingBottom} from '../Components'

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


const SecurewithPIN = ({navigation,walletinfo})=> {

    return (
        <View style={styles.container}>
            <View style={{alignItems:"center",marginTop: 10,flex:1 ,}}>
                <View style={styles.lockIcon}>
                        <Image style={{height: 89,width: 89}} source={require('../../../../../assets/icons/walletVerify.png')}/>
                </View>
                <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.XL,marginTop: 20, textAlign:'center'}}>Setup your toktokwallet PIN</Text>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,marginTop: 5, textAlign:'center'}}>Click the "Setup PIN" button to create your toktokwallet PIN.</Text>
                <View style={{marginTop: 20}}>
                    <Text style={{fontFamily: FONTS.REGULAR,marginBottom: 1,fontSize: SIZES.S, textAlign:'center'}}><FIcon5 color="orange" name="check" />  Cashless transactions will be enabled after updating your PIN</Text>
                </View>
            </View>
            <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{textAlign:"left",fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10,}}>Reminders</Text>
                        <View>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>Use a <Text style={{color: COLOR.YELLOW}}>secure</Text> PIN combination</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Remeber</Text> your PIN</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Never share</Text> your PIN with anyone</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>If you think your PIN is no longer a secret, </Text>      
                            </Reminder>
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M,marginLeft: 28}}><Text style={{color: COLOR.YELLOW}}>change your</Text> PIN immediately</Text>
                        </View>
                   
                </View>
            <View style={styles.btns}>
                <YellowButton label="Setup PIN" onPress={()=>navigation.replace("ToktokWalletCreatePin", {walletinfo})} />
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


export default SecurewithPIN