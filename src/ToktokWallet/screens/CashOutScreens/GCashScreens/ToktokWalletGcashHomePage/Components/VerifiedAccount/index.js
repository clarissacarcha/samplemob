import React , {useRef, useState} from 'react'
import {View,Text,StyleSheet,Image,TextInput} from 'react-native'
import { ICON_SET, VectorIcon, YellowButton } from 'src/revamp'
import {useSelector} from 'react-redux'
import { numberFormat } from 'toktokwallet/helper'
import { useNavigation } from '@react-navigation/native'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { POST_CASH_OUT } from 'toktokwallet/graphql'
import { useMutation } from '@apollo/react-hooks'
import { useAlert } from 'src/hooks/useAlert'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { DisabledButton, Separator, EnterPinCode } from 'toktokwallet/components'
import { AlertOverlay } from 'src/components'
import { TransactionUtility } from 'toktokwallet/util/TransactionUtility'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import SuccessfulCashOutModal from "./SuccessfulCashOutModal";

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR , SIZE } = CONSTANTS

export const VerifiedAccount = ({record,provider})=> {

    const [amount,setAmount] = useState(0)
    const [errorMessage,setErrorMessage] = useState("")
    const [successModalVisible,setSuccessModalVisible] = useState(false)
    const [cashoutLogParams,setCashoutLogParams] = useState({
        status: 0
    })
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const inputRef = useRef()
    const navigation = useNavigation()
    const alert = useAlert()
    const [pinCodeAttempt,setPinCodeAttempt] = useState(6)
    const [openPinCode,setOpenPinCode] = useState(false)

    const [postCashOut , {data,error,loading}] = useMutation(POST_CASH_OUT, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postCashOut})=> {
            setOpenPinCode(false)
            setCashoutLogParams({
                accountName: `${record.firstName} ${record.lastName}`,
                accountNumber: record.mobile,
                ...postCashOut
            })
            setSuccessModalVisible(true)
        },
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                onErrorAlert,
                setOpenPinCode,
                setPinCodeAttempt
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
        // checkSenderWalletLimitation(num * 0.01)
        setErrorMessage("")
    }

    const ProceedTransaction = (pinCode)=> {
        postCashOut({
            variables: {
                input: {
                    amount: +amount,
                    provider: provider.id,
                    currencyId: tokwaAccount.wallet.currency.id,
                    pinCode: pinCode
                }
            }
        })
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        setPinCodeAttempt(6)
        setOpenPinCode(true)
    }

    const confirmAmount = ()=> {
        navigation.navigate("ToktokWalletReviewAndConfirm", {
            label:"Fund Transfer" , 
            event: "Cash Out",
            data: {
                    method: provider.name , 
                    amount: amount,
                    accountName: `${record.firstName} ${record.lastName}`,
                    accountNumber: record.mobile
                },
            isSwipe: true,
            swipeTitle: `Confirm`,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            // onConfirm: ()=>{
            //     setPinCodeAttempt(6)
            //     setOpenPinCode(true)
            // },
        })
    }

    return (
        <>
        <EnterPinCode 
                visible={openPinCode} 
                setVisible={setOpenPinCode} 
                loading={loading}
                pinCodeAttempt={pinCodeAttempt}
                callBackFunc={ProceedTransaction}
        >
             <AlertOverlay visible={loading} />
        </EnterPinCode>
        <Separator/>
        <SuccessfulCashOutModal 
             visible={successModalVisible}
             cashoutLogParams={cashoutLogParams}
             tokwaAccount={tokwaAccount}
        />
        <View style={styles.container}>

            <View style={styles.gcashLogo}>
                     <Image style={{height: 90,width: 90,alignSelf: "center",marginBottom: 9}} source={require('toktokwallet/assets/images/cash-out-providers/gcash.png')}/>
                     <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR , color: "#00C851"}}>Verified <VectorIcon iconSet={ICON_SET.FontAwesome5} name="check" color="#00C851" size={14}/></Text>
                     <Text style={{fontSize: FONT_SIZE.L,fontFamily: FONT.BOLD}}>{`${record.firstName} ${record.lastName}`}</Text>
                     <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{record.mobile}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.amountcontent}>
                    <View style={{flexDirection: "row"}}>
                        <TextInput
                                caretHidden
                                value={amount}
                                ref={inputRef}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                keyboardType="numeric"
                                returnKeyType="done"
                                onChangeText={changeAmount}
                            />
                         <View style={styles.input}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: 32,marginRight: 10,color:COLOR.YELLOW}}>{tokwaAccount.wallet.currency.code}</Text>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: 32}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                                <VectorIcon iconSet={ICON_SET.FontAwesome5} name="pen" style={{alignSelf:"center",marginLeft: 15}} size={20} color="black"/>
                         </View>
                    </View>
                    { errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR, color: COLOR.RED,marginTop: -5,fontSize: FONT_SIZE.S}}>{errorMessage}</Text>}
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 5,}}>Available Balance PHP {numberFormat(tokwaAccount.wallet.balance)}</Text>
            
                </View>
            </View>

            <View style={styles.cashoutbutton}>
                    {
                        (amount != "" && amount <= tokwaAccount.wallet.balance && amount >= 1 )
                        ? <YellowButton label="Transfer Fund" onPress={confirmAmount}/>
                        : <DisabledButton label="Transfer Fund" />
                    }
            </View>


            {/* <Text>{JSON.stringify(record)}</Text>
            <Text>{JSON.stringify(provider)}</Text> */}
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
    gcashLogo: {
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
        paddingTop: 30,
    },
    input: {
        marginHorizontal: 20,
        borderRadius: 5,
        height: SIZE.FORM_HEIGHT,
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
