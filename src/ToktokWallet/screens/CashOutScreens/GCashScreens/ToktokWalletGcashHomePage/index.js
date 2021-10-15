import React , {useEffect,useState} from 'react'
import {View,StyleSheet,ActivityIndicator,Text,Image} from 'react-native'
import { HeaderBack, HeaderTitle } from 'src/revamp'
import { Separator } from 'toktokwallet/components'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_CASH_OUT_ENROLLMENT_GCASH } from 'toktokwallet/graphql'
import {useQuery} from '@apollo/react-hooks'
import CONSTANTS from 'common/res/constants'

//SELF IMPORT
import {
    PendingEnrollment,
    RegisterMobile,
    SuccessfulModal,
    VerifiedAccount
} from "./Components"

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const MainComponent = ({children})=> {
    return (
        <>
         <Separator />
            <View style={styles.container}>
            <View style={styles.header}>
                        <Image resizeMode="contain" style={{height: 50,width: 60,alignSelf:"center"}} source={require('toktokwallet/assets/images/cash-out-providers/gcash.png')}/>
                        <View style={{justifyContent:"center",alignItems:"flex-start",marginLeft: 5,}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Register and verify</Text>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>your GCash account details.</Text>
                        </View>
            </View>
            {children}
        </View>
        </>
    )
}

export const ToktokWalletGcashHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["GCash"]}/>
    })

    const provider = route.params.provider
    const [modalSuccessVisible,setModalSuccessVisible] = useState(false)

    const {data,error,loading} = useQuery(GET_CASH_OUT_ENROLLMENT_GCASH, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
    })

    useEffect(()=>{
        if(route.params.successLink){
            setModalSuccessVisible(true)
        }
    },[])

    if(loading){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={24} color={COLOR.YELLOW} />
            </View>
    }
    
    if(error){
         console.log(error)
    }

    // check if theres pending enrollment 
    if(data.getCashOutEnrollmentGcash.pendingRecord && (data.getCashOutEnrollmentGcash.pendingRecord.status == "2" || data.getCashOutEnrollmentGcash.pendingRecord.status == "3")){
        return (
            <MainComponent>
                <PendingEnrollment record={data.getCashOutEnrollmentGcash.pendingRecord}/>
            </MainComponent>
        )
    }

    if(!data.getCashOutEnrollmentGcash.linkedGcash){
        return (
        <MainComponent>
            <RegisterMobile rejected={data.getCashOutEnrollmentGcash.pendingRecord} provider={provider}/>
        </MainComponent>
        )
    }

    // Linked and verified GCash Account
    return (
       <>
        <SuccessfulModal visible={modalSuccessVisible} setVisible={setModalSuccessVisible} provider={provider}/>
       <VerifiedAccount record={data.getCashOutEnrollmentGcash.linkedGcash.gcashEnrollmentRecord} provider={provider}/>
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    header: {
        height: 70,
        width: "100%",
        backgroundColor:"white",
        flexDirection:"row",
        padding: 16,
    }, 
})