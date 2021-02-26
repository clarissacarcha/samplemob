import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../components'

const Settings = ({navigation})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['Settings','']}/>,
    })

    const SettingOption = ({route,icon,title,subtitle})=> (
        <TouchableOpacity style={styles.settingoption} onPress={()=>navigation.navigate(route)}>
                    <View style={styles.logo}>
                         <Image source={icon} style={{height: 30, width: 30}} resizeMode="contain"/>
                    </View>
                    <View style={styles.name}>
                        <Text style={{fontSize:16}}>{title}</Text>
                        <Text style={{fontSize: 12, color: "gray"}}>{subtitle}</Text>
                    </View>
                    <View style={styles.arrowright}>
                           <Text style={{fontSize: 16,color: "gray"}}>{'>'}</Text>
                    </View>
        </TouchableOpacity>
    )

    return (    
        <View style={styles.container}>
            <SettingOption route="TokTokWalletCashInLogs" icon={require('../../../../assets/icons/walletCashinLog.png')} title="Cash in logs" subtitle="View your cash in logs"/>
            <SettingOption route="TokTokWalletVerifyUser" icon={require('../../../../assets/icons/walletVerify.png')} title="Verify User" subtitle="Verify your toktok wallet"/>
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
        borderWidth: 0.5,
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