import React , {useState} from 'react'
import {View,StyleSheet,ActivityIndicator,Text,TextInput,Alert} from 'react-native'
import { YellowButton } from '../../../../../../revamp'
import { FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
import { Separator } from '../../Components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_GCASH_ENROLLMENT_RECORD} from '../../../../../../graphql/toktokwallet'
import {useLazyQuery} from '@apollo/react-hooks'
import { useAlert } from '../../../../../../hooks/useAlert'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'

const RegisterMobile = ()=> {

    const [mobileNo,setMobileNo] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
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
            if(!getGcashEnrollmentRecord){
                return navigation.navigate("ToktokWalletGcashRegistration")
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
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>GCash Mobile Number</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter your GCash mobile number here"
                    keyboardType="number-pad"
                    value={mobileNo}
                    onChangeText={changeMobileNo}
                />
                <Text>{errorMessage}</Text>
            </View>
            <View style={styles.proceedBtn}>
                <YellowButton label="Confirm" onPress={checkGcashAccount}/>
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