import React, { useState , useRef , useEffect} from 'react'
import {StyleSheet,View,Modal,Button, Text , ActivityIndicator , Dimensions , TouchableOpacity , Alert , Platform} from 'react-native'
import {useNavigation,useRoute} from '@react-navigation/native'
import {MEDIUM,DARK,COLOR,ORANGE, FONT_MEDIUM} from '../../../../../../res/constants'
import WebView from 'react-native-webview'
import {useSelector} from 'react-redux'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'


const {width,height} = Dimensions.get('window')

const ToktoKWalletPayPandaWebView = ()=> {
    const navigation = useNavigation()
    const route = useRoute()
    const webviewRef = useRef()
    navigation.setOptions({
        headerShown: false,
    }); 

    const [mounted, setMounted] = useState(true)
    const [checkurl,setCheckurl] = useState("")
    const [donetransaction,setDoneTransaction] = useState(false)
    const [cashInLogParams,setCashInLogParams] = useState(null)

    const session = useSelector(state=>state.session)
    const constants = useSelector(state=>state.constants)

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
            <ActivityIndicator/>
        </View>
    )


    return (
        <>
            <View style={styles.container}> 
            {
                mounted & !donetransaction ? 
                <WebView
                    style={{flex: 1}}
                    ref={webviewRef}
                    source={{
                        uri: "https://sandbox.paypanda.ph/api/payment/toktok_transaction_entry",
                        // uri: constants.paypandaTransactionEndpoint,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
                        body: generatedInitialPaymentData
                    }}
                    startInLoadingState
                    renderLoading={()=> <LoadingIndicator/>}
                    onNavigationStateChange={(event)=> {

                        console.log(event)
              
                        const checkreturnurl = event.url.search("https://sandbox.paypanda.ph/app/payment/dp_ret")
                        // const checkreturnurl = event.url.search(constants.paypandaReturnUrlEndpoint)
                        https://sandbox.paypanda.ph/app/payment/dp_ret?txnid=0001770000000006&status=S&refno=0001770000000006
                        if(checkreturnurl != -1){
                            const {url} = event

                            const paypandaReferenceNumber = /(?:\&refno=).*/g.exec(url)
                            const status = /(?:\&status=).*(?=\&refno)/.exec(url)

                            if(checkurl != url){     
                                setCashInLogParams({
                                    status: status[0].slice(8),
                                    referenceNumber: route.params.refNo,
                                    paypandaReferenceNumber: paypandaReferenceNumber[0].slice(7),
                                    amount: +route.params.amount_to_pay,
                                    createdAt: new Date(),
                                    email: route.params.email_address,
                                    payer: route.params.payer_name
                                })
                                setDoneTransaction(true)
                              
                            }
                            setCheckurl(url)
                        }
                        
                        const checkreturnOtherUrl = event.url.search("https://stg-wallet.toktok.ph/app/transactions/paypanda_ret")

                        if(checkreturnOtherUrl != -1){ 
                            const {url} = event
                        
                            const paypandaReferenceNumber = /(?:\&paypanda_refno=).*(?=\&status)/g.exec(url)
                            const status = /(?:\&status=).*(?=\&signature)/.exec(url)

                            if(checkurl != url){       
                                setCashInLogParams({
                                    status: status[0].slice(8),
                                    referenceNumber: route.params.refNo,
                                    paypandaReferenceNumber: paypandaReferenceNumber[0].slice(16),
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
                : mounted &&
                <SuccessfulModal
                    amount={route.params.amount_to_pay}
                    successModalVisible={true}
                    cashInLogParams={cashInLogParams}
                />
            }
            </View>
        </>
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
        backgroundColor: DARK,
        flexDirection: "row",
    },
    webviewnavLabel: {
        color: COLOR,
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

export default ToktoKWalletPayPandaWebView
