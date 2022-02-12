import React , {useEffect,useState , useRef} from 'react'
import { View , Text , StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { Separator , DisabledButton , BuildingBottom } from 'toktokwallet/components'
import { useAccount } from 'toktokwallet/hooks'
import { AlertOverlay } from 'src/components'
import { numberFormat , AmountLimitHelper } from 'toktokwallet/helper'
import { useSelector , useDispatch } from 'react-redux'
import CONSTANTS from 'common/res/constants'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert , usePrompt } from 'src/hooks'
import { useDebounce } from 'toktokwallet/hooks'
import CheckBox from 'react-native-check-box'
import { YellowButton } from 'src/revamp'

const {COLOR , FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS


const inputAmountLength = {
    "0": 80,
    "1": 80,
    "2": 80,
    "3": 80,
    "4": 80,
    "5": 100,
    "6": 120,
    "7": 130,
    "8": 155,
    "9": 165,
}

export const DragonPayCashIn = ({navigation,route, transactionType}) => {

    const cashInAmount = route?.params?.amount ? route.params.amount : null
    const onCashIn = route?.params?.onCashIn ? route.params.onCashIn : null
    const { tokwaAccount , getMyAccountLoading , getMyAccount}  = useAccount();
    const [amount,setAmount] = useState(cashInAmount ? cashInAmount : "")
    const [message,setMessage] = useState("")
    const [disablebtn,setDisablebtn] = useState(false)
    const [maxLimitMessage,setMaxLimitMessage] = useState("")
    const [isFocus,setIsFocus] = useState(false)
    const [inputWidth,setInputWidth] = useState(inputAmountLength["0"])
    const [isCertify, setCertify] = useState(true)
    const inputRef = useRef(null);

    const dispatch = useDispatch();
    const alert = useAlert()
    const prompt = usePrompt()

    const checkStatus = async ()=> {
        if(!tokwaAccount.mobileNumber){
            await getMyAccount()
            return
        } 
        
        if(!tokwaAccount.pinCode){
            return navigation.replace("ToktokWalletRestricted", {component: "noPin" , amount: cashInAmount , onCashIn: onCashIn})
        }
    }

    useEffect(()=>{
        if(onCashIn){
            dispatch({
                type: "SET_TOKWA_EVENTS_REDIRECT",
                payload: {
                    event: "cashInTopUp",
                    value: true,
                }
            })
        }
    },[])

    useEffect(()=>{
        if(onCashIn){
           checkStatus();
           cashInTopUp = false;
        }
    },[onCashIn, tokwaAccount])


    const confirmAmount = async ()=> {

        const checkLimit = await AmountLimitHelper.postCheckIncomingLimit({
            amount,
            setErrorMessage: setMessage
        })

        if(!checkLimit) return;

        navigation.navigate("ToktokWalletDPCashInMethods", {
            transactionType,
            amount,
            cashInAmount,
            onCashIn
        })
        return;
     }

     const checkRecipientWalletLimitation = (amount)=> {

        const errorMessage = AmountLimitHelper.checkAccountIncomingWalletLimit({
            tokwaAccount,
            amount
        })

        return errorMessage

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
        //  const limitMessage = checkRecipientWalletLimitation(num)
        //  if(limitMessage) return setMessage(limitMessage)
         if(num == "")return setMessage("")
         if(num < 1) return setMessage(`Please enter atleast ${tokwaAccount.wallet.currency.code} 1.00`)
        //  setDisablebtn(false)
         setMessage("")
         
     }

    const showInput = ()=>{
        setTimeout(() => {
            if(amount == "") inputRef.current.focus();
        }, 10);
    }

    useEffect(()=>{
        showInput()
    },[])

    const checkLimit = useDebounce(async (amount)=> {
        console.log("Typing ")
        const checkLimit = await AmountLimitHelper.postCheckIncomingLimit({
            amount,
            setErrorMessage: setMessage
        })

        if(!checkLimit) return;
        setDisablebtn(false)
    },1000)

    useEffect(()=>{
        setDisablebtn(true)
        setInputWidth(inputAmountLength[amount.length])
        if(amount != "")  checkLimit(amount)
    },[amount])
    
    return (
        <>
            <Separator/>
            <View style={styles.container}>
                <View style={styles.paypandaLogo}>
                        <Text style={{fontSize: FONT_SIZE.L ,fontFamily: FONT.BOLD}}>Please enter amount to Cash In</Text>
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
                                                        onBlur={()=>{
                                                            setIsFocus(false)
                                                        }}
                                                        caretHidden={!isFocus}
                                                        value={amount}
                                                        ref={inputRef}
                                                        // style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                                        style={{textAlign:"center", marginTop: 12,fontSize: 32, fontFamily: FONT.BOLD, height: '100%', width: inputWidth, ...(!isFocus && amount != "" ? {position: 'absolute', color: 'transparent',zIndex: 1} : {})}}
                                                        keyboardType="numeric"
                                                        returnKeyType="done"
                                                        placeholder={amount == "" ? "0.00" : ""}
                                                        placeholderTextColor="black"
                                                        onChangeText={changeAmountText}
                                                        textAlign="right"
                                                        textAlignVertical="center"
                                                        // onContentSizeChange={(e)=> {
                                                        //     setInputWidth(e.nativeEvent.contentSize.width)
                                                        // }}
                                                    />
                                            {/* <FIcon5 name="pen" style={{ alignSelf:"center", marginLeft: 15}} size={20}/> */}
                                        </View>
                                        
                                    </View>
                                    { message != "" && <Text style={{textAlign:"center", fontFamily: FONT.REGULAR, color: "red", marginTop: 10,marginBottom: 10, fontSize: FONT_SIZE.S}}>{message}</Text>}
                                    <Text>
                                        <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR, marginTop: 10}}>Current Balance: </Text>
                                        <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD, marginTop: 10}}>{numberFormat(tokwaAccount.wallet.balance)}</Text>
                                    </Text>
                                
                                    <Text style={{fontFamily: FONT.REGULAR, color: "red",marginTop: 5,fontSize: FONT_SIZE.S}}>{maxLimitMessage}</Text>
                         </View>

                         <View style={{flex:1 ,justifyContent:"flex-end",alignItems:"center",paddingBottom: 25}}>
                         <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",marginBottom: 10}}>
                         Please read our Terms and Conditions before you proceed with your transaction.
                         </Text>
                    <View style={{
                        flexDirection:"row",    
                        marginLeft: 7,        
                    }}>

                    <CheckBox
                            isChecked={isCertify}
                            onClick={()=>{
                                return setCertify(!isCertify)
                            }}
                            style={{
                                alignSelf: "center",
                                marginRight: 2,
                            }}
                        />

                        <TouchableOpacity 
                            // onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")} 
                            onPress={()=>navigation.navigate("ToktokWalletTermsConditions")}
                            style={{paddingHorizontal: 10,marginRight: 20,alignSelf:"center"}}
                        >
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>I hereby certify that I accept the <Text style={{color: COLOR.ORANGE,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Terms and Conditions.</Text></Text>
                        </TouchableOpacity>
                    </View>
                        
                         </View>

                         <View style={styles.cashinbutton}>
                                    {
                                        (!isCertify && ( amount < 1 || amount > transactionType.cashInLimit || disablebtn || message != "") )
                                        ? <DisabledButton label="Cash In"/>
                                        : <YellowButton label="Cash In" onPress={confirmAmount}/>
                                    }
                        </View>
                      
                </View>
                <BuildingBottom/>
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
        marginTop: 50,
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