import React, {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput} from 'react-native'
import {GET_GCASH_ACCOUNT} from '../../../../../../graphql';
import { useQuery } from '@apollo/react-hooks';
import {useSelector} from 'react-redux'
import { HeaderBack, YellowButton } from '../../../../../../revamp';
import {HeaderTitle, SomethingWentWrong} from '../../../../../../components'
import { COLORS, FONTS, SIZES } from '../../../../../../res/constants';
import { Separator } from '../../Components';
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert,onError} from '../../../../../../util/ErrorUtility'

//SELF IMPORTS
import CreateForm from './CreateForm'
import ViewForm from './ViewForm'

const ToktokWalletGcashRegistration = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLORS.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["GCash Account"]}/>
    })

    const mobile = route.params.mobile

    const session = useSelector(state=>state.session)

    const alert = useAlert()




    return (
       <>
       <Separator/>
       <View style={styles.container}>
            <CreateForm navigation={navigation} session={session} mobile={mobile}/>    
       </View>
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"white"
    },
})

export default ToktokWalletGcashRegistration