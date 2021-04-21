import React, { useState , useRef , useEffect} from 'react'
import {StyleSheet,View,Modal,Button, Text , ActivityIndicator , Dimensions , TouchableOpacity , Alert , Platform} from 'react-native'
import {useNavigation,useRoute} from '@react-navigation/native'
import {MEDIUM,DARK,COLOR,ORANGE, FONT_MEDIUM} from '../../../../../../res/constants'
import WebView from 'react-native-webview'
import {useSelector} from 'react-redux'
import SuccessfulModal from './SuccessfulModal'


const {width,height} = Dimensions.get('window')

const WebViewComponent = ()=> {
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
                        uri: constants.paypandaTransactionEndpoint,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
                        body: generatedInitialPaymentData
                    }}
                    startInLoadingState
                    renderLoading={()=> <LoadingIndicator/>}
                    onNavigationStateChange={(event)=> {
                        const checkreturnurl = event.url.search("http://toktokreturnurl.ph")
                        if(checkreturnurl != - 1){
                            const {url} = event
                            const reference_number = /(?:\?refno=).*(?=\&paypanda_refno)/g.exec(url)
                            const paypanda_refno = /(?:\&paypanda_refno=).*(?=\&status)/.exec(url)
                            const payment_status = /(?:\&status=).*(?=\&signature)/.exec(url)
                            const signature = /(?:\&signature=).*/.exec(url)
                            const paid_amount = route.params.amount_to_pay
                            const transactionTypeId = route.params.transactionTypeId
        

                            if(checkurl != url){       
                                setCashInLogParams({
                                    status: payment_status[0].slice(8),
                                    referenceNumber: reference_number[0].slice(7),
                                    paypandaReferenceNumber: paypanda_refno[0].slice(16),
                                    amount: +paid_amount,
                                    createdAt: new Date(),
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

export default WebViewComponent