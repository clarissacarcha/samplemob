import React, { useState , useRef , useEffect} from 'react'
import {StyleSheet,View,ActivityIndicator , Dimensions} from 'react-native'
import {useNavigation,useRoute} from '@react-navigation/native'
import WebView from 'react-native-webview'
import {useSelector} from 'react-redux'
import { CheckIdleState, FlagSecureScreen , Separator } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const {COLOR , FONT_FAMILY: FONT, FONT_SIZE , SIZE } = CONSTANTS

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'
import {
    NavigationView,
} from "./Components"


const {width,height} = Dimensions.get('window')

export const ToktokWalletPayPandaWebView = ({navigation,route})=> {
  
    const webviewRef = useRef()
    navigation.setOptions({
        headerShown: false,
    }); 
    const cashInAmount = route.params.cashInAmount
    const onCashIn = route.params.onCashIn
    const [mounted, setMounted] = useState(true)
    const [checkurl,setCheckurl] = useState("")
    const [donetransaction,setDoneTransaction] = useState(false)
    const [cashInLogParams,setCashInLogParams] = useState(null)
    const [canGoBack,setCanGoBack] = useState(false);
    const [canGoForward,setCanGoForward] = useState(false);

    const session = useSelector(state=>state.session)
    const constants = useSelector(state=>state.constants)

    const goBack = () => {
        if(canGoBack){
            return webviewRef.current.goBack();
        }
        return navigation.pop();
    }
    const goForward = () => {
        if(canGoForward) webviewRef.current.goForward();
    }

    const initialpaymentData = {
        merchant_id: route.params.merchantId,
        reference_number: route.params.refNo,
        email_address: route.params.email_address,
        payer_name: route.params.payer_name,
        mobile_number: route.params.mobile_number.replace('+63','0'),
        amount_to_pay: route.params.amount_to_pay,
        currency: route.params.currency,
        remarks: "",
        signature: route.params.signature,
        ...(route.params.paymentChoice ? {payment_choice: route.params.paymentChoice} : {})
    }

    const generateInitialPostPaymentDataString = (objectdata)=> {
      
        let datastring = ''
        for(const [key,value] of Object.entries(objectdata)){
            datastring = datastring + `&${key}=${value}`
        }
        return datastring.slice(1)
    } 

    const generatedInitialPaymentData = generateInitialPostPaymentDataString(initialpaymentData)


    useEffect(()=> {
        setMounted(true)
        return ()=> {
            setMounted(false)
        }
    },[])


    const LoadingIndicator = ()=> (
        <View style={{
            flex: 1,
            position: 'absolute',
            top: height/2,
            left: width/2,
        }}>
            <ActivityIndicator color={COLOR.YELLOW} size={24}/>
        </View>
    )


    return (
        <FlagSecureScreen>
        <CheckIdleState>
            <View style={styles.container}> 
            {
                mounted & !donetransaction ? 
                <>
                <NavigationView
                    canGoBack={canGoBack}
                    canGoForward={canGoForward}
                    goBack={goBack}
                    goForward={goForward}
                />
                <Separator/>
                <WebView
                    style={{flex: 1}}
                    ref={webviewRef}
                    source={{
                        // // uri: "https://sandbox.paypanda.ph/api/payment/toktok_transaction_entry",
                        // // uri: constants.paypandaTransactionEndpoint,
                        // uri: route.params.paypandaTransactionUrl,
                        // method: 'POST',
                        // headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
                        // body: generatedInitialPaymentData
                        html: `<html> <body onload="document.forms[0].submit();">
                        <form method="post" action=${route.params.paypandaTransactionUrl}>
                            <input type="hidden" name="merchant_id"  value="${initialpaymentData.merchant_id}">
                            <input type="hidden" name="reference_number" value="${initialpaymentData.reference_number}">
                            <input type="hidden" name="email_address" value="${initialpaymentData.email_address}">
                            <input type="hidden" name="payer_name" value="${initialpaymentData.payer_name}">
                            <input type="hidden" name="mobile_number" value="${initialpaymentData.mobile_number}">
                            <input type="hidden" name="amount_to_pay" value="${initialpaymentData.amount_to_pay}">
                            <input type="hidden" name="currency" value="${initialpaymentData.currency}">
                            <input type="hidden" name="remarks" value="${initialpaymentData.remarks}">
                            <input type="hidden" name="signature" value="${initialpaymentData.signature}">
                            <input type="hidden" name="payment_choice" value="${initialpaymentData.payment_choice}">
                        </form >
                        </body> </html>`
                    }}
                    startInLoadingState
                    renderLoading={()=> <LoadingIndicator/>}
                    onNavigationStateChange={(event)=> {

                      
                        const canGoForward = event.canGoForward
                        const canGoBack = event.canGoBack
                        setCanGoBack(canGoBack)
                        setCanGoForward(canGoForward)

                        // console.log("PAYPANDA: ",event.url)
                        // return;

                       const checkreturnurl = event.url.search(route.params.paypandaReturnUrl)
                        if(checkreturnurl != -1){
                            const {url} = event

                            console.log("PAYPANDA: " , url)

                            let paypandaReferenceNumber = /(?:\&paypanda_refno=).*(?=\&status)/.exec(url)
                            let status = /(?:\&status=).*(?=\&signature)/.exec(url)

                            if(!paypandaReferenceNumber){
                                paypandaReferenceNumber = /(?:\?txnid=).*(?=\&refno)/.exec(url)
                                status = /(?:\&status=).*(?=\&message)/.exec(url)

                                paypandaReferenceNumber = paypandaReferenceNumber[0].slice(7)
                                status = status[0].slice(8)

                            }else{
                                paypandaReferenceNumber = paypandaReferenceNumber[0].slice(16)
                                status = status[0].slice(8)
                            }

                
                            if(checkurl != url){     
                                setCashInLogParams({
                                    status: status,
                                    referenceNumber: route.params.refNo,
                                    paypandaReferenceNumber: paypandaReferenceNumber,
                                    amount: +route.params.amount_to_pay,
                                    createdAt: new Date(),
                                    email: route.params.email_address,
                                    payer: route.params.payer_name
                                })
                                setDoneTransaction(true)
                              
                            }
                            setCheckurl(url)
                        }

                    }}
                />  
                </>
                : mounted &&
                <SuccessfulModal
                    amount={route.params.amount_to_pay}
                    successModalVisible={true}
                    cashInLogParams={cashInLogParams}
                    onCashIn={onCashIn}
                    paymentMethod={route.params.paymentMethod ? route.params.paymentMethod : null}
                />
            }
            </View>
        </CheckIdleState>
        </FlagSecureScreen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    navigationWebview: {
        height: 50,
        width: width,
        backgroundColor: COLOR.DARK,
        flexDirection: "row",
    },
    webviewnavLabel: {
        color: COLOR.ORANGE,
    },
    navigationWebbtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    donetransaction: {
        flex: 1,
        
    },
    donetransactioncontent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    donetransactionButton: {
        height: 60,
        width: "100%",
        padding: 10,
    }
})
