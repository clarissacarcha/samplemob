import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,ScrollView} from 'react-native'
import FIcon from 'react-native-vector-icons/Feather';
import {Separator} from 'toktokwallet/components';
import { HeaderBack , HeaderTitle} from 'src/revamp';
import {useSelector} from 'react-redux'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS
const SettingHeaderTitle = ({title})=> {
    return (
        <View style={{paddingHorizontal: 16, paddingVertical: 8,backgroundColor:"white"}}><Text style={{fontFamily:FONT.BOLD}}>{title}</Text></View>
    )
}

export const ToktokWalletSettings = ({navigation , route })=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Settings','']}/>,
    })
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    
    const SettingOption = ({route,params={},title})=> (
        <>
        <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route,params)}>
                    <View style={styles.name}>
                        <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{title}</Text>
                    </View>
                    <View style={styles.arrowright}>
                           {/* <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text> */}
                           <FIcon name="chevron-right" size={20} color={'#A6A8A9'}/> 
                    </View>
        </TouchableOpacity>
        <View style={styles.divider}/>
        </>
    )

    return (    
        <>
        <Separator />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <SettingHeaderTitle title="Manage Pin"/>
            <SettingOption route="ToktokWalletCreatePin" title="Change Pin"/>
            <Separator/>
            <SettingHeaderTitle title="Help centre"/>
            <SettingOption route="ToktokWalletPaymentChart" title="Payment Chart"/>
            <SettingOption route="ToktokWalletTransactionLimit" title="User Level and Transaction Limit"/>
            {
                +tokwaAccount.person.accountType.level < 3 &&
                <SettingOption route="ToktokWalletUpgradeAccount" title="Upgrade Account"/>
            }
            <Separator/>
            <SettingHeaderTitle title="Security and Privacy"/>
            <SettingOption route="ToktokWalletHelpCentreSecurityPrivacy" title="Security and Privacy"/>
            <SettingOption route="ToktokWalletTermsConditions" title="Terms and Conditions"/>
            <Separator/>
            <SettingHeaderTitle title="Logs"/>
            <SettingOption route="ToktokWalletCashInLogs" title="Cash In"/>
            <SettingOption route="ToktokWalletCashOutLogs" title="Cash Out"/>
        </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    settingoption: {
        padding: 16,
        paddingVertical: 15,
        flexDirection: "row",
        backgroundColor:"white"
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
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})