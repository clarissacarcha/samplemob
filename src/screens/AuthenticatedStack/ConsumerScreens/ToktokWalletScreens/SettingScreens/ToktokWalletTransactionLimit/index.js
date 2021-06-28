import React from 'react'
import {View,Text,StyleSheet,ActivityIndicator} from 'react-native'
import { COLOR } from '../../../../../../res/variables'
import { HeaderBack, HeaderTitle } from '../../../../../../revamp'
import { Separator } from '../../Components'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../graphql'
import { GET_ACCOUNT_TYPES } from '../../../../../../graphql/toktokwallet'
import {useQuery} from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useAlert} from '../../../../../../hooks'

const ToktokWalletTransactionLimit = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Transaction Limit','']}/>,
    })

    const alert = useAlert()

    const {data,error,loading} = useQuery(GET_ACCOUNT_TYPES, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        }
    })

    if(loading){
        return (
            <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                    <ActivityIndicator color={COLOR.YELLOW} size={24}/>
            </View>
        )
    }

    if(error){
        return null
    }

    console.log(data.getAccountTypes)

    return (
        <>
        <Separator/>
        <View style={styles.container}>

        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
    }
})

export default ToktokWalletTransactionLimit