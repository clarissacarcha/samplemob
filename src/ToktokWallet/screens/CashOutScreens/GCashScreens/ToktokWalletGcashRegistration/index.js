import React, {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput} from 'react-native'
import {useSelector} from 'react-redux'
import { HeaderBack, YellowButton } from 'src/revamp';
import {HeaderTitle, SomethingWentWrong} from 'src/components'
import { Separator , CheckIdleState } from 'toktokwallet/components';
import {useAlert} from 'src/hooks/useAlert'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    CreateForm
} from "./Components"

const { COLOR } = CONSTANTS

export const ToktokWalletGcashRegistration = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["GCash Account"]}/>
    })

    const mobile = route.params.mobile
    const provider = route.params.provider

    const session = useSelector(state=>state.session)

    const alert = useAlert()




    return (
       <CheckIdleState>
       <Separator/>
       <View style={styles.container}>
            <CreateForm provider={provider} navigation={navigation} session={session} mobile={mobile}/>    
       </View>
       </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"white"
    },
})
