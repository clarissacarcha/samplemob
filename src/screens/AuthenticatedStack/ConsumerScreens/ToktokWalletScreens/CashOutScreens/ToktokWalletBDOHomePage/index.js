import React , {useState,useEffect} from 'react'
import {View,StyleSheet,ActivityIndicator,Text,Image} from 'react-native'
import { COLOR , FONT , FONT_SIZE } from '../../../../../../res/variables'
import { HeaderBack, HeaderTitle } from '../../../../../../revamp'
import { Separator } from '../../Components'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../graphql'
import { GET_CASH_OUT_ENROLLMENT_BDO } from '../../../../../../graphql/toktokwallet'
import {useQuery} from '@apollo/react-hooks'

//SELF IMPORTS
import PendingEnrollment from './PendingEnrollment';
import RegisterAccount from './RegisterAccount';
import VerifiedAccount from './VerifiedAccount';
import SuccessfulModal from "../ToktokWalletBDOLinkAccount/SuccessfulModal";

const MainComponent = ({children})=> {
    return (
        <>
         <Separator />
            <View style={styles.container}>
            <View style={styles.header}>
                        <Image resizeMode="contain" style={{height: 50,width: 60,alignSelf:"center"}} source={require('../../../../../../assets/toktokwallet-assets/cash-out-providers/bdo.png')}/>
                        <View style={{justifyContent:"center",alignItems:"flex-start",marginLeft: 10,}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Register and verify</Text>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>your BDO account details.</Text>
                        </View>
            </View>
            {children}
        </View>
        </>
    )
}

const ToktokWalletBDOHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["BDO"]}/>
    })

    const provider = route.params.provider
    const [modalSuccessVisible,setModalSuccessVisible] = useState(false)
    
    const {data,error,loading} = useQuery(GET_CASH_OUT_ENROLLMENT_BDO, {
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
    if(data.getCashOutEnrollmentBdo.pendingRecord && (data.getCashOutEnrollmentBdo.pendingRecord.status == "2" || data.getCashOutEnrollmentBdo.pendingRecord.status == "3")){
        return (
            <MainComponent>
                {/* <PendingEnrollment record={data.getCashOutEnrollmentGcash.pendingRecord}/> */}
                <PendingEnrollment record={data.getCashOutEnrollmentBdo.pendingRecord}/>
            </MainComponent>
        )
    }

    if(!data.getCashOutEnrollmentBdo.linkedBDO){
        return (
        <MainComponent>
            {/* <RegisterMobile rejected={data.getCashOutEnrollmentGcash.pendingRecord} provider={provider}/> */}
            <RegisterAccount rejected={data.getCashOutEnrollmentBdo.pendingRecord} provider={provider}/>
        </MainComponent>
        )
    }

       // Linked and verified BDO Account
       return (
        <>
          <SuccessfulModal visible={modalSuccessVisible} setVisible={setModalSuccessVisible} provider={provider}/>
         <VerifiedAccount record={data.getCashOutEnrollmentBdo.linkedBDO.bdoEnrollmentRecord} provider={provider}/>
        </>
     )

   

   return (
       <>
        <MainComponent>
                <Text>{JSON.stringify(provider)}</Text>
        </MainComponent>
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


export default ToktokWalletBDOHomePage