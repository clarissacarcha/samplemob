import React , {useState} from 'react'
import {View,StyleSheet,ActivityIndicator,Text,TextInput,Alert,Image} from 'react-native'
import { YellowButton } from 'src/revamp'
import { DisabledButton, Separator } from 'toktokwallet/components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_GCASH_ENROLLMENT_RECORD} from 'toktokwallet/graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import { useAlert } from 'src/hooks/useAlert'
import { onErrorAlert } from 'src/util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { AlertOverlay } from 'src/components'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import ModalLinkMobile from "./ModalLinkMobile";

const { FONT_FAMILY: FONT , FONT_SIZE , SIZE , COLOR } = CONSTANTS

export const RegisterMobile = ({provider,rejected})=> {

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [mobileNo,setMobileNo] = useState(tokwaAccount.mobileNumber.replace("+639",""))
    const [errorMessage,setErrorMessage] = useState("")
    const [showLinkModal,setShowLinkModal] = useState(false)
    const alert = useAlert();
    const navigation = useNavigation()

    const changeMobileNo = (value)=> {
        const mobile = value.replace(/[^0-9]/g,"")

        if(mobile.length == 0){
             setErrorMessage("")
             setMobileNo(mobile)
             return
        }

        if(mobile.length > 8){
            setErrorMessage("")
        }else{
            setErrorMessage("Mobile number must be valid.")
        }
        if(mobile.length > 9) return

        setMobileNo(mobile)
       
    }

    const [getGcashEnrollmentRecord , {data, error ,loading}] = useLazyQuery(GET_GCASH_ENROLLMENT_RECORD, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: ({getGcashEnrollmentRecord})=> {
         
            if(!getGcashEnrollmentRecord || getGcashEnrollmentRecord.status == 4){
                return navigation.navigate("ToktokWalletGcashRegistration", {mobile: mobileNo,provider: provider})
            }

            if(getGcashEnrollmentRecord.status == 2 || getGcashEnrollmentRecord.status == 3){
                Alert.alert('',`Application status for gcash number ${getGcashEnrollmentRecord.mobile} is on pending`)
            }

            // // // create linking table if linking unlinking is allowed
            // if(getGcashEnrollmentRecord.status == 1){
            //     return setShowLinkModal(true)
            // }
            // temporary solution for 1:1 Gcash
            if(getGcashEnrollmentRecord.status == 1){
                return setErrorMessage(`GCash number ${getGcashEnrollmentRecord.mobile} already linked in a toktokwallet account`)
            }
        },
        onError: (error)=> {
            onErrorAlert({alert, error});
        }
    })

    const checkGcashAccount = ()=> {
        if(mobileNo == "") return Alert.alert("","Mobile number is required")
        getGcashEnrollmentRecord({
            variables: {
                input: {
                    mobile: `09${mobileNo}`
                }
            },
        })
    }


    return (
        <>
        <AlertOverlay visible={loading} />
        <Separator />
        <ModalLinkMobile visible={showLinkModal} setVisible={setShowLinkModal} mobile={mobileNo} provider={provider}/>

        <View style={styles.container}>
          
            <View style={styles.content}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Mobile Number</Text>
                 <View style={{flexDirection:"row",alignItems:"center",width:"100%"}}>
                   <View style={{ backgroundColor:'lightgray', borderTopLeftRadius: SIZE.BORDER_RADIUS,borderBottomLeftRadius: SIZE.BORDER_RADIUS,justifyContent:"center",alignItems:"center", height: SIZE.FORM_HEIGHT,paddingHorizontal: 10,marginTop: 5}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,paddingBottom: 2.5}}>09</Text>
                </View>
                <TextInput 
                        style={[styles.input, {fontSize: FONT_SIZE.L + 1,fontFamily: FONT.REGULAR, flex: 1,borderTopLeftRadius: 0,borderBottomLeftRadius: 0, borderWidth: 1, borderColor: errorMessage != "" ? COLOR.RED : "transparent"}]} 
                        placeholder="00-000-0000"
                        keyboardType="number-pad"
                        placeholderTextColor={COLOR.DARK}
                        value={mobileNo}
                        returnKeyType="done"
                        onChangeText={changeMobileNo}
                />
                </View>
                <Text style={{fontFamily: FONT.REGULAR,color:COLOR.RED,fontSize: FONT_SIZE.S}}>{errorMessage}</Text>
                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S,marginTop: 1}}>Note: Make sure that number is an existing GCash account.</Text>
                {
                    rejected && rejected.status == "4" &&  <View style={{marginTop: 20,}}>
                                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.RED}}>Your last application with mobile number {rejected.mobile} was rejected. Enter your existing GCash mobile number and click "Confirm" button to try again.</Text>
                                </View>
                }
               
            </View>
            <View style={styles.proceedBtn}>
                {
                    mobileNo.length == 0 || mobileNo.length > 0 && errorMessage != ""
                    ?  <DisabledButton label="Confirm"/>
                    :  <YellowButton label="Confirm" onPress={checkGcashAccount}/>
                }
               
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
    },
    content: {
        flex: 1,
    },
    header: {
        height: 70,
        width: "100%",
        backgroundColor:"white",
        marginBottom: 10,
        flexDirection:"row",
        padding: 16
    },  
    proceedBtn: {
        height: SIZE.FORM_HEIGHT,
        width: "100%",
        justifyContent:"flex-end"
    },
    input: {
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR
    },
})
