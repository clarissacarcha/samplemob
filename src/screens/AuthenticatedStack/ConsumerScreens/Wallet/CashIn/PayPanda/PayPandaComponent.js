import React, {useState,useRef,useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,Modal,TextInput,Platform,KeyboardAvoidingView,ActivityIndicator,Alert,Dimensions,ScrollView} from 'react-native'
import {HeaderBackClose, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM, FONT_MEDIUM, FONT_REGULAR} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {useSelector} from 'react-redux'
import {useMutation} from '@apollo/react-hooks'
import {POST_WALLET_CASH_IN} from '../../../../../../graphql/model'
import {onError} from '../../../../../../util/ErrorUtility';
import {numberFormat} from '../../../../../../helper'
import ConfirmModal from './ConfirmModal'

const {height,width} = Dimensions.get("window")


const PayPandaComponent = ({navigation,route})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose/>,
        headerTitle: ()=> <HeaderTitle label={['Enter Amount','']}/>,
    })


    const walletId = route.params.walletId
    const balance = route.params.walletinfo.balance
    const transactionType = route.params.transactionType
    const userstate = useSelector(state=>state.session.user)
    const globalsettings = useSelector(state=>state.constants)
    const [showModal,setShowModal] = useState(false)
    const [tempAmount,setTempAmount] = useState("")
    const [amount,setAmount] = useState("")
    const [message,setMessage] = useState("")
    const inputRef = useRef()

    const [postWalletCashIn , {data,error,loading}] = useMutation(POST_WALLET_CASH_IN, {
        // fetchPolicy: 'network-only',
        onError: onError,
        onCompleted: ({postWalletCashIn})=> {
            navigation.navigate("TokTokWalletCashINPaypandaWebView", {
                merchantId: postWalletCashIn.merchantId,
                refNo: postWalletCashIn.refNo,
                signature: postWalletCashIn.signature,
                email_address: userstate.person.emailAddress,
                payer_name: `${userstate.person.firstName}${userstate.person.middleName ? " " + userstate.person.middleName : ""} ${userstate.person.lastName}`,
                mobile_number: userstate.username,
                amount_to_pay: amount,
                currency: "PHP",
                walletId: walletId,
                transactionTypeId: transactionType.id
            })
        }
    })

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
        setShowModal(false)
        // Alert.alert("test")
       
    }

    const openSecurityPIN = ()=> {
        setShowModal(false)
        return navigation.push("TokTokWalletPinCodeSecurity", {onConfirm: proceedToPaypandaPortal})
    }


    const confirmAmount = ()=> {
        setShowModal(true)
    }

    const changeAmountText = (value)=> {
        const num = value.replace(/[^0-9]/g, '')
        setTempAmount(num)
        setAmount(num * 0.01)
        if(num == "") return setMessage("")
        if((num * 0.01) < 1){
           return setMessage(`Please Enter atleast ${'\u20B1'} 1.00`)
        }else{
           return setMessage("")
        }
    }


    return (
      <>
       <ConfirmModal showModal={showModal} setShowModal={setShowModal} amount={amount} onPress={openSecurityPIN}/>
       <KeyboardAvoidingView  
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 90}  
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <View style={styles.paypandaLogo}>
                <Image style={{height: 40,width: 40,alignSelf: "center"}} source={require('../../../../../../assets/images/paypanda.png')}/>
                <Text style={{alignSelf: "center",marginLeft: 15,fontSize: 14,fontFamily: FONT_MEDIUM}}>PayPanda</Text>
            </View>
          
            {
                !loading
                ? <View style={styles.amountcontent}>
                        <View style={{flexDirection: "row"}}>
                            <TextInput
                                    // autoFocus={true}
                                    caretHidden
                                    value={tempAmount}
                                    // ref={inputRef}
                                    style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    onChangeText={changeAmountText}
                                    // onSubmitEditing={onSubmit}
                            />
                            <Text style={{fontSize: 40,fontFamily: FONT_MEDIUM , alignSelf:"center"}}>{'\u20B1'}</Text>
                            <View style={styles.input}>
                                <Text style={{fontFamily: FONT_MEDIUM,fontSize: 30}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                            </View>
                            <FIcon5 name="pen" style={{alignSelf:"center"}} size={18} color="gray"/>
                        </View>
                        <Text style={{color:"gray",fontSize: 14,fontFamily: FONT_REGULAR}}>Current Balance {'\u20B1'} {numberFormat(balance)}</Text>
                        <Text style={{fontFamily: FONT_REGULAR, color: "red",marginTop: 5,fontSize: 12}}>{message}</Text>
              
                 </View>
                : <View style={{flex: 1,justifyContent: "center",alignItems: "center"}}><ActivityIndicator size={50}/></View>
                
            }
          
            <View style={styles.cashinbutton}>
                    <TouchableOpacity disabled={amount < 1} onPress={confirmAmount} style={{height: "100%",width: "100%",backgroundColor: amount < 1 ? "gray" : DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: amount < 1 ? "white" : COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Cash In</Text>
                    </TouchableOpacity>
            </View>
       </KeyboardAvoidingView>
       </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    paypandaLogo: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        padding: 10,
        borderWidth: 0.5,
        borderColor: "silver"
    },
    amountcontent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // width:width * 0.7,
        // alignSelf:"center"
    },
    cashinbutton: {
        height: 60,
        width: "100%",
        padding: 10,
    },
    input: {
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: MEDIUM,
        borderRadius: 5,
        height: 60,
        flexShrink: 1,
        // flexGrow: 1,
        width: 150,
        color: DARK,
        marginBottom: 10,
        justifyContent:"center",
        alignItems:"center"
      },
})

export default PayPandaComponent