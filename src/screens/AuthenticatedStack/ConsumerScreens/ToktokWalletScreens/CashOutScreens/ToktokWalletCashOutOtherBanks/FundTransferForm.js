import React , {useEffect,useState, useContext} from 'react'
import {View , Text , StyleSheet , TextInput,TouchableOpacity} from 'react-native'
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables'
import { Separator , DisabledButton , EnterPinCode} from '../../Components'
import { YellowButton ,VectorIcon ,ICON_SET} from '../../../../../../revamp'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_BANKS,POST_CASH_OUT_OTHER_BANKS} from '../../../../../../graphql/toktokwallet'
import {useLazyQuery,useMutation} from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../../hooks'
import { numberFormat } from '../../../../../../helper'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { AlertOverlay } from '../../../../../../components'
import { ContextCashOut } from './ContextProvider'

//SELF IMPORTS
import SuccessfulCashOutModal from "./SuccessfulCashOutModal";
import { Alert } from 'react-native'


const Amount = ({changeErrorMessagge ,errorListMessage})=> {

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const { amount ,setAmount , note , setNote ,bank } = useContext(ContextCashOut)
    const [maxAmount , setMaxAmount] = useState(null)


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
            <View style={[styles.input, {borderWidth: 1, borderColor: errorListMessage.amount == "" ? "transparent" : COLOR.RED,flexDirection:"row"}]}>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,alignSelf:"center"}}>{tokwaAccount.wallet.currency.code} </Text>
                        <TextInput
                                caretHidden
                                value={amount}
                                onChangeText={changeAmount}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                keyboardType="numeric"
                                returnKeyType="done"
                        />
                    <View style={{marginLeft: 5,alignSelf: "center",flex: 1}}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                    </View>
            </View>
            {errorListMessage.amount != "" && <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.XS,color:"#F93154"}}>{errorListMessage.amount}</Text>}
        </View>
        <View style={{marginVertical: 16,marginBottom: 20}}>
        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Note (Optional)</Text>
        <View style={[styles.input, {justifyContent:"center"}]}>
             <TextInput
                    style={styles.input}
                    value={note}
                    maxLength={60}
                    onChangeText={(value)=> setNote(value)}
                    placeholder="Enter note here"
                    returnKeyType="done"
                />
                <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{note.length}/60</Text>
        </View>
        </View>
    </View>
    )
}

const AccountInfo = ({selectBanks, errorListMessage })=> {

    const { 
        accountName ,
        accountNumber , 
        setAccountNumber, 
        address , 
        setAddress,
        bank,
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

            <View style={{marginTop: 16,}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
            <View style={[styles.input, {justifyContent:"center"}]}>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountName}</Text>
            </View>
            </View>
            <View style={{marginTop: 16,}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                <View style={[{justifyContent:"center",borderWidth: 1, borderColor: errorListMessage.accountNumber == "" ? "transparent" : COLOR.RED}]}>
                    <TextInput
                            style={styles.input}
                            value={accountNumber}
                            onChangeText={changeAccountNumber}
                            maxLength={19}
                            placeholder={`Enter bank account number here`}
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
                <View style={[{justifyContent:"center",borderWidth: 1, borderColor: errorListMessage.address == "" ? "transparent" : COLOR.RED}]}>
                    <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={(value)=>setAddress(value)}
                            maxLength={200}
                            placeholder={`Enter your address here`}
                            returnKeyType="done"
                        />
                </View>
                <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS}}>{accountNumber.length}/200 
                    {errorListMessage.address != "" && <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.XS,color: COLOR.RED}}>  {errorListMessage.address}</Text>}
                </Text>
            </View>
        </View>
    )
}

const FundTransferForm = ({selectBanks})=> {

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const alert = useAlert()
    const navigation = useNavigation()
    const [errorMessage,setErrorMessage] = useState("")
    const [pinCodeAttempt,setPinCodeAttempt] = useState(6)
    const [openPinCode,setOpenPinCode] = useState(false)
    const [cashoutLogParams,setCashoutLogParams] = useState({
        status: 0
    })
    const [successModalVisible,setSuccessModalVisible] = useState(false)
    const {
        accountName,
        accountNumber,
        bank,
        note,
        amount,
        address,
        savedAccounts
    } = useContext(ContextCashOut)

    const [errorListMessage, setErrorListMessage] = useState({
        bank: "",
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


    const [postCashOutOtherBank , {data,error,loading}] = useMutation(POST_CASH_OUT_OTHER_BANKS, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postCashOutOtherBank})=> {
            setOpenPinCode(false)
            setCashoutLogParams({
                accountName: accountName,
                accountNumber: accountNumber,
                bank: bank.name,
                note: note,
                ...postCashOutOtherBank
            })
            setSuccessModalVisible(true)
        },
        onError: (error)=> {
            const {graphQLErrors, networkError} = error;
            if(graphQLErrors[0].message == "Wallet Hold"){
                setOpenPinCode(false)
                navigation.navigate("ToktokWalletHomePage")
                navigation.replace("ToktokWalletHomePage")
                return navigation.push("ToktokWalletRestricted", {component: "onHold"})
            }

            if(graphQLErrors[0].message == "Invalid Pincode"){
                return setPinCodeAttempt(graphQLErrors[0].payload.remainingAttempts)
            }
            setOpenPinCode(false)
            onErrorAlert({alert,error})
            return navigation.pop()
        }
    })


    const ProceedTransaction = (pinCode)=> {
        postCashOutOtherBank({
            variables: {
                input: {
                    amount: +amount,
                    cashOutBankId: bank.id,
                    accountName: accountName,
                    accountNumber: accountNumber,
                    note: note,
                    pinCode: pinCode,
                    currencyId: tokwaAccount.wallet.currency.id,
                    address: address,
                }
            }
        })
    }


    const onPress = ()=> {
        let noError = true
        if(!bank.id || bank.id == ""){
            changeErrorMessagge("bank",`Select bank first.`)
            noError = false
        }
        if(accountNumber == ""){
            changeErrorMessagge("accountNumber","Account Number is required.")
            noError = false
        }
        if(address == ""){
            changeErrorMessagge("address","Account address is required.")
            noError = false
        }
        if(amount == "") {
            changeErrorMessagge("amount",`Please enter atleast ${tokwaAccount.wallet.currency.code} 1.00.`)
            noError = false
        }

        if(!noError) return

        navigation.navigate("ToktokWalletReviewAndConfirm", {
            label:"Fund Transfer" , 
            event: "Fund Transfer",
            data: {
                    method: bank.name,
                    accountName: accountName,
                    accountNumber: accountNumber,
                    amount: amount,
                    note: note 
                },
            onConfirm: ()=>{
                setPinCodeAttempt(6)
                setOpenPinCode(true)
            },
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
            <SuccessfulCashOutModal 
                visible={successModalVisible}
                cashoutLogParams={cashoutLogParams}
                tokwaAccount={tokwaAccount}
                savedAccounts={savedAccounts}
                note={note}
            />
            <AccountInfo
                selectBanks={selectBanks}
                errorListMessage={errorListMessage}
            />
            <Amount
                changeErrorMessagge={changeErrorMessagge}
                errorListMessage={errorListMessage}
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

export default FundTransferForm