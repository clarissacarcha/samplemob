import React from 'react'
import {View,StyleSheet,ActivityIndicator,Text} from 'react-native'
import { COLOR } from '../../../../../../res/variables'
import { HeaderBack, HeaderTitle } from '../../../../../../revamp'
import { Separator } from '../../Components'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../graphql'
import { GET_CASH_OUT_ENROLLMENT_GCASH } from '../../../../../../graphql/toktokwallet'
import {useQuery} from '@apollo/react-hooks'

//SELF IMPORT
import RegisterMobile from "./RegisterMobile";

const ToktokWalletGcashHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["GCash"]} />
    })

    const {data,error,loading} = useQuery(GET_CASH_OUT_ENROLLMENT_GCASH, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
    })

    if(loading){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={24} color={COLOR.YELLOW} />
            </View>
    }

    if(error){
        return console.log(error)
    }

    if(!data.getCashOutEnrollmentGcash){
        return <RegisterMobile />
    }

    return (
        <>
        <Separator />
        <View style={styles.container}>
                <Text>{JSON.stringify(data.getCashOutEnrollmentGcash)}</Text>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    }
})

export default ToktokWalletGcashHomePage