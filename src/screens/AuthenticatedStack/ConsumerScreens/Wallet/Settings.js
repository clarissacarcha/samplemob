import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image} from 'react-native'
import {HeaderBackClose, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../components'
import FIcon from 'react-native-vector-icons/Feather';
import { FONT_LIGHT, FONT_MEDIUM } from '../../../../res/constants';

const Settings = ({navigation , route })=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose/>,
        headerTitle: ()=> <HeaderTitle label={['Settings','']}/>,
    })

    const walletinfo = route.params.walletinfo

    const SettingOption = ({route,params={},icon,title,subtitle})=> (
        <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route,params)}>
                    <View style={styles.logo}>
                         <Image source={icon} style={{height: 30, width: 30}} resizeMode="contain"/>
                    </View>
                    <View style={styles.name}>
                        <Text style={{fontSize:14,fontFamily: FONT_MEDIUM}}>{title}</Text>
                        <Text style={{fontSize: 12, fontFamily: FONT_LIGHT}}>{subtitle}</Text>
                    </View>
                    <View style={styles.arrowright}>
                           {/* <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text> */}
                           <FIcon name="chevron-right" size={16} color={'#A6A8A9'}/> 
                    </View>
        </TouchableOpacity>
    )

    return (    
        <View style={styles.container}>
            <SettingOption route="TokTokWalletVerifyUser" icon={require('../../../../assets/icons/walletVerify.png')} title="Verify User" subtitle="Verify your toktok wallet"/>
            <SettingOption route="TokTokWalletSettingsPinCode" params={{walletinfo: walletinfo}} icon={require('../../../../assets/icons/walletPin.png')} title={walletinfo.pincode != null ? "Change PIN" : "Create a PIN"} subtitle="keep your account secure"/>
            <SettingOption route="TokTokWalletCashInLogs" icon={require('../../../../assets/icons/walletCashinLog.png')} title="Cash in logs" subtitle="View your cash in logs"/>
            {/* {
                walletinfo.isVerified ? <>
                    <SettingOption route={walletinfo.pincode != null ? "TokTokWalletSettingsChangePIN" : "TokTokWalletSettingsCreatePIN"} icon={require('../../../../assets/icons/walletPin.png')} title={walletinfo.pincode != null ? "Change PIN" : "Create a PIN"} subtitle="keep your account secure"/>
                    <SettingOption route="TokTokWalletCashInLogs" icon={require('../../../../assets/icons/walletCashinLog.png')} title="Cash in logs" subtitle="View your cash in logs"/>
                </> : null
            } */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    settingoption: {
        padding: 10,
        paddingVertical: 20,
        borderWidth: 0.2,
        borderColor: "silver",
        flexDirection: "row"
    },
    logo: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    name: {
        flex: 1,
        justifyContent: "space-evenly"
    },
    arrowright: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "flex-end"
    }
})

export default Settings