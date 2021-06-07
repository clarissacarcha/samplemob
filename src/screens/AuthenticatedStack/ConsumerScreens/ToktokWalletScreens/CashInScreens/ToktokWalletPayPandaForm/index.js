import React, {useState,useRef,useEffect,useMemo} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,Modal,TextInput,Platform,KeyboardAvoidingView,ActivityIndicator,Alert,Dimensions,ScrollView,Keyboard} from 'react-native'
import {FONT ,FONT_SIZE , COLOR} from '../../../../../../res/variables'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {useSelector} from 'react-redux'
import {useMutation,useLazyQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {POST_CASH_IN_PAYPANDA_REQUEST} from '../../../../../../graphql/toktokwallet'
import {onError,onErrorAlert} from '../../../../../../util/ErrorUtility';
import {numberFormat} from '../../../../../../helper'
import {useAlert} from '../../../../../../hooks/useAlert'
import { HeaderBack, YellowButton, HeaderTitle } from '../../../../../../revamp'

import {
    ConfirmBottomSheet,
    DisabledButton,
    Separator
} from '../../Components'

//SELF IMPORTS
import ConfirmModalContent from './ConfirmModalContent'
import { AlertOverlay } from '../../../../../../components'

const {height,width} = Dimensions.get("window")


const ToktokWalletPayPandaForm = ({navigation,route})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In','']}/>,
    })

    const alert = useAlert()

    const transactionType = route.params.transactionType
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const globalsettings = useSelector(state=>state.constants)
    const [amount,setAmount] = useState("")
    const [message,setMessage] = useState("")
    const [recipientDetails,setRecipientDetails] = useState(null)
    const [disablebtn,setDisablebtn] = useState(false)
    const [maxLimitMessage,setMaxLimitMessage] = useState("")


    const [postCashInPayPandaRequest , {data,error,loading}] = useMutation(POST_CASH_IN_PAYPANDA_REQUEST , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            console.log(error)
            onErrorAlert({alert,error})
            navigation.pop()
        },
        onCompleted: ({postCashInPayPandaRequest})=>{
            console.log(postCashInPayPandaRequest)
            navigation.navigate("ToktokWalletPayPandaWebView", {
                merchantId: postCashInPayPandaRequest.merchantId,
                refNo: postCashInPayPandaRequest.refNo,
                signature: postCashInPayPandaRequest.signature,
                email_address: tokwaAccount.person.emailAddress,
                payer_name: `${tokwaAccount.person.firstName}${tokwaAccount.person.middleName ? " " + tokwaAccount.person.middleName : ""} ${tokwaAccount.person.lastName}`,
                mobile_number: tokwaAccount.mobileNumber,
                amount_to_pay: amount,
                currency: tokwaAccount.wallet.currency.code,
                walletId: tokwaAccount.wallet.id,
                transactionTypeId: transactionType.id
            })
        }
    })


    const proceedToPaypandaPortal = ()=> {
      postCashInPayPandaRequest({
          variables: {
              input: {
                  provider: transactionType.id,
                  amount: +amount,
                  currencyId: tokwaAccount.wallet.currency.id,
                  walletId: tokwaAccount.wallet.id,
              }
          }
      })
    }

    const confirmAmount = ()=> {
        // Keyboard.dismiss()
        navigation.navigate("ToktokWalletReviewAndConfirm", {
            label:"Cash In" , 
            data: {
                    method: "PayPanda" , 
                    amount: amount
                },
            onConfirm: proceedToPaypandaPortal,
        })
    }

    const changeAmountText = (value)=> {
        setMaxLimitMessage("")
        const num = value.replace(/[^0-9.]/g, '')
        const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
        if(!checkFormat) return       
        if(num.length > 8) return
       
        // setAmount(num * 0.01)
        if(num[0] == ".") return setAmount("0.")
        setAmount(num)
        if(num == "") return setMessage("")
        if(num < 1){
           return setMessage(`Please enter atleast ${tokwaAccount.wallet.currency.code} 1.00`)
        }
        // checkRecipientWalletLimitation(num * 0.01)
        setDisablebtn(false)
        setMessage("")
        
    }

    useEffect(()=>{
        console.log(amount)
    },[amount])

    return (
      <>
    <AlertOverlay visible={loading} />
      <Separator />
       <View  
            // keyboardVerticalOffset={Platform.OS == "ios" ? 90 : 90} 
            // keyboardVerticalOffset={90} 
            // behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >

            <View style={styles.paypandaLogo}>
                     <Image style={{height: 90,width: 90,alignSelf: "center",marginBottom: 10}} source={require('../../../../../../assets/toktokwallet-assets/paypanda.png')}/>
                     <Text style={{fontSize: FONT_SIZE.L,fontFamily: FONT.BOLD}}>PayPanda</Text>
                     <Text style={{fontSize: FONT_SIZE.M ,fontFamily: FONT.BOLD}}>Please enter amount to Cash in</Text>
            </View>

            <View style={styles.content}>
          
            {
                !loading
                ? <View style={styles.amountcontent}>
                        <View style={{flexDirection: "row"}}>
                            <TextInput
                                    caretHidden
                                    value={amount}
                                    style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    onChangeText={changeAmountText}
                            />
                            <View style={styles.input}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: 32,marginRight: 10,color:COLOR.YELLOW}}>{tokwaAccount.wallet.currency.code}</Text>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: 32}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                                {/* <FIcon5 name="pen" style={{alignSelf:"center",marginLeft: 20}} size={20} color={COLOR.DARK}/> */}
                            </View>
                            
                        </View>
                        { message != "" && <Text style={{fontFamily: FONT.REGULAR, color: "red", marginTop: -10,marginBottom: 10, fontSize: FONT_SIZE.S}}>{message}</Text>}
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Current Balance {tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance)}</Text>
                      
                        <Text style={{fontFamily: FONT.REGULAR, color: "red",marginTop: 5,fontSize: FONT_SIZE.S}}>{maxLimitMessage}</Text>
              
                 </View>
                : <View style={{flex: 1,justifyContent: "center",alignItems: "center"}}><ActivityIndicator size={50}/></View>
                
            }
          
            <View style={styles.cashinbutton}>
                    {
                        (amount < 1 || amount > transactionType.cashInLimit || disablebtn)
                        ? <DisabledButton label="Cash In"/>
                        : <YellowButton label="Cash In" onPress={confirmAmount}/>
                    }
            </View>
        </View>
       </View>


       </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 16,
    }, 
    paypandaLogo: {
        width: "100%",
        justifyContent:"center",
        alignItems:"center",
        marginTop: 30,
    },
    amountcontent: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 30,
        // width:width * 0.7,
        // alignSelf:"center"
    },
    cashinbutton: {
        height: 50,
        width: "100%",
    },
    input: {
        marginHorizontal: 20,
        borderRadius: 5,
        height: 60,
        // flexShrink: 1,
        // // flexGrow: 1,
        flex: 1,
        width: 150,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row"
      },
})

export default ToktokWalletPayPandaForm