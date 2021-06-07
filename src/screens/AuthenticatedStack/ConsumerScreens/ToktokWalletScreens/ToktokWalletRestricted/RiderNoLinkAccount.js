import React , {useState} from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity,TextInput} from 'react-native'
import { YellowButton, VectorIcon , ICON_SET  } from '../../../../../revamp'
import { COLOR , FONT_SIZE , FONT , SIZE } from '../../../../../res/variables'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../graphql'
import { GET_CHECK_ACCOUNT } from '../../../../../graphql/toktokwallet'
import { useLazyQuery } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../hooks'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { DisabledButton } from '../Components'


const RiderNoLinkAccount = ()=> {

    const [mobileNo,setMobileNo] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    const alert = useAlert()
    const navigation = useNavigation()
    const session = useSelector(state=>state.session)

    const [getCheckAccount, {data ,error ,loading}] = useLazyQuery(GET_CHECK_ACCOUNT, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onCompleted: ({getCheckAccount})=> {
            setMobileNo("")
            setErrorMessage("")
            navigation.navigate("ToktokWalletLinkAccount", {tokwaAccount: getCheckAccount})
        },
        onError: (error)=> {
            // onErrorAlert({alert,error})
            if(error.graphQLErrors.length > 0){
                error.graphQLErrors.map((err)=> {
                    setErrorMessage("toktokwallet account does not exist")
                })
                return
            }

            onErrorAlert({alert,error})

        }
    })

    const checkTokwaAccount = ()=>{
        getCheckAccount({
            variables:{
                input: {
                    mobileNumber: mobileNo,
                    motherReferenceNumber: session.user.id,
                }
            }
        })
    }

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
            setErrorMessage("Mobile number must be valid.")
        }

        if(mobile.length > 11) return
    
        if(value[0] == "9"){
            setMobileNo("09")
        }else{
            setMobileNo(mobile)
        }
       
    }

    return (
        <>
             <View style={styles.content}>
                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>Enter mobile number</Text>
                <TextInput 
                        style={[styles.input, {borderWidth: 1, borderColor: errorMessage != "" ? COLOR.RED : "transparent"}]} 
                        placeholder="Enter your toktokwallet mobile number"
                        keyboardType="number-pad"
                        placeholderTextColor={COLOR.DARK}
                        value={mobileNo}
                        onChangeText={changeMobileNo}
                />
                <Text style={{fontFamily: FONT.REGULAR,color:COLOR.RED,fontSize: FONT_SIZE.S}}>{errorMessage}</Text>
            </View>

            <View style={{height: 120,padding: 16,justifyContent:'flex-end'}}>
                {
                    mobileNo.length == 11
                    ? <YellowButton label="Link Now" onPress={checkTokwaAccount}/>
                    : <DisabledButton label="Link Now"/>
                }
                
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
    },
    verifyWalletText: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        textAlign:'center'
    },
    clickVerifyText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        textAlign:'center'
    },
    listItem: {
        fontFamily: FONT.REGULAR,
        marginBottom: 5,
        fontSize: FONT_SIZE.S,
        textAlign:'left'
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    }
})


export default RiderNoLinkAccount