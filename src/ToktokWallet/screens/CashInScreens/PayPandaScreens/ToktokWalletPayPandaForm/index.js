import React, {useState,useRef,useEffect,useMemo} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,Modal,TextInput,Platform,KeyboardAvoidingView,ActivityIndicator,Alert,Dimensions,ScrollView,Keyboard} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {useSelector} from 'react-redux'
import {useMutation,useLazyQuery,useQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {POST_CASH_IN_PAYPANDA_REQUEST,GET_GLOBAL_SETTINGS,POST_REQUEST_CASH_IN} from 'toktokwallet/graphql'
import {onError,onErrorAlert} from 'src/util/ErrorUtility';
import {numberFormat} from 'toktokwallet/helper'
import { useAlert } from 'src/hooks'
import { HeaderBack, YellowButton, HeaderTitle } from 'src/revamp'
import { AlertOverlay } from 'src/components'
import { CheckIdleState } from 'toktokwallet/components'
import { TransactionUtility } from 'toktokwallet/util/TransactionUtility'
import {
    DisabledButton,
    Separator,
    EnterPinCode
} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'


const {COLOR , FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS


const {height,width} = Dimensions.get("window")

export const ToktokWalletPayPandaForm = ({navigation,route})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In','']}/>,
    })

    const cashInAmount = route.params.amount
    const onCashIn = route.params.onCashIn
    const alert = useAlert()
    const transactionType = route.params.transactionType
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const globalsettings = useSelector(state=>state.constants)
    const [amount,setAmount] = useState(cashInAmount ? cashInAmount : "")
    const [message,setMessage] = useState("")
    const [recipientDetails,setRecipientDetails] = useState(null)
    const [disablebtn,setDisablebtn] = useState(false)
    const [maxLimitMessage,setMaxLimitMessage] = useState("")

    const [postRequestCashIn] = useMutation(POST_REQUEST_CASH_IN, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postRequestCashIn})=>{
            return navigation.navigate("ToktokWalletTPINValidator", {
                callBackFunc: proceedToPaypandaPortal,
            })
        },
        onError: (error) => onErrorAlert({alert,error})
    })

    const [postCashInPayPandaRequest , {data,error,loading}] = useMutation(POST_CASH_IN_PAYPANDA_REQUEST , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                alert,
                onErrorAlert,
            })
        },
        onCompleted: ({postCashInPayPandaRequest})=>{
            navigation.pop(); // remove TPIN/OTP Validator Screen;
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
                transactionTypeId: transactionType.id,
                paypandaTransactionUrl: postCashInPayPandaRequest.paypandaTransactionEntryEndpoint,
                paypandaReturnUrl: postCashInPayPandaRequest.paypandaReturnUrlEndpoint,
                paypandaStaginReturnUrl: postCashInPayPandaRequest.paypandaReturUrlStagingEndpoint,
                cashInAmount: cashInAmount,
                onCashIn: onCashIn
            })
        }
    })


    const proceedToPaypandaPortal = ({pinCode = null , Otp = null})=> {
      postCashInPayPandaRequest({
          variables: {
              input: {
                  provider: transactionType.id,
                  amount: +amount,
                  currencyId: tokwaAccount.wallet.currency.id,
                  walletId: tokwaAccount.wallet.id,
                  pinCode: pinCode
              }
          }
      })
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        postRequestCashIn();
    }

    const confirmAmount = ()=> {
        // Keyboard.dismiss()
        navigation.navigate("ToktokWalletReviewAndConfirm", {
            label:"Cash In" , 
            event: "Cash In",
            data: {
                    method: transactionType.name , 
                    amount: amount,
                    accountName: `${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`,
                    accountNumber: tokwaAccount.mobileNumber
                },
            isSwipe: true,
            swipeTitle: `Confirm`,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            // onConfirm: ()=> {
            //     setPinCodeAttempt(6)
            //     setOpenPinCode(true)
            // },
        })
    }

    const changeAmountText = (value)=> {
        setMaxLimitMessage("")
        const num = value.replace(/[^0-9.]/g, '')
        const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
        if(!checkFormat) return       
        let decimalValueArray = num.split(".")
        if(decimalValueArray[0].length > 6) return
        // if(num.length > 6) return
       
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
      <CheckIdleState>
      <AlertOverlay visible={loading}/>
      <Separator />
       <View  
            // keyboardVerticalOffset={Platform.OS == "ios" ? 90 : 90} 
            // keyboardVerticalOffset={90} 
            // behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            {
                transactionType.name.toLowerCase() == "paypanda"
                ?    <View style={styles.paypandaLogo}>
                                <Image style={{height: 90,width: 90,alignSelf: "center",marginBottom: 10}} source={require('toktokwallet/assets/images/cash-in-providers/paypanda.png')}/>
                                <Text style={{fontSize: FONT_SIZE.L,fontFamily: FONT.BOLD}}>PayPanda</Text>
                                <Text style={{fontSize: FONT_SIZE.M ,fontFamily: FONT.BOLD}}>Please enter amount to Cash in</Text>
                    </View>
                :    <View style={styles.paypandaLogo}>
                                <Image style={{height: 90,width: 90,alignSelf: "center",marginBottom: 10}} source={require('toktokwallet/assets/images/cash-in-providers/jcwallet.png')}/>
                                <Text style={{fontSize: FONT_SIZE.L,fontFamily: FONT.BOLD}}>JC Wallet</Text>
                                <Text style={{fontSize: FONT_SIZE.M ,fontFamily: FONT.BOLD}}>Please enter amount to Cash in</Text>
                    </View>
            }
        

            <View style={styles.content}>
          
            {
                !loading
                ? <View style={styles.amountcontent}>
                        <View style={{flexDirection: "row"}}>
                            <TextInput
                                    caretHidden
                                    value={amount}
                                    style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    onChangeText={changeAmountText}
                            />
                            <View style={styles.input}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: 32,marginRight: 10,color:COLOR.YELLOW}}>{tokwaAccount.wallet.currency.code}</Text>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: 32}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                                <FIcon5 name="pen" style={{ alignSelf:"center", marginLeft: 15}} size={20}/>
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


       </CheckIdleState>
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
