import React , {useEffect,useState} from 'react'
import { View , Text , StyleSheet, TextInput } from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { Separator , DisabledButton , BuildingBottom } from 'toktokwallet/components'
import { useAccount } from 'toktokwallet/hooks'
import { AlertOverlay } from 'src/components'
import { numberFormat } from 'toktokwallet/helper'
import { useSelector , useDispatch } from 'react-redux'
import CONSTANTS from 'common/res/constants'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert , usePrompt } from 'src/hooks'
import { YellowButton } from 'src/revamp'

const {COLOR , FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS

export const DragonPayCashIn = ({navigation,route, transactionType}) => {

    const cashInAmount = route?.params?.amount ? route.params.amount : null
    const onCashIn = route?.params?.onCashIn ? route.params.onCashIn : null
    const { tokwaAccount , getMyAccountLoading , getMyAccount}  = useAccount();
    const [amount,setAmount] = useState(cashInAmount ? cashInAmount : "")
    const [message,setMessage] = useState("")
    const [disablebtn,setDisablebtn] = useState(false)
    const [maxLimitMessage,setMaxLimitMessage] = useState("")

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


    const confirmAmount = ()=> {

        navigation.navigate("ToktokWalletDPCashInMethods", {
            transactionType,
            amount,
            cashInAmount,
            onCashIn
        })
        return;
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
    
    return (
        <>
            <Separator/>
            <View style={styles.container}>
                <View style={styles.paypandaLogo}>
                        <Text style={{fontSize: FONT_SIZE.L ,fontFamily: FONT.BOLD}}>Please enter amount to Cash in</Text>
                </View>
                <View style={styles.content}>
                        <View style={styles.amountcontent}>
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
                                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 10}}>Current Balance {tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance)}</Text>
                                
                                    <Text style={{fontFamily: FONT.REGULAR, color: "red",marginTop: 5,fontSize: FONT_SIZE.S}}>{maxLimitMessage}</Text>
                        
                         </View>
                         <View style={styles.cashinbutton}>
                                    {
                                        (amount < 1 || amount > transactionType.cashInLimit || disablebtn)
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