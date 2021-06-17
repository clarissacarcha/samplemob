import React, { useState } from 'react'
import {View,StyleSheet,ActivityIndicator,Text,TextInput,Alert,Image} from 'react-native'
import { YellowButton } from '../../../../../../revamp'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
import { Separator , DisabledButton } from '../../Components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_BDO_ENROLLMENT_RECORD} from '../../../../../../graphql/toktokwallet'
import {useLazyQuery} from '@apollo/react-hooks'
import { useAlert } from '../../../../../../hooks/useAlert'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { acc } from 'react-native-reanimated'

const RegisterAccount = ({rejected,provider})=> {

    const [accountNumber,setAccountNumber] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    const alert = useAlert();
    const navigation = useNavigation()

    const [getBdoEnrollmentRecord , {data, error ,loading}] = useLazyQuery(GET_BDO_ENROLLMENT_RECORD, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: ({getBdoEnrollmentRecord})=> {

            console.log(getBdoEnrollmentRecord)
         
            if(!getBdoEnrollmentRecord || getBdoEnrollmentRecord.status == 4){
                return navigation.navigate("ToktokWalletBDORegistration", {accountNumber: accountNumber,provider: provider})
            }

            if(getBdoEnrollmentRecord.status == 2 || getBdoEnrollmentRecord.status == 3){
                Alert.alert('',`Application status for gcash number ${getBdoEnrollmentRecord.accountNumber} is on pending`)
            }

            // // // create linking table if linking unlinking is allowed
            // if(getBdoEnrollmentRecord.status == 1){
            //     setShowLinkModal(true)
            // }

            // temporary solution for 1:1 BDO
            if(getBdoEnrollmentRecord.status == 1){
                setErrorMessage(`BDO account number ${getBdoEnrollmentRecord.accountNumber} already linked in a toktokwallet account`)
            }
        },
        onError: (error)=> {
            onErrorAlert({alert, error});
        }
    })

    const changeAccountNumber = (value)=> {
        const accountNumber = value.replace(/[^0-9]/g,"")
        if(accountNumber.length == 0){
            setErrorMessage("")
            setAccountNumber(accountNumber)
            return
       }

       if(accountNumber.length > 11){
            setErrorMessage("")
       }else{
            setErrorMessage("Account number must be valid.")
        }

        if(accountNumber.length > 12) return
        setAccountNumber(accountNumber)
      
    }

    const checkBDOAccount = ()=> {
        getBdoEnrollmentRecord({
            variables: {
                input: {
                    accountNumber: accountNumber
                }
            },
        })
    }

    return (
        <>
        <Separator/>
        <View style={styles.container}>
             
         <View style={styles.content}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>BDO Account Number</Text>
       
                <TextInput 
                        style={[styles.input, {fontFamily: FONT.REGULAR, borderWidth: 1, borderColor: errorMessage != "" ? COLOR.RED : "transparent"}]} 
                        placeholder="Enter your BDO account number here"
                        keyboardType="number-pad"
                        placeholderTextColor={COLOR.DARK}
                        value={accountNumber}
                        returnKeyType="done"
                        onChangeText={changeAccountNumber}
                />
                   <Text style={{fontFamily: FONT.REGULAR,color:COLOR.RED,fontSize: FONT_SIZE.S}}>{errorMessage}</Text>
     
                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S,marginTop: 1}}>Note: Make sure that account number is an existing BDO account.</Text>
                {
                    rejected && rejected.status == "4" &&  <View style={{marginTop: 20,}}>
                                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.RED}}>Your last application with account number {rejected.accountNumber} was rejected. Enter your existing BDO account number and click "Confirm" button to try again.</Text>
                                </View>
                }
               
            </View>
            <View style={styles.proceedBtn}>
                {
                    accountNumber.length == 0 || accountNumber.length > 0 && errorMessage != ""
                    ?  <DisabledButton label="Confirm"/>
                    :  <YellowButton label="Confirm" onPress={checkBDOAccount}/>
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
        fontFamily: FONT.REGULAR
    },
})

export default RegisterAccount