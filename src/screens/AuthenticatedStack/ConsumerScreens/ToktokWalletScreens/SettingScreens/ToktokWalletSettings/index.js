import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image} from 'react-native'
import {HeaderBackClose, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import FIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS, FONT_LIGHT, FONT_MEDIUM, SIZES } from '../../../../../../res/constants';
import {Separator} from '../../Components';
import { HeaderBack } from '../../../../../../revamp';

const ToktokWalletSettings = ({navigation , route })=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLORS.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Settings','']}/>,
    })

    const walletinfo = route.params.walletinfo

    const SettingOption = ({route,params={},icon,title,subtitle})=> (
        <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route,params)}>
                    <View style={styles.logo}>
                         <Image source={icon} style={{height: 30, width: 30}} resizeMode="contain"/>
                    </View>
                    <View style={styles.name}>
                        <Text style={{fontSize:SIZES.M,fontFamily: FONTS.BOLD , color: COLORS.DARK}}>{title}</Text>
                        <Text style={{fontSize: SIZES.S, fontFamily: FONTS.REGULAR , color: COLORS.MEDIUM}}>{subtitle}</Text>
                    </View>
                    <View style={styles.arrowright}>
                           {/* <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text> */}
                           <FIcon name="chevron-right" size={20} color={'#A6A8A9'}/> 
                    </View>
        </TouchableOpacity>
    )

    return (    
        <>
        <Separator />
        <View style={styles.container}>
            <SettingOption route="ToktokWalletVerifySetup" params={{walletinfo: walletinfo}} icon={require('../../../../../../assets/icons/walletVerify.png')} title="Verify User" subtitle="Verify your toktokwallet."/>
            {
                walletinfo.isHold
                ? <SettingOption route="ToktokWalletRecoveryMethods" 
                                params={{walletinfo: walletinfo}} 
                                icon={require('../../../../../../assets/icons/walletPin.png')} 
                                title={'Recover PIN'} 
                                subtitle="reset your pincode"
                />
                :  <SettingOption route="ToktokWalletCreatePin" 
                                  params={{walletinfo: walletinfo}} 
                                  icon={require('../../../../../../assets/icons/walletPin.png')} 
                                  title={walletinfo.pincode != null ? "Change PIN" : "Create a PIN"} 
                                  subtitle="Keep your account secure."
                    />
            }  
            <SettingOption route="ToktokWalletCashInLogs" icon={require('../../../../../../assets/icons/walletCashinLog.png')} title="Cash In Logs" subtitle="View your cash in logs."/>
            <SettingOption route="ToktokWalletCashOutLogs" icon={require('../../../../../../assets/icons/walletCashinLog.png')} title="Cash Out Logs" subtitle="View your cash out logs."/>   
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    settingoption: {
        padding: 16,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: "#F4F4F4",
        flexDirection: "row"
    },
    logo: {
        flexBasis: 45,
        justifyContent: "center",
        alignItems: "flex-start"
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

export default ToktokWalletSettings