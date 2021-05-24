import React, {useState,useRef,useEffect,useMemo} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,Modal,TextInput,Platform,KeyboardAvoidingView,ActivityIndicator,Alert,Dimensions,ScrollView,Keyboard} from 'react-native'
import {FONT ,FONT_SIZE , COLOR} from '../../../../../../res/variables'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {useSelector} from 'react-redux'
import {useMutation,useLazyQuery} from '@apollo/react-hooks'
import {POST_WALLET_CASH_IN,GET_DAILY_MONTHLY_YEARLY_INCOMING} from '../../../../../../graphql/model'
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

const {height,width} = Dimensions.get("window")


const ToktokWalletPayPandaForm = ({navigation,route})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In','']}/>,
    })

    const alert = useAlert()


    const walletId = route.params.walletId
    const balance = route.params.walletinfo.balance
    const transactionType = route.params.transactionType
    const userstate = useSelector(state=>state.session.user)
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const globalsettings = useSelector(state=>state.constants)
    const [tempAmount,setTempAmount] = useState("")
    const [amount,setAmount] = useState("")
    const [message,setMessage] = useState("")
    const [recipientDetails,setRecipientDetails] = useState(null)
    const [disablebtn,setDisablebtn] = useState(false)
    const [maxLimitMessage,setMaxLimitMessage] = useState("")

    const [postWalletCashIn , {data,error,loading}] = useMutation(POST_WALLET_CASH_IN, {
        // fetchPolicy: 'network-only',
        onError: (error)=>{
            onErrorAlert({alert,error})
            navigation.pop()
        },
        onCompleted: ({postWalletCashIn})=> {
            navigation.navigate("ToktokWalletPayPandaWebView", {
                merchantId: postWalletCashIn.merchantId,
                refNo: postWalletCashIn.refNo,
                signature: postWalletCashIn.signature,
                email_address: tokwaAccount.person.emailAddress,
                payer_name: `${tokwaAccount.person.firstName}${tokwaAccount.person.middleName ? " " + tokwaAccount.person.middleName : ""} ${tokwaAccount.person.lastName}`,
                mobile_number: tokwaAccount.mobileNumber,
                amount_to_pay: amount,
                currency: tokwaAccount.wallete.currency.code,
                walletId: walletId,
                transactionTypeId: transactionType.id
            })
        }
    })


    useEffect(()=>{
        // getDailyMonthlyYearlyIncoming({
        //     variables: {
        //         input: {
        //             userID: userstate.id
        //         }
        //     }
        // })
    },[])

    const proceedToPaypandaPortal = ()=> {
        postWalletCashIn({
            variables: {
                input: {
                    amount: +amount,
                    destinationUserId: userstate.id,
                    sourceUserId: transactionType.sourceUserId,
                    transactionTypeId: transactionType.id
                }
            }
        })
        // Alert.alert("test")
       
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
        const num = value.replace(/[^0-9]/g, '')
        if(num.length > 8) return
        setTempAmount(num)
        setAmount(num * 0.01)
        if(num == "") return setMessage("")
        if((num * 0.01) < 1){
           return setMessage(`Please Enter atleast ${'\u20B1'} 1.00`)
        }else if((num * 0.01) > transactionType.cashInLimit){
            setTempAmount(`${transactionType.cashInLimit}00`)
            setAmount(transactionType.cashInLimit)
            setMaxLimitMessage(`Maximum cash in limit is ${'\u20B1'} ${numberFormat(transactionType.cashInLimit)}`)
            setDisablebtn(true)
            return
        }
        // checkRecipientWalletLimitation(num * 0.01)
        setDisablebtn(false)
        setMessage("")
        
    }

    return (
      <>
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
            </View>

            <View style={styles.content}>
          
            {
                !loading
                ? <View style={styles.amountcontent}>
                        <View style={{flexDirection: "row"}}>
                            <TextInput
                                    caretHidden
                                    value={tempAmount}
                                    style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    onChangeText={changeAmountText}
                            />
                            <View style={styles.input}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: 32,marginRight: 10,color:COLOR.YELLOW}}>{tokwaAccount.wallet.currency.code}</Text>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: 32}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                                <FIcon5 name="pen" style={{alignSelf:"center",marginLeft: 20}} size={20} color={COLOR.DARK}/>
                            </View>
                            
                        </View>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Available Balance {tokwaAccount.wallet.currency.code} {numberFormat(balance)}</Text>
                        <Text style={{fontFamily: FONT.REGULAR, color: "red",marginTop: 5,fontSize: FONT_SIZE.S}}>{message}</Text>
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