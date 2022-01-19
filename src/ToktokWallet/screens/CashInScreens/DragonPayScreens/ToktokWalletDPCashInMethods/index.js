import React , {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ActivityIndicator} from 'react-native'
import {useMutation,useLazyQuery,useQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {POST_CASH_IN_PAYPANDA_REQUEST,POST_REQUEST_CASH_IN,GET_CASH_IN_PARTNER_TYPES,POST_COMPUTE_PROCESSING_FEE} from 'toktokwallet/graphql'
import { Separator , CheckIdleState , DisabledButton } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import {YellowButton,HeaderBack,HeaderTitle } from 'src/revamp';
import { SomethingWentWrong } from 'src/components'
import { useAccount } from 'toktokwallet/hooks'
import { TransactionUtility } from 'toktokwallet/util'
import { useAlert , usePrompt } from 'src/hooks'
import {onErrorAlert} from 'src/util/ErrorUtility';
import { AlertOverlay } from 'src/components'

//SELF IMPORTS
import {
    PaymentMethod
} from "./Components";

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS


export const ToktokWalletDPCashInMethods = ({navigation , route})=> {

    const { transactionType , amount , cashInAmount , onCashIn } = route.params 
    const { tokwaAccount }  = useAccount();
    const [processingFee ,setProcessingFee] = useState(0);
    const [paymentMethod , setPaymentMethod] = useState("");
    const [cashInMethods , setCashInMethods] = useState(null);
    const [paymentChoice,setPaymentChoice] = useState(null);
    const alert = useAlert();
    const prompt = usePrompt();

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In','']}/>,
    })

    const [getCashInPartnerTypes,{data: getMethodsData , error: getMethodsError , loading: getMethodsLoading }] = useLazyQuery(GET_CASH_IN_PARTNER_TYPES, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt
            })
        },
        onCompleted: ({getCashInPartnerTypes})=>{
            setCashInMethods(getCashInPartnerTypes)
        }
    })

    useEffect(()=>{
        getCashInPartnerTypes()
    },[])

    const [postComputeProcessingFee, {loading: postComputePFLoading}] = useMutation(POST_COMPUTE_PROCESSING_FEE,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt
            })
        },
        onCompleted: ({postComputeProcessingFee})=>{
            setProcessingFee(postComputeProcessingFee.processingFee)
            navigation.navigate("ToktokWalletReviewAndConfirm", {
                label:"Cash In" , 
                event: "Cash In Dragon Pay",
                data: {
                        method: paymentMethod, 
                        amount: amount,
                        accountName: `${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`,
                        accountNumber: tokwaAccount.mobileNumber,
                        processingFee: postComputeProcessingFee.processingFee,
                    },
                isSwipe: true,
                swipeTitle: `Confirm`,
                onSwipeFail: onSwipeFail,
                onSwipeSuccess: onSwipeSuccess,
            })
        }
    })


    const [postRequestCashIn, {loading: cashInLoading}] = useMutation(POST_REQUEST_CASH_IN, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postRequestCashIn})=>{
            return navigation.navigate("ToktokWalletTPINValidator", {
                callBackFunc: proceedToPaypandaPortal,
            })
        },
        onError: (error) => {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt
            })
        }
    })

    const [postCashInPayPandaRequest , {data,error,loading}] = useMutation(POST_CASH_IN_PAYPANDA_REQUEST , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt
            })
        },
        onCompleted: ({postCashInPayPandaRequest})=>{
            navigation.pop(); // remove TPIN/OTP Validator Screen;
            navigation.navigate("ToktokWalletPayPandaWebView", {
                merchantId: postCashInPayPandaRequest.merchantId,
                refNo: postCashInPayPandaRequest.refNo,
                signature: postCashInPayPandaRequest.signature,
                email_address: tokwaAccount.person.emailAddress,
                payer_name: `${tokwaAccount.person.firstName}${tokwaAccount.person.middleName ? " " + tokwaAccount.person.middleName : ""} ${tokwaAccount.person.lastName}`,
                mobile_number: tokwaAccount.mobileNumber,
                amount_to_pay: amount,
                currency: tokwaAccount.wallet.currency.code,
                walletId: tokwaAccount.wallet.id,
                transactionTypeId: transactionType.id,
                paypandaTransactionUrl: postCashInPayPandaRequest.paypandaTransactionEntryEndpoint,
                paypandaReturnUrl: postCashInPayPandaRequest.paypandaReturnUrlEndpoint,
                paypandaStaginReturnUrl: postCashInPayPandaRequest.paypandaReturUrlStagingEndpoint,
                cashInAmount: cashInAmount,
                onCashIn: onCashIn,
                processingFee: processingFee,
                paymentMethod: paymentMethod,
                paymentChoice: paymentChoice
            })
        }
    })

    const proceedToPaypandaPortal = ({pinCode = null , Otp = null})=> {
        postCashInPayPandaRequest({
            variables: {
                input: {
                    provider: transactionType.id,
                    amount: +amount,
                    currencyId: tokwaAccount.wallet.currency.id,
                    walletId: tokwaAccount.wallet.id,
                    pinCode: pinCode,
                    paymentMethod: paymentMethod,
                }
            }
        })
      }
  
      const onSwipeFail = (e)=> {
          console.log(e)
      }
  
      const onSwipeSuccess = ()=> {
          postRequestCashIn();
      }


      const ProcessPayment = (method , paymentChoice)=> {

        // CALL PROCESSING FEE PAYPANDA API HERE

        setPaymentMethod(method);
        setPaymentChoice(paymentChoice)
        postComputeProcessingFee({
            variables: {
                input: {
                    amountToPay: +amount,
                    paymentChoice
                }
            }
        })
     
      }
      


    return (
        <CheckIdleState>
            <AlertOverlay visible={loading || postComputePFLoading || cashInLoading}/>
            <Separator/>
            <View style={styles.container}>
                <View style={styles.paymentoptions}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Select payment method</Text>
                </View>
                <View style={styles.content}>
                    {/* <PaymentMethod onPress={()=>ProcessPayment("Online")} label="Online Banking"/>
                    <PaymentMethod onPress={()=>ProcessPayment("OTC")} label="Over the Counter"/> */}
                    {
                        !cashInMethods
                        ?  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size={24} color={COLOR.YELLOW} />
                        </View>
                        : 
                        <>
                        {
                            cashInMethods.map((method,index)=>{
                                return  <PaymentMethod onPress={()=>ProcessPayment(method.name, method.transactionTypeId)} label={method.name}/>
                            })
                        }
                        </>
                    }
                </View>
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
    },
    content: {
        flex: 1,
    }
})