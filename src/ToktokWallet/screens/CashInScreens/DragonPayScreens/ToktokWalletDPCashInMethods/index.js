import React , {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ActivityIndicator, FlatList, RefreshControl} from 'react-native'
import {useMutation,useLazyQuery,useQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {POST_CASH_IN_PAYPANDA_REQUEST,POST_REQUEST_CASH_IN,GET_CASH_IN_PARTNER_TYPES,POST_COMPUTE_PROCESSING_FEE} from 'toktokwallet/graphql'
import { Separator , CheckIdleState , DisabledButton , NoData , BuildingBottom } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import {YellowButton,HeaderBack,HeaderTitle,VectorIcon,ICON_SET } from 'src/revamp';
import { SomethingWentWrong } from 'src/components'
import { useAccount } from 'toktokwallet/hooks'
import { TransactionUtility } from 'toktokwallet/util'
import { useAlert , usePrompt } from 'src/hooks'
import {onErrorAlert} from 'src/util/ErrorUtility';
import { AlertOverlay } from 'src/components'

//SELF IMPORTS
import {
    ConfirmCreditCardModal,
    PaymentMethod
} from "./Components";

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS


export const ToktokWalletDPCashInMethods = ({navigation , route})=> {

    const { transactionType , amount , cashInAmount , onCashIn } = route.params 
    const { tokwaAccount }  = useAccount();
    const [processingFee ,setProcessingFee] = useState(0);
    const [paymentMethod , setPaymentMethod] = useState("");
    const [visible,setVisible] = useState(false);
    const [cashInMethods , setCashInMethods] = useState(null);
    const [paymentChoice,setPaymentChoice] = useState(null);
    const [cashInPartnerTypeId,setCashInPartnerTypeId] = useState(null);
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
                prompt,
                alert
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
                prompt,
                alert,
            })
        },
        onCompleted: ({postComputeProcessingFee})=>{
            setProcessingFee(postComputeProcessingFee.processingFee)
        }
    })


    const [postRequestCashIn, {loading: cashInLoading}] = useMutation(POST_REQUEST_CASH_IN, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postRequestCashIn})=>{
            return navigation.navigate("ToktokWalletTPINValidator", {
                callBackFunc: proceedToPaypandaPortal,
                btnLabel: "Cash In"
            })
        },
        onError: (error) => {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt,
                alert
            })
        }
    })

    const [postCashInPayPandaRequest , {data,error,loading}] = useMutation(POST_CASH_IN_PAYPANDA_REQUEST , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt,
                alert
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
                paymentChoice: paymentChoice,
                providerServiceFee: postCashInPayPandaRequest.providerServiceFee
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
                    cashInPartnerTypeId: cashInPartnerTypeId,
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


      const ProcessPayment = (method , paymentChoice , cashInPartnerTypeId )=> {

        // CALL PROCESSING FEE PAYPANDA API HERE

        setPaymentMethod(method);
        setPaymentChoice(paymentChoice)
        setCashInPartnerTypeId(cashInPartnerTypeId)

        if(method != "Online Banking Debit/Credit Card"){
            proceedPayment({
                paymentChoice,
                method,
            });
            return;
        }

        setVisible(true)
        return;
      }

      const proceedPayment = ({
          paymentChoice,
          method
      })=> {
    
        postComputeProcessingFee({
            variables: {
                input: {
                    amountToPay: +amount,
                    paymentChoice
                }
            }
        }).then(({data : {postComputeProcessingFee}})=> {
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
                swipeTitle: `Swipe to Confirm`,
                onSwipeFail: onSwipeFail,
                onSwipeSuccess: onSwipeSuccess,
            })
        }).catch(error=>console.log(error))
      }
      


    return (
        <CheckIdleState>
            <ConfirmCreditCardModal
                    visible={visible}
                    setVisible={setVisible}
                    onPress={()=> {
                        proceedPayment({
                            paymentChoice,
                            method: paymentMethod
                        })
                        setVisible(false)
                    }}
            />
            <AlertOverlay visible={loading || postComputePFLoading || cashInLoading}/>
            <Separator/>
            <View style={styles.container}>
                <View style={styles.paymentoptions}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Cash in Method</Text>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",marginTop:5}}>
                    <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.XL} />  
                    <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.M,marginLeft: 3,marginTop: -2,marginRight: 16}}>Your toktokwallet balance is considered non-transferable depending on the cash in method used. If you cash in via Credit Card or Foreign Debit Card, you are not allowed to transfer this fund to any toktokwallet users account and/or other bank accounts. You can only use this as payments for goods and services.</Text> 
                    </View>
                </View>
                <View style={styles.content}>
                    {
                        !cashInMethods
                        ?  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size={36} color={COLOR.YELLOW} />
                        </View>
                        :  cashInMethods.length == 0
                            ? <NoData/>
                            : cashInMethods.map((item,index)=> {
                                return <PaymentMethod onPress={()=>ProcessPayment(item.name, item.transactionTypeId , item.id)} label={item.name}/>
                            })
                    }
                </View>
                <BuildingBottom/>
            </View>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        // padding: 16,
    },
    headerReminder: {
        padding: 16,
        backgroundColor:"#FFF2D5"
    },
    paymentoptions: {
        backgroundColor: "#FFF2D5",
        padding: 16,
        justifyContent:"center"
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    },
})
