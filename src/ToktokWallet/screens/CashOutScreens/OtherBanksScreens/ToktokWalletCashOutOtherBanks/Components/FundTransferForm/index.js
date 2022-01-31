import React , {useEffect,useState, useContext, useCallback} from 'react'
import {View , Text , StyleSheet , TextInput,TouchableOpacity, Alert} from 'react-native'
import { ValidatorScreen , InputAmount } from 'toktokwallet/components'
import { YellowButton ,VectorIcon ,ICON_SET} from 'src/revamp'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {POST_CASH_OUT_OTHER_BANKS , POST_REQUEST_CASH_OUT, POST_COMPUTE_CONVENIENCE_FEE } from 'toktokwallet/graphql'
import { useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert, usePrompt } from 'src/hooks'
import { numberFormat , AmountLimitHelper } from 'toktokwallet/helper'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { AlertOverlay } from 'src/components'
import { ContextCashOut } from '../ContextProvider'
import { TransactionUtility } from 'toktokwallet/util'
import _ from 'lodash'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import SuccessfulCashOutModal from "./SuccessfulCashOutModal";

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS
const Amount = ({
    changeErrorMessagge ,
    errorListMessage , 
    providerServiceFee , 
    systemServiceFee , 
    computeConvenienceFee ,
    computeLoading,
})=> {

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const { amount ,setAmount , note , setNote ,bank } = useContext(ContextCashOut)
    const [maxAmount , setMaxAmount] = useState(null)
    const cfMessage =   +providerServiceFee + +systemServiceFee == 0 
                      ? `Convenience fee is waived for this transaction.`
                      : `Additional convenience fee will be charged in this transaction.`
                    //   : `Additional PHP ${numberFormat(+providerServiceFee + +systemServiceFee)} convenience fee will be charged in this transaction.`


    const changeAmount = (value)=> {
        const num = value.replace(/[^0-9.]/g, '')
        const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
        if(!checkFormat) return       
        let decimalValueArray = num.split(".")
        if(decimalValueArray[0].length > 6) return
        // if(num.length > 6) return
        if(num[0] == ".") return setAmount("0.")
        // setTempAmount(num)
        setAmount(num)
    }

    useEffect(()=>{
            if(amount >= 1 && amount <= tokwaAccount.wallet.balance){
                changeErrorMessagge("amount","")
            }else if(amount < 1 && amount != ""){
                changeErrorMessagge("amount",`Please enter atleast ${tokwaAccount.wallet.currency.code} 1.00.`)
            }else if(maxAmount && amount > maxAmount){
                changeErrorMessagge("amount",`Maximum limit is ${tokwaAccount.wallet.currency.code} ${numberFormat(maxAmount)}`)
            } else{
                changeErrorMessagge("amount",amount == "" ? "" : "You do not have enough balance.")
            }

        return ()=> {
            changeErrorMessagge("amount","")
        }
    },[amount, maxAmount])

    return (
        <View style={styles.container}>
        <View style={{marginTop: 16,}}>
        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Enter Amount</Text>
           <InputAmount
                errorMessage={errorListMessage.amount}
                amount={amount}
                changeAmount={changeAmount}
                currency={tokwaAccount.wallet.currency.code}
                onBlur={()=>{
                    AmountLimitHelper.postCheckOutgoingLimit({
                        amount,
                        setErrorMessage: (value)=> {
                            if(errorListMessage.amount == "")  changeErrorMessagge("amount",value)
                        }
                    })
                    computeConvenienceFee()
                }}
            />
            {/* <View style={[styles.input, {borderWidth: 1, borderColor: errorListMessage.amount == "" ? "transparent" : COLOR.RED,flexDirection:"row"}]}>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,alignSelf:"center"}}>{tokwaAccount.wallet.currency.code} </Text>
                        <TextInput
                                caretHidden
                                value={amount}
                                onChangeText={changeAmount}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                keyboardType="numeric"
                                returnKeyType="done"
                                onBlur={computeConvenienceFee}
                        />
                    <View style={{marginLeft: 5,alignSelf: "center",flex: 1}}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                    </View>
            </View> */}
            {errorListMessage.amount != "" && <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.XS,color:"#F93154"}}>{errorListMessage.amount}</Text>}
            {amount != "" && bank.id > 0 && !computeLoading && tokwaAccount.constants.UbFundTransferType == "api" && <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.XS}}>{cfMessage}</Text>}
        </View>
        <View style={{marginVertical: 16,marginBottom: 20}}>
        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Note (Optional)</Text>
   
             <TextInput
                    style={styles.input}
                    value={note}
                    maxLength={60}
                    onChangeText={(value)=> setNote(value)}
                    placeholder="Enter note here"
                    returnKeyType="done"
                    placeholderTextColor={COLOR.DARK}
                />
                <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{note.length}/60</Text>
    
        </View>
    </View>
    )
}

const AccountInfo = ({selectBanks, errorListMessage })=> {

    const { 
        accountName ,
        setAccountName,
        accountNumber , 
        setAccountNumber, 
        address , 
        setAddress,
        bank,
        activeAccount
    } = useContext(ContextCashOut)


    const changeAccountNumber = (value)=> {
        const num = value.replace(/[^0-9.]/g, '')
        setAccountNumber(num)
    }

    return (
        <View style={styles.container}>
             <View style={{marginTop: 20,}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Select Bank</Text>
                <TouchableOpacity onPress={selectBanks} style={[styles.input, {justifyContent:"flex-start",alignItems:"center", flexDirection:'row',borderWidth: 1,borderColor: errorListMessage.bank == "" ? "transparent" : COLOR.RED}]}>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M , color:bank.name == "" ? "gray": "black" }}>{bank.name == "" ? "Choose bank here" : bank.name}</Text>
                    <View style={{flex: 1,alignItems:"flex-end"}}>
                         <VectorIcon iconSet={ICON_SET.Feather} color="black" name="chevron-down"/>
                    </View>
                </TouchableOpacity>
                {errorListMessage.bank != "" && <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.XS,color:"#F93154"}}>{errorListMessage.bank}</Text>}
            </View>


            {/* OLD ACCOUNT NAME */}
            {/* <View style={{marginTop: 16,}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
            <View style={[styles.input, {justifyContent:"center",backgroundColor:"#F0F0F0"}]}>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountName}</Text>
            </View>
            </View> */}

            {/* NEW ACCOUNT NAME */}
            <View style={{marginTop: 16,}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
                <View style={[{justifyContent:"center",borderRadius: SIZE.BORDER_RADIUS, borderWidth: 1, borderColor: errorListMessage.accountName == "" ? "transparent" : COLOR.RED}]}>
                    <TextInput
                            // editable={activeAccount > 0 ? false : true}
                            style={styles.input}
                            value={accountName}
                            onChangeText={setAccountName}
                            maxLength={30}
                            placeholder={`Enter bank account name here`}
                            placeholderTextColor={COLOR.DARK}
                            keyboardType="default"
                            returnKeyType="done"
                        />
                </View>
                <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{accountName.length}/30 
                    {errorListMessage.accountName != "" && <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS,color: COLOR.RED}}>  {errorListMessage.accountName}</Text>}
                </Text>
            </View>


            <View style={{marginTop: 16,}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                <View style={[{justifyContent:"center",borderRadius: SIZE.BORDER_RADIUS, borderWidth: 1, borderColor: errorListMessage.accountNumber == "" ? "transparent" : COLOR.RED}]}>
                    <TextInput
                            // editable={activeAccount > 0 ? false : true}
                            style={styles.input}
                            value={accountNumber}
                            onChangeText={changeAccountNumber}
                            maxLength={19}
                            placeholder={`Enter bank account number here`}
                            placeholderTextColor={COLOR.DARK}
                            keyboardType="number-pad"
                            returnKeyType="done"
                        />
                </View>
                <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{accountNumber.length}/19 
                    {errorListMessage.accountNumber != "" && <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS,color: COLOR.RED}}>  {errorListMessage.accountNumber}</Text>}
                </Text>
            </View>

            <View style={{marginTop: 16,}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Address</Text>
                <View style={[{justifyContent:"center",borderRadius: SIZE.BORDER_RADIUS,borderWidth: 1, borderColor: errorListMessage.address == "" ? "transparent" : COLOR.RED}]}>
                    <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={(value)=>setAddress(value)}
                            maxLength={20}
                            placeholder={`Enter your address here`}
                            placeholderTextColor={COLOR.DARK}
                            returnKeyType="done"
                        />
                </View>
                <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{address.length}/20 
                    {errorListMessage.address != "" && <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS,color: COLOR.RED}}>  {errorListMessage.address}</Text>}
                </Text>
            </View>
        </View>
    )
}

export const FundTransferForm = ({selectBanks, screenLabel})=> {

    const prompt = usePrompt()
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const alert = useAlert()
    const navigation = useNavigation()
    const [cashoutLogParams,setCashoutLogParams] = useState({
        status: 0
    })
    const [successModalVisible,setSuccessModalVisible] = useState(false)
    const [providerServiceFee,setProviderServiceFee] = useState("")
    const [systemServiceFee,setSystemServiceFee] = useState("")

    const {
        accountName,
        accountNumber,
        bank,
        note,
        amount,
        address,
        savedAccounts,
        activeAccount
    } = useContext(ContextCashOut)

    const [errorListMessage, setErrorListMessage] = useState({
        bank: "",
        accountName: "",
        accountNumber: "",
        address: "",
        amount: "",
    })

    const changeErrorMessagge = (key,value)=> {
        setErrorListMessage(oldstate=>({
            ...oldstate,
            [key]: value
        }))
        
    }

    useEffect(()=>{
        if(bank.id){
            changeErrorMessagge("bank","")
        }
        if(accountNumber.length > 0) {
            changeErrorMessagge("accountNumber","")
        }
        if(address.length > 0){
            changeErrorMessagge("address","")
        }
    },[bank,accountNumber,address])

    const [postComputeConvenienceFee , {loading: computeLoading}] = useMutation(POST_COMPUTE_CONVENIENCE_FEE, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        // onError: (error)=> onErrorAlert({alert,error}),
        onCompleted: ({postComputeConvenienceFee})=> {
            const { providerServiceFee , systemServiceFee , type } = postComputeConvenienceFee
            setSystemServiceFee(systemServiceFee)
            setProviderServiceFee(providerServiceFee)
        }
    })

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
            // onErrorAlert({alert,error,navigation,title: "Transaction Void"})
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt,
                alert
            })
        }
    })


    const [postCashOutOtherBank , {data,error,loading}] = useMutation(POST_CASH_OUT_OTHER_BANKS, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postCashOutOtherBank})=> {
            setCashoutLogParams({
                accountName: accountName,
                accountNumber: accountNumber,
                bank: bank,
                address: address,
                note: note,
                ...postCashOutOtherBank
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


    const ProceedTransaction = ({pinCode = null , Otp = null, data = null })=> {
        const {requestFundTransferId} = data
        postCashOutOtherBank({
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
                    cashOutBankId: bank.id,
                    accountName: accountName,
                    accountNumber: accountNumber,
                    note: note,
                    currencyId: tokwaAccount.wallet.currency.id,
                    address: address,
                    type: "Other Banks"
                }
            }
        })
    }


    const onPress = ()=> {
        let noError = true
        if(!bank.id || bank.id == ""){
            changeErrorMessagge("bank",`Select Bank first.`)
            noError = false
        }

        if(accountName == ""){
            changeErrorMessagge("accountName","Account Name is required.")
            noError = false
        }

        if(accountNumber == ""){
            changeErrorMessagge("accountNumber","Account Number is required.")
            noError = false
        }
        if(address == ""){
            changeErrorMessagge("address","Account Address is required.")
            noError = false
        }
        if(amount == "") {
            changeErrorMessagge("amount",`Please enter atleast ${tokwaAccount.wallet.currency.code} 1.00.`)
            noError = false
        }

        if(amount > 50000 && accountNumber.length > 16){
            changeErrorMessagge("accountNumber","Account Number maximum length must be 16")
            noError = false
        }

        if(errorListMessage.amount != ""){
            noError = false;
        }

        if(!noError) return

        if(providerServiceFee == "" || systemServiceFee == ""){
             postComputeConvenienceFee({
                variables: {
                    input: {
                        amount: +amount,
                        cashOutBankId: bank.id
                    }
                }
            })
        }

        navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: screenLabel ?? "Fund Transfer" , 
            event: "Fund Transfer",
            data: {
                    method: bank.name,
                    accountName: accountName,
                    accountNumber: accountNumber,
                    amount: amount,
                    note: note,
                    providerServiceFee,
                    systemServiceFee
                },
            isSwipe: true,
            swipeTitle: `Confirm`,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
        })

    }

    const debounceHandler = useCallback(_.debounce(()=>{
        postComputeConvenienceFee({
            variables: {
                input: {
                    amount: +amount,
                    cashOutBankId: bank.id
                }
            }
        })
    },1000, {
        leading: false,
        trailing: true,
    }), [])

    useEffect(()=>{
        if(amount != "" && bank.id > 0){
            postComputeConvenienceFee({
                variables: {
                    input: {
                        amount: +amount,
                        cashOutBankId: bank.id
                    }
                }
            })
        }
    },[bank,amount])

    return (
        <>
            <AlertOverlay visible={requestLoading || loading}/>
            <SuccessfulCashOutModal 
                visible={successModalVisible}
                setVisible={setSuccessModalVisible}
                cashoutLogParams={cashoutLogParams}
                tokwaAccount={tokwaAccount}
                savedAccounts={savedAccounts}
                activeAccount={activeAccount}
                accountName={accountName}
                note={note}
                screenLabel={screenLabel}
            />
            <AccountInfo
                selectBanks={selectBanks}
                errorListMessage={errorListMessage}
            />
            <Amount
                changeErrorMessagge={changeErrorMessagge}
                errorListMessage={errorListMessage}
                providerServiceFee={providerServiceFee}
                systemServiceFee={systemServiceFee}
                computeLoading={computeLoading}
                computeConvenienceFee={()=> {
                    postComputeConvenienceFee({
                        variables: {
                            input: {
                                amount: +amount,
                                cashOutBankId: bank.id
                            }
                        }
                    })
                }}
            />
            <View style={styles.proceedBtn}>
                <YellowButton label="Proceed" onPress={onPress}/>
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    },
    proceedBtn: {
        height: 70,
        justifyContent: 'flex-end',
        padding: 16,
        marginTop: 20,
    }
})
