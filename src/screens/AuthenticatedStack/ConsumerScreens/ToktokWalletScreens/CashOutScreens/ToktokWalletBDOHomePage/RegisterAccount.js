import React, { useState } from 'react'
import {View,StyleSheet,ActivityIndicator,Text,TextInput,Alert,Image} from 'react-native'
import { YellowButton } from '../../../../../../revamp'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
import { Separator , DisabledButton } from '../../Components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_GCASH_ENROLLMENT_RECORD} from '../../../../../../graphql/toktokwallet'
import {useLazyQuery} from '@apollo/react-hooks'
import { useAlert } from '../../../../../../hooks/useAlert'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'
import { useSelector } from 'react-redux'

const RegisterAccount = ({rejected,provider})=> {

    const [accountNumber,setAccountNumber] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    const alert = useAlert();
    const navigation = useNavigation()

    const changeAccountNumber = (val)=> {
        setAccountNumber(val)
    }

    const checkBDOAccount = ()=> {

    }

    return (
        <>
        <Separator/>
        <View style={styles.container}>
             
         <View style={styles.content}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>BDO Account Number</Text>
       
                <TextInput 
                        style={[styles.input]} 
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
                                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.RED}}>Your last application with account number {rejected.mobile} was rejected. Enter your existing BDO account number and click "Confirm" button to try again.</Text>
                                </View>
                }
               
            </View>
            <View style={styles.proceedBtn}>
                {
                    accountNumber == ""
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