import React , {useContext} from 'react'
import {View,Text,StyleSheet,Dimensions,Image,TouchableOpacity} from 'react-native'
import { COLORS, FONTS, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import {useNavigation} from '@react-navigation/native'
import {CheckWalletRestrictionContext} from './CheckWalletRestrictionProvider'

const {height,width} = Dimensions.get("window")

const Method = ({icon,label,iconstyle,onPress})=> {

    return (
        <TouchableOpacity onPress={onPress} style={styles.walletMethod}>
                <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
                        <Image resizeMode="contain" style={{...iconstyle,flex: 1,marginTop: 10,}} source={icon} />
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.XS,height: 22,color: COLORS.DARK}}>{label}</Text>
                </View>
        </TouchableOpacity>
    )
}

const WalletMethods = ({walletinfo , account })=> {

    const navigation = useNavigation()
    const {checkIfResctricted} = useContext(CheckWalletRestrictionContext)

    const onPress = (route)=> {
        if(!checkIfResctricted()){
            return navigation.navigate(route, {walletinfo , account})
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Method label="Send money" icon={require('../../../../../assets/toktokwallet-assets/transfer.png')} iconstyle={{height: 30,width: 30,}} onPress={()=>onPress("ToktokWalletSendMoney")}/>
                <Method label="Scan" icon={require('../../../../../assets/toktokwallet-assets/qr-code-scan.png')} iconstyle={{height: 25,width: 25}} onPress={()=>onPress("ToktokWalletScanQR")}/>
                <Method label="Cash in" icon={require('../../../../../assets/toktokwallet-assets/cash-in.png')} iconstyle={{height: 30,width: 30,marginBottom: 2}} onPress={()=>onPress("ToktokWalletPaymentOptions")}/>
                <Method label="Cash out" icon={require('../../../../../assets/toktokwallet-assets/send-money.png')} iconstyle={{height: 30,width: 30,marginBottom: 2}} onPress={()=>onPress("ToktokWalletCashOut")}/>
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
        width: (width * 0.9) / 4,
        justifyContent:"center",
        alignItems:"center",
        zIndex: 99999
    }
})

export default WalletMethods