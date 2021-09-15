import React from 'react'
import { View , Text ,StyleSheet , ActivityIndicator, TouchableOpacity } from 'react-native'
import { SomethingWentWrong } from 'src/components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_ACCOUNT_RECOVERY } from 'toktokwallet/graphql'
import { useQuery } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS

const AccountRecovery = ()=> {

    const navigation = useNavigation();

    const {data,error,loading} = useQuery(GET_ACCOUNT_RECOVERY,{
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    })
    

    if(error){
        return <SomethingWentWrong/>
    }

    if(loading){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size={24} color={COLOR.YELLOW} />
                </View>
    }

    const HelpCenter = ()=> navigation.navigate("ToktokWalletHelpCentreContactUs")
    const AccountRecovery = ()=> navigation.navigate("ToktokWalletAccountRecoverySetup")

    if(data?.getAccountRecovery){
        return <>
        <View style={{flex: 1,justifyContent:'flex-start',alignItems:'center',marginTop: 20}}>
            <TouchableOpacity onPress={HelpCenter} style={styles.container}>
                    <Text style={styles.label}>Help Center</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={AccountRecovery} style={styles.container}>
                    <Text style={styles.label}>Account Recovery</Text>
            </TouchableOpacity>
        </View>
        </>
    }

    return (
        <View style={{flex: 1,justifyContent:'flex-start',alignItems:'center',marginTop: 20}}>
            <TouchableOpacity onPress={HelpCenter} style={styles.container}>
                    <Text style={styles.label}>Help Center</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        alignItems:'center',
        marginVertical: 10
    },
    label: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.L,
        color: COLOR.ORANGE,
        textDecorationLine:"underline"
    }
})

export default AccountRecovery