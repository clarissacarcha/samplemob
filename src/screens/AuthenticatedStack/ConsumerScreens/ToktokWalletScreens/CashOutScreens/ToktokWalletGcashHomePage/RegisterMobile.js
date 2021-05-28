import React , {useState} from 'react'
import {View,StyleSheet,ActivityIndicator,Text,TextInput,Alert,Image} from 'react-native'
import { YellowButton } from '../../../../../../revamp'
import { FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
import { DisabledButton, Separator } from '../../Components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_GCASH_ENROLLMENT_RECORD} from '../../../../../../graphql/toktokwallet'
import {useLazyQuery} from '@apollo/react-hooks'
import { useAlert } from '../../../../../../hooks/useAlert'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'

//SELF IMPORTS
import ModalLinkMobile from "./ModalLinkMobile";

const RegisterMobile = ({provider})=> {

    const [mobileNo,setMobileNo] = useState("")
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

        if(mobile.length > 10 && mobile.slice(0,2) == "09"){
            setErrorMessage("")
        }else{
            setErrorMessage("Please enter a valid mobile number.")
        }

        if(mobile.length > 11) return
    
        if(value[0] == "9"){
            setMobileNo("09")
        }else{
            setMobileNo(mobile)
        }
       
    }

    const [getGcashEnrollmentRecord , {data, error ,loading}] = useLazyQuery(GET_GCASH_ENROLLMENT_RECORD, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: ({getGcashEnrollmentRecord})=> {
            console.log(getGcashEnrollmentRecord)

         
            if(!getGcashEnrollmentRecord || getGcashEnrollmentRecord.status == 4){
                return navigation.navigate("ToktokWalletGcashRegistration", {mobile: mobileNo,provider: provider})
            }

            if(getGcashEnrollmentRecord.status == 2 || getGcashEnrollmentRecord.status == 3){
                Alert.alert('',`Application status for gcash number ${getGcashEnrollmentRecord.mobile} is on pending`)
            }

            if(getGcashEnrollmentRecord.status == 1){
                setShowLinkModal(true)
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
                    mobile: mobileNo
                }
            },
        })
    }


    return (
        <>
        <Separator />
        <ModalLinkMobile visible={showLinkModal} setVisible={setShowLinkModal} mobile={mobileNo} provider={provider}/>
        {/* <View style={styles.header}>
                    <Image resizeMode="contain" style={{height: 50,width: 60,alignSelf:"center"}} source={require('../../../../../../assets/toktokwallet-assets/cash-out-providers/gcash.png')}/>
                    <View style={{justifyContent:"center",alignItems:"flex-start",marginLeft: 5,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Register and verify</Text>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>your GCash account details.</Text>
                    </View>
            </View> */}

        <View style={styles.container}>
          
            <View style={styles.content}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Mobile Number</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter your GCash mobile number here"
                    keyboardType="number-pad"
                    value={mobileNo}
                    onChangeText={changeMobileNo}
                />
                <Text style={{fontFamily: FONT.REGULAR,color:"red",fontSize: FONT_SIZE.S}}>{errorMessage}</Text>
                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Note: Make sure that number is existing GCash account.</Text>
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
        height: SIZE.BUTTON_HEIGHT,
        width: "100%",
        justifyContent:"flex-end"
    },
    input: {
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontSize: SIZE.M,
        fontFamily: FONT.REGULAR
    },
})

export default RegisterMobile