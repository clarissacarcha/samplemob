import React, { useState , useRef , useEffect} from 'react'
import {StyleSheet,View,Modal,Button, Text , ActivityIndicator , Dimensions , TouchableOpacity , Alert , Platform} from 'react-native'
import {useNavigation,useRoute} from '@react-navigation/native'
import {MEDIUM,DARK,COLOR,ORANGE} from '../../../../../../res/constants'
import WebView from 'react-native-webview'
import { join } from 'lodash'


const {width,height} = Dimensions.get('window')

const WebViewComponent = ()=> {
    const navigation = useNavigation()
    const route = useRoute()
    const webviewRef = useRef()
    navigation.setOptions({
        headerShown: false,
    }); 

    const [cangoBack,setCanGoBack] = useState(false)
    const [cangoForward,setCanGoForward] = useState(false)
    const [mounted, setMounted] = useState(true)

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

    let generatedInitialPaymentData = generateInitialPostPaymentDataString(initialpaymentData)


    useEffect(()=> {
        setMounted(true)
        return ()=> {
            setMounted(false)
        }
    },[])

    const webviewGoBack = ()=> {
        webviewRef.current.goBack()
    }

    const webviewGoForward = ()=> {
        webviewRef.current.goForward()
    }

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


    const NavigationWebView = ({cangoBackProp,cangoForwardProp})=> {

        return (
            <>
                <View style={[styles.navigationWebview,!cangoBackProp && !cangoForwardProp && {display: "none"}]}>
                    {
                        cangoBackProp &&
                        <TouchableOpacity onPress={webviewGoBack} style={styles.navigationWebbtn}>
                                <Text style={styles.webviewnavLabel}>Back</Text>
                        </TouchableOpacity>
                    }

                    {
                        cangoForwardProp &&
                        <TouchableOpacity onPress={webviewGoForward} style={styles.navigationWebbtn}>
                                <Text style={styles.webviewnavLabel}>Forward</Text>
                        </TouchableOpacity>
                    }
                  
               </View>
            </>
        )
    }
    

    return (
        <>
            <View style={styles.container}> 
            {
                mounted && 
                <WebView
                    style={{flex: 1}}
                    ref={webviewRef}
                    source={{
                        uri: 'http://35.173.0.77/dev/paypanda/api/payment/transaction_entry',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
                        body: generatedInitialPaymentData
                    }}
                    startInLoadingState
                    renderLoading={()=> <LoadingIndicator/>}
                    onNavigationStateChange={(event)=> {
                        setCanGoBack(event.canGoBack)
                        setCanGoForward(event.canGoForward)
                        let checkreturnurl = event.url.search("http://toktokreturnurl.ph")
                        if(checkreturnurl != - 1){
                            console.log(event.url)
                            // get info then update db or direct nav to wallet and pass in arguments
                            Alert.alert("Successful","", [
                                // {
                                //     text: "Cancel",
                                //     onPress: ()=> null,
                                //     style: 'cancel'
                                // },
                                {
                                    text: "Ok",
                                    onPress: ()=> navigation.navigate("TokTokWallet") // navigation.pop() 
                                }
                            ],
                            {
                                cancelable: false,
                            })
                         
                        }   
                    }}
                />  
            }
                {/* <NavigationWebView cangoBackProp={cangoBack} cangoForwardProp={cangoForward} /> */}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    }
})

export default WebViewComponent