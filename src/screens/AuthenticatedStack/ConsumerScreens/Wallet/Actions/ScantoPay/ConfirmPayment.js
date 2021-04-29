import React, {useState,useEffect,useRef} from 'react'
import {View,Text,StyleSheet,Image,Alert,TextInput,KeyboardAvoidingView,Platform,ScrollView} from 'react-native'
import {HeaderBack, HeaderTitle} from '../../../../../../components'
import { BUTTON_HEIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES, INPUT_HEIGHT } from '../../../../../../res/constants'
import {numberFormat} from '../../../../../../helper'
import { PATCH_FUND_TRANSFER , GET_DAILY_MONTHLY_YEARLY_INCOMING , GET_DAILY_MONTHLY_YEARLY_OUTGOING} from '../../../../../../graphql'
import {useQuery,useMutation,useLazyQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import { onError , onErrorAlert} from '../../../../../../util/ErrorUtility';
import SuccessfulModal from '../SendMoney/SuccessfulModal'
import {useAlert} from '../../../../../../hooks/useAlert'
import { BlackButton } from '../../../../../../revamp';
import ConfirmBottomSheet from '../../Components/ConfirmBottomSheet';
import ConfirmModalContent from './ConfirmModalContent'

const ConfirmPayment = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Send Money','']}/>,
    })
    const alert = useAlert()
    const { recipientInfo, walletinfo } = route.params
    const session = useSelector(state=>state.session)
    const [tempAmount,setTempAmount] = useState("")
    const [amount,setAmount] = useState("")
    const [swipeEnabled,setSwipeEnabled] = useState(false)
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")
    const [walletinfoParams,setWalletinfoParams] = useState({
        id: "",
        referenceNumber: "",
        createdAt: ""
    })
    const [recipientDetails,setRecipientDetails] = useState(null)
    const [senderDetails,setSenderDetails] = useState(null)
    const bottomSheetRef = useRef()

    const [patchFundTransfer] = useMutation(PATCH_FUND_TRANSFER, {
        variables: {
            input: {
                amount: +amount,
                sourceUserId: session.user.id,
                destinationUserId: recipientInfo.id,
            }
        },
        onError: (error)=> {
            onErrorAlert({alert , error})
            navigation.pop()
        },
        onCompleted: (response)=> {
            setWalletinfoParams(response.patchFundTransfer.walletLog)
            setSuccessModalVisible(true)
        }
    })


    const [getDailyMonthlyYearlyIncoming] = useLazyQuery(GET_DAILY_MONTHLY_YEARLY_INCOMING, {
        fetchPolicy: 'network-only',
        onError: (error)=>{

        },
        onCompleted: (response)=> {
            setRecipientDetails(response.getDailyMonthlyYearlyIncoming)
        }
    })

    const [getDailyMonthlyYearlyOutgoing] = useLazyQuery(GET_DAILY_MONTHLY_YEARLY_OUTGOING, {
        fetchPolicy: 'network-only',
        onError: (error)=>{

        },
        onCompleted: (response)=> {
            setSenderDetails(response.getDailyMonthlyYearlyOutgoing)
        }
    })

    useEffect(()=>{
        // getDailyMonthlyYearlyIncoming({
        //     variables: {
        //         input: {
        //             userID: recipientInfo.id
        //         }
        //     }
        // })

        // getDailyMonthlyYearlyOutgoing({
        //     variables: {
        //         input: {
        //             userID: session.user.id
        //         }
        //     }
        // })
    },[])

    const onSwipeSuccess = ()=> {
        return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: patchFundTransfer})
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const changeAmount = (value)=>{
        const num = value.replace(/[^0-9]/g, '')
        if(num.length > 8) return
        setTempAmount(num)
        setAmount(num * 0.01)

        if((num * 0.01) >= 1 && (num * 0.01) <= walletinfo.balance){
            setSwipeEnabled(true)
            setErrorMessage("")
        }else if((num * 0.01) < 1 && num != ""){
            setSwipeEnabled(false)
            setErrorMessage(`Please Enter atleast ${'\u20B1'} 1.00`)
        }else{
            setErrorMessage("")
        }

        // checkSenderWalletLimitation(num * 0.01)
        // checkRecipientWalletLimitation(num * 0.01)

        if((num * 0.01) > walletinfo.balance){
            setSwipeEnabled(false)
            return setErrorMessage("You do not have enough balance")
        }

    }

    const checkRecipientWalletLimitation = (amount)=> {
        const incomingRecords = recipientDetails
        const walletLimit = incomingRecords.walletlimit


        if(walletLimit.walletSize){
            if((incomingRecords.walletbalance + +amount ) > walletLimit.walletSize){
                setSwipeEnabled(false)
                return setErrorMessage("Recipient wallet size limit is reached.")
            }
        }

        if(walletLimit.incomingValueDailyLimit){
            if((incomingRecords.daily + +amount ) > walletLimit.incomingValueDailyLimit){
                setSwipeEnabled(false)
                return setErrorMessage("Recipient daily incoming wallet limit is reached.")
            }
        }

        if(walletLimit.incomingValueMonthlyLimit){
            if((incomingRecords.monthly + +amount ) > walletLimit.incomingValueMonthlyLimit){
                setSwipeEnabled(false)
                return setErrorMessage("Recipient monthly incoming wallet limit is reached.")
            }
        }

        if(walletLimit.incomingValueAnnualLimit){
            if((incomingRecords.yearly + +amount ) > walletLimit.incomingValueAnnualLimit){
                setSwipeEnabled(false)
                return setErrorMessage("Recipient annual incoming wallet limit is reached.")
            }
        }

 
        return 
    }

    const checkSenderWalletLimitation = (amount)=> {
        const outgoingRecords = senderDetails
        const walletLimit = outgoingRecords.walletlimit

        if(walletLimit.outgoingValueDailyLimit){
            if((outgoingRecords.daily + +amount ) > walletLimit.outgoingValueDailyLimit){
                setSwipeEnabled(false)
                return setErrorMessage("Your daily outgoing wallet is reached.")
            }
        }

        if(walletLimit.outgoingValueMonthlyLimit){
            if((outgoingRecords.monthly + +amount ) > walletLimit.outgoingValueMonthlyLimit){
                setSwipeEnabled(false)
                return setErrorMessage("Your monthly outgoing wallet limit is reached.")
            }
        }

        if(walletLimit.outgoingValueAnnualLimit){
            if((outgoingRecords.yearly + +amount ) > walletLimit.outgoingValueAnnualLimit){
                setSwipeEnabled(false)
                return setErrorMessage("Your annual outgoing wallet limit is reached.")
            }
        }

        return
    }


    const thumbIconComponent = ()=> (
        <View>
            <Image style={{height: 15,width: 20}} source={require('../../../../../../assets/icons/walletSwipenext.png')}/>
        </View>
    )


    return (
        <>
        <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount} 
                recipient={{
                    name: `${recipientInfo.name}`,
                    mobileNo: recipientInfo.contactNo,
                }}
                walletinfoParams={walletinfoParams}
        />
        <View  
                // keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 90}  
                // behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.container}
        >
            <ScrollView style={styles.content}>
                    <Text style={{marginLeft: 10, marginTop: 20, fontFamily: FONT_MEDIUM ,fontSize: 16}}>Send to</Text>
                    <View style={styles.receiverInfo}>
                        <Image style={{height: 50,width: 50,marginRight: 10}} resizeMode="contain" source={{uri: recipientInfo.image}}/>
                        <View>
                            <Text style={{fontFamily: FONT_MEDIUM,fontSize: SIZES.M}}>{recipientInfo.name}</Text>
                            <Text style={{fontSize:SIZES.S,color:"#A6A8A9",fontFamily: FONT_REGULAR, marginTop:5,}}>{recipientInfo.contactNo}</Text>
                        </View>
                    </View>

                    <View style={{padding: 10,paddingTop: 20,}}>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16,marginBottom: 10}}>Current Balance: PHP {numberFormat(walletinfo.balance)}</Text>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 14}}>Enter Amount</Text>
                        <View style={styles.amount}>
                                <Text style={{fontSize: SIZES.M,fontFamily: FONT_MEDIUM,alignSelf:"center",marginLeft: 5,}}>PHP </Text>
                                <TextInput
                                        caretHidden
                                        value={tempAmount}
                                        onChangeText={changeAmount}
                                        style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1,fontSize: SIZES.M}}
                                        keyboardType="numeric"
                                        returnKeyType="done"
                                />
                                <View style={{fontSize: 12,fontFamily: FONT_REGULAR,paddingVertical: 5,marginLeft: 5,alignSelf: "center",flex: 1}}>
                                    <Text style={{fontFamily: FONT_MEDIUM}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                                </View>
                        </View>
                         {
                             errorMessage != "" && <Text style={{fontFamily: FONT_REGULAR , color: "red",fontSize: 12,marginTop: 5}}>{errorMessage}</Text>
                         }
                    </View>
            </ScrollView>

            <View style={{paddingHorizontal: 10}}> 
            {
                swipeEnabled
                ? <BlackButton label="Send" onPress={()=>bottomSheetRef.current.snapTo(1)} />
                : <View style={{width: "100%", height: BUTTON_HEIGHT,justifyContent:"center",alignItems: "center", backgroundColor:"gray",borderRadius: 5}}>
                        <Text style={{fontFamily: FONT_MEDIUM, fontSize: SIZES.M,color:"white"}}>Send</Text>
                </View>
            }
            </View>   

             
            <ConfirmBottomSheet
                 bottomSheetRef={bottomSheetRef}
                 headerTitle="Review and Confirm" 
                 btnLabel="Confirm"
                 SwipeButtonEnabled
                 SwipeButtonArgs={
                  {
                    enabled: swipeEnabled,
                    title: `Swipe to send PHP ${amount != "" ? numberFormat(amount) : "0"}`,
                    onSwipeFail: onSwipeFail,
                    onSwipeSuccess: onSwipeSuccess
                  }
                 }
            >
                    <ConfirmModalContent amount={amount} recipientDetails={recipientInfo}/>
            </ConfirmBottomSheet>
        </View>
      </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        flex: 1,
    },
    swipeContainer: {
       alignSelf:"center",
       marginBottom: 20,
    },
    receiverInfo: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection:"row",
        borderBottomWidth: 0.5,
        borderColor:"silver"
    },
    amount: {
        height: INPUT_HEIGHT,
        width: "100%",
        borderColor: "silver",
        borderWidth: .5,
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
    }

})

export default ConfirmPayment