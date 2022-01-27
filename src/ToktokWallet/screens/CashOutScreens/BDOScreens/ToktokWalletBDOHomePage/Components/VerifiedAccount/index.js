import React , {useRef,useState, useEffect} from 'react'
import { View, Text, StyleSheet , Image ,TextInput} from 'react-native'
import { ICON_SET, YellowButton , VectorIcon } from 'src/revamp'
import {useSelector} from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { numberFormat } from 'toktokwallet/helper'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { POST_CASH_OUT_BDO , POST_REQUEST_CASH_OUT } from 'toktokwallet/graphql'
import { useMutation } from '@apollo/react-hooks'
import { useAlert, usePrompt } from 'src/hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { AlertOverlay } from 'src/components'
import { DisabledButton, Separator , ValidatorScreen } from 'toktokwallet/components'
import { TransactionUtility } from 'toktokwallet/util'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import SuccessfulCashOutModal from "./SuccessfulCashOutModal";

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR , SIZE } = CONSTANTS

export const VerifiedAccount = ({record,provider})=> {

    const prompt = usePrompt()
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const inputRef = useRef()
    const [isFocus,setIsFocus] = useState(false)
    const navigation = useNavigation()
    const [amount,setAmount] = useState(0)
    const [errorMessage,setErrorMessage] = useState("")
    const [successModalVisible,setSuccessModalVisible] = useState(false)
    const [cashoutLogParams,setCashoutLogParams] = useState({
        status: 0
    })
    const alert = useAlert()

    const [postRequestCashOut , {loading: requestLoading}] = useMutation(POST_REQUEST_CASH_OUT , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postRequestCashOut})=>{
            const { validator , requestFundTransferId } = postRequestCashOut
            const screen = validator == "TPIN" ? "ToktokWalletTPINValidator" : "ToktokWalletOTPValidator"
            return navigation.navigate(screen, {
                callBackFunc: ProceedTransaction,
                resendRequest: onSwipeSuccess ,
                data: {
                    requestFundTransferId: requestFundTransferId
                }
            })
        },
        onError: (error)=>{
            onErrorAlert({alert,error,navigation,title: "Transaction Void"})
        }
    })


    const [postCashOutBdo , {data,error,loading}] = useMutation(POST_CASH_OUT_BDO, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postCashOutBdo})=> {
            setCashoutLogParams({
                accountName: record.accountName,
                accountNumber: record.accountNumber,
                ...postCashOutBdo
            })
            setSuccessModalVisible(true)
        },
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt,
                alert 
            })
        }
    })

    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9.]/g, '')
        const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
        if(!checkFormat) return       
        let decimalValueArray = num.split(".")
        if(decimalValueArray[0].length > 6) return
        // if(num.length > 6) return
        if(num[0] == ".") return setAmount("0.")
        setAmount(num)
        if(num == "") return setErrorMessage("")
        if(num < 1 && num != ""){
            return setErrorMessage(`Please enter atleast ${tokwaAccount.wallet.currency.code} 1.00`)
        }else if(num > tokwaAccount.wallet.balance){
            return setErrorMessage(`You do not have enough balance`)
        }
        setErrorMessage("")
    }

    const ProceedTransaction = ({pinCode = null ,Otp = null , data = null })=> {
        const { requestFundTransferId } = data
        postCashOutBdo({
            variables: {
                input: {
                    requestFundTransferId: requestFundTransferId,
                    OTP: Otp,
                    TPIN: pinCode
                }
            }
        })
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        postRequestCashOut({
            variables: {
                input: {
                    amount: +amount,
                    provider: provider.id,
                    currencyId: tokwaAccount.wallet.currency.id,
                    type: "BDO"
                }
            }
        })
    }

    const confirmAmount = ()=> {
        navigation.navigate("ToktokWalletReviewAndConfirm", {
            label:"Fund Transfer" , 
            event: "Cash Out",
            data: {
                    method: provider.name , 
                    amount: amount,
                    accountName: record.accountName,
                    accountNumber: record.accountNumber
                },
            isSwipe: true,
            swipeTitle: `Confirm`,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
        })
    }

    const showInput = ()=>{
        setTimeout(() => {
            inputRef.current.focus();
        }, 0);
    }

    useEffect(()=>{
        showInput()
    },[])

    return (
        <>
        <AlertOverlay visible={requestLoading || loading}/>
        <Separator/>
        <SuccessfulCashOutModal 
             visible={successModalVisible}
             cashoutLogParams={cashoutLogParams}
             tokwaAccount={tokwaAccount}
        />
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={styles.bdoLogo}>
                        <Image style={{height: 70,width: 110,alignSelf: "center",marginBottom: 9}} source={require('toktokwallet/assets/images/cash-out-providers/bdo.png')}/>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR , color: "#00C851"}}>Verified <VectorIcon iconSet={ICON_SET.FontAwesome5} name="check" color="#00C851" size={14}/></Text>
                        <Text style={{fontSize: FONT_SIZE.L,fontFamily: FONT.BOLD}}>{`${record.accountName}`}</Text>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{record.accountNumber}</Text>
                </View>
                <View style={styles.content}>
                        <View style={styles.amountcontent}>
                                <View style={{flexDirection: "row"}}>
                                       
                                       <View style={styles.input}>
                                           <Text style={{fontFamily: FONT.BOLD,fontSize: 30,color:COLOR.YELLOW}}>{tokwaAccount.wallet.currency.code}</Text>
                                          
                                           {
                                               !isFocus && amount != "" &&
                                               <Text style={{fontFamily: FONT.BOLD,fontSize: 30,marginLeft: 10}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                                           }
                                              <TextInput
                                                       onFocus={()=>setIsFocus(true)}
                                                       onBlur={()=>setIsFocus(false)}
                                                       caretHidden={!isFocus}
                                                       value={amount}
                                                       ref={inputRef}
                                                       // style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                                       style={{fontSize: 32, fontFamily: FONT.BOLD, height: '100%', width: 160, ...(!isFocus && amount != "" ? {position: 'absolute', color: 'transparent',zIndex: 1} : {})}}
                                                       keyboardType="numeric"
                                                       returnKeyType="done"
                                                       placeholder="0.00"
                                                       placeholderTextColor="black"
                                                       onChangeText={changeAmount}
                                                       textAlignVertical="bottom"
                                                       textAlign="center"
                                                   />
                                           {/* <FIcon5 name="pen" style={{ alignSelf:"center", marginLeft: 15}} size={20}/> */}
                                       </View>
                                       
                                   </View>
                            { errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR, color: COLOR.RED,fontSize: FONT_SIZE.S}}>{errorMessage}</Text>}
                            <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 5,}}>Available Balance PHP {numberFormat(tokwaAccount.wallet.balance)}</Text>
                    
                        </View>
                 </View>

            </View>
            
            <View style={styles.cashoutbutton}>
                    {
                        (amount != "" && amount <= tokwaAccount.wallet.balance && amount >= 1 )
                        ? <YellowButton label="Transfer Fund" onPress={confirmAmount}/>
                        : <DisabledButton label="Transfer Fund" />
                    }
            </View>
         </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        padding: 16,
    },
    body:{
        flex: 1,
    },
    bdoLogo: {
        width: "100%",
        justifyContent:"center",
        alignItems:"center",
        marginTop: 30,
    },
    content: {
        flex: 1,
    },
    amountcontent: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 30,
    },
    input: {
        marginHorizontal: 20,
        borderRadius: 5,
        height: SIZE.FORM_HEIGHT + 20,
        // flexShrink: 1,
        flex: 1,
        flexDirection:"row",
        width: 150,
        justifyContent:"center",
        alignItems:"center"
    },
    cashoutbutton: {
        height: 50,
        width: "100%",
    },
})
