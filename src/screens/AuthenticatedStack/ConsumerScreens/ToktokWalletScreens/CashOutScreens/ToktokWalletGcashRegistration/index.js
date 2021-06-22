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

    const session = useSelector(state=>state.session)

    const alert = useAlert()

    const {data , error , loading} = useQuery(GET_GCASH_ACCOUNT, {
        fetchPolicy: 'no-cache',
        variables: {
            input: {
                personId: session.user.person.id,
              },
        },
        onError: (error) => onErrorAlert({alert, error}),
    });

    if(loading){
        return null
    }

    if (error) {
        return <SomethingWentWrong />;
    }

    if(!data.getGCashAccount.record){
        return (
            <>
            <Separator/>
            <View style={styles.container}>
                    <CreateForm navigation={navigation} session={session}/>
            </View>
            </>
         )
    }

    if(data.getGCashAccount.record){
        return (
            <>
            <Separator/>
            <View style={styles.container}>
                    <ViewForm navigation={navigation} session={session} record={data.getGCashAccount.record}/>
            </View>
            </>
         )
    }




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
        padding: 16,
        backgroundColor:"white"
    },
})

export default ToktokWalletGcashRegistration