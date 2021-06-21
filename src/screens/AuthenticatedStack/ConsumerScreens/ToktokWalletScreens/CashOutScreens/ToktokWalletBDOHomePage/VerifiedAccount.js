import React , {useRef,useState} from 'react'
import { View, Text, StyleSheet , Image ,TextInput} from 'react-native'
import { ICON_SET, YellowButton , VectorIcon } from '../../../../../../revamp'
import { SIZE , FONT, COLOR, FONT_SIZE} from '../../../../../../res/variables'
import {useSelector} from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { numberFormat } from '../../../../../../helper'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../graphql'
import { POST_CASH_OUT } from '../../../../../../graphql/toktokwallet'
import { useMutation } from '@apollo/react-hooks'
import { useAlert } from '../../../../../../hooks/useAlert'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'

//SELF IMPORTS
import { DisabledButton, Separator, EnterPinCode } from '../../Components'
import { AlertOverlay } from '../../../../../../components'

const VerifiedAccount = ({record,provider})=> {

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const inputRef = useRef()
    const navigation = useNavigation()
    const [amount,setAmount] = useState(0)
    const [errorMessage,setErrorMessage] = useState("")
    const [successModalVisible,setSuccessModalVisible] = useState(false)
    const [cashoutLogParams,setCashoutLogParams] = useState({
        status: 0
    })
    const alert = useAlert()
    const [pinCodeAttempt,setPinCodeAttempt] = useState(6)
    const [openPinCode,setOpenPinCode] = useState(false)

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

    const ProceedTransaction = (pinCode)=> {
     
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
            onConfirm: ()=>{
                setPinCodeAttempt(6)
                setOpenPinCode(true)
            },
        })
    }

    return (
        <>
         {/* <EnterPinCode 
                visible={openPinCode} 
                setVisible={setOpenPinCode} 
                loading={loading}
                pinCodeAttempt={pinCodeAttempt}
                callBackFunc={ProceedTransaction}
        >
             <AlertOverlay visible={loading} />
        </EnterPinCode> */}
        <Separator/>
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={styles.bdoLogo}>
                        <Image style={{height: 70,width: 110,alignSelf: "center",marginBottom: 9}} source={require('../../../../../../assets/toktokwallet-assets/cash-out-providers/bdo.png')}/>
                        <Text style={{fontSize: SIZE.M,fontFamily: FONT.REGULAR , color: "#00C851"}}>Verified <VectorIcon iconSet={ICON_SET.FontAwesome5} name="check" color="#00C851" size={14}/></Text>
                        <Text style={{fontSize: SIZE.L,fontFamily: FONT.BOLD}}>{`${record.accountName}`}</Text>
                        <Text style={{fontSize: SIZE.M,fontFamily: FONT.REGULAR}}>{record.accountNumber}</Text>
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

            </View>
            
            <View style={styles.cashoutbutton}>
                    {
                        (amount != "" && amount <= tokwaAccount.wallet.balance && amount >= 1 )
                        ? <YellowButton label="Cash Out" onPress={confirmAmount}/>
                        : <DisabledButton label="Cash Out" />
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

export default VerifiedAccount