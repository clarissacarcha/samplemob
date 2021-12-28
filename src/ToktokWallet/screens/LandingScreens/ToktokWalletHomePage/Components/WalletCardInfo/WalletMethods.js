import React , {useContext} from 'react'
import {View,Text,StyleSheet,Dimensions,Image,TouchableOpacity,Alert} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {useThrottle} from 'src/hooks'
import { useDispatch } from 'react-redux'
import { useAccount } from 'toktokwallet/hooks'
import CONSTANTS from 'common/res/constants'
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS

const {height,width} = Dimensions.get("window")

const Method = ({icon,label,iconstyle,onPress})=> {

    return (
        <TouchableOpacity onPress={onPress} style={styles.walletMethod}>
                <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
                        <Image resizeMode="contain" style={{...iconstyle,flex: 1,marginTop: 10,}} source={icon} />
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.XS -1,height: 22}}>{label}</Text>
                </View>
        </TouchableOpacity>
    )
}

const WalletMethods = ()=> {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const {checkIfTpinIsSet,tokwaAccount} = useAccount();

    const onPress = (route)=> {
        
        const tpinIsSet = checkIfTpinIsSet();
        if(!tpinIsSet) return
    
        if(route === "ToktokWalletCashOutHomePage"){
            dispatch({
                type: "SET_TOKWA_EVENTS_REDIRECT",
                payload: {
                    event: "upgradeAccount",
                    value: false,
                }
            })
        }
        return navigation.navigate(route)
        
    }

    const onPressThrottled = useThrottle(onPress , 2000)

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Method label="Send Money" icon={require('toktokwallet/assets/images/transfer.png')} iconstyle={{height: 30,width: 30,}} onPress={()=>onPressThrottled("ToktokWalletSendMoney")}/>
                <Method label="Scan QR" icon={require('toktokwallet/assets/images/qr-code-scan.png')} iconstyle={{height: 25,width: 25}} onPress={()=>onPressThrottled("ToktokWalletScanQR")}/>
                <Method label="Cash In" icon={require('toktokwallet/assets/images/cash-in.png')} iconstyle={{height: 30,width: 30,marginBottom: 2}} onPress={()=>onPressThrottled("ToktokWalletPaymentOptions")}/>
                <Method label="Fund Transfer" icon={require('toktokwallet/assets/images/send-money.png')} iconstyle={{height: 30,width: 30,marginBottom: 2}} onPress={()=>onPressThrottled("ToktokWalletCashOutHomePage")}/>
                {/* <Method label="Request Money" icon={require('toktokwallet/assets/images/request-money.png')} iconstyle={{height: 30,width: 30,marginBottom: 2}} onPress={()=>onPressThrottled("ToktokWalletRequestMoney")}/> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        width: width,
        paddingHorizontal: 16,
    },
    content: {
        height:"100%",
        width:"100%",
        position:"absolute",
        top: -35,
        alignSelf:"center",
        backgroundColor:"white",
        borderRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 10,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:'center',
    },  
    walletMethod: {
        height: "100%",
        width: (width * 0.8) / 4,
        justifyContent:"center",
        alignItems:"center",
        zIndex: 99999
    }
})

export default WalletMethods