import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image} from 'react-native'
import {HeaderBackClose, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../components'
import FIcon from 'react-native-vector-icons/Feather';
import { FONT_LIGHT, FONT_MEDIUM, SIZES } from '../../../../res/constants';

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
                        <Text style={{fontSize:SIZES.M,fontFamily: FONT_MEDIUM}}>{title}</Text>
                        <Text style={{fontSize: SIZES.S, fontFamily: FONT_LIGHT}}>{subtitle}</Text>
                    </View>
                    <View style={styles.arrowright}>
                           {/* <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text> */}
                           <FIcon name="chevron-right" size={16} color={'#A6A8A9'}/> 
                    </View>
        </TouchableOpacity>
    )

    return (    
        <View style={styles.container}>
            <SettingOption route="ToktokWalletVerifySetup" icon={require('../../../../assets/icons/walletVerify.png')} title="Verify User" subtitle="Verify your toktokwallet."/>
            {
                walletinfo.isHold
                ? <SettingOption route="ToktokWalletRecoveryMethods" 
                                params={{walletinfo: walletinfo}} 
                                icon={require('../../../../assets/icons/walletPin.png')} 
                                title={'Recover PIN'} 
                                subtitle="reset your pincode"
                />
                :  <SettingOption route="ToktokWalletCreatePin" 
                                  params={{walletinfo: walletinfo}} 
                                  icon={require('../../../../assets/icons/walletPin.png')} 
                                  title={walletinfo.pincode != null ? "Change PIN" : "Create a PIN"} 
                                  subtitle="Keep your account secure."
                    />
            }      
            <SettingOption route="ToktokWalletCashInLogs" icon={require('../../../../assets/icons/walletCashinLog.png')} title="Cash In Logs" subtitle="View your cash in logs."/>
            <SettingOption route="ToktokWalletCashOutLogs" icon={require('../../../../assets/icons/walletCashinLog.png')} title="Cash Out Logs" subtitle="View your cash out logs."/>
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
        paddingVertical: 15,
        // borderWidth: 0.2,
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