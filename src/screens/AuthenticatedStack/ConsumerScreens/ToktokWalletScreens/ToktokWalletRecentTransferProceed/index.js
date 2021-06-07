import React, {useState} from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables'
import {useSelector} from 'react-redux'
import { numberFormat } from '../../../../../helper'
import { ICON_SET, VectorIcon, YellowButton } from '../../../../../revamp'
import {useAlert} from '../../../../../hooks/useAlert'
import {onErrorAlert} from '../../../../../util/ErrorUtility'
import {useMutation} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT,PATCH_FUND_TRANSFER} from '../../../../../graphql'
import { POST_FUND_TRANSFER } from '../../../../../graphql/toktokwallet'
import { AlertOverlay } from '../../../../../components'

//SELF IMPORTS
import {HeaderImageBackground,HeaderTitle,DisabledButton,EnterPinCode} from '../Components'
import RecipientInfo from './RecipientInfo';
import EnterAmount from './EnterAmount';
import EnterNote from './EnterNote';
import SuccessfulModal from './SuccessfulModal';

const ToktokWalletRecentTransferProceed = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false
    })
    const alert = useAlert()
    const recentTransfer = route.params.recentTransfer
    const tokwaAccount = useSelector(state => state.toktokWallet)

    const [note,setNote] = useState(recentTransfer.note)
    const [amount,setAmount] = useState(recentTransfer.amount)
    const [swipeEnabled,setSwipeEnabled] = useState(false)
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [walletinfoParams,setWalletinfoParams] = useState({
        id: "",
        referenceNumber: "",
        createdAt: ""
    })
    const [pinCodeAttempt,setPinCodeAttempt] = useState(6)
    const [openPinCode,setOpenPinCode] = useState(false)

    const [postFundTransfer , {data ,error , loading }] = useMutation(POST_FUND_TRANSFER, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            const {graphQLErrors, networkError} = error;
            if(graphQLErrors[0].message == "Wallet Hold"){
                setOpenPinCode(false)
                navigation.navigate("ToktokWalletHomePage")
                navigation.replace("ToktokWalletHomePage")
                return navigation.push("ToktokWalletRestricted", {component: "onHold"})
            }

            if(graphQLErrors[0].message == "Invalid Pincode"){
                return setPinCodeAttempt(graphQLErrors[0].payload.remainingAttempts)
            }
            setOpenPinCode(false)
            onErrorAlert({alert,error})
            return navigation.pop()
        },
        onCompleted: ({postFundTransfer})=> {
            console.log(JSON.stringify(postFundTransfer))
            setOpenPinCode(false)
            setWalletinfoParams(postFundTransfer)
            setSuccessModalVisible(true)
        }
    })

    const reviewAndConfirm = ()=> {
        return navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: "Send Money",
            isSwipe: true,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            swipeTitle: `Send ${tokwaAccount.wallet.currency.code} ${amount != "" ? numberFormat(amount) : "0"}`,
            data: {
                amount: amount,
                note: note,
                recipient: {
                    name: `${recentTransfer.destinationPerson.firstName} ${recentTransfer.destinationPerson.lastName}`, 
                    mobileNo: recentTransfer.destinationWallet.account.mobileNumber,
                },
            }
        })
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const onSwipeSuccess = ()=> {
        setPinCodeAttempt(6)
        return setOpenPinCode(true)
        // return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: postFundTransfer})
    }

    const Proceed = (pinCode)=> {
        postFundTransfer({
            variables: {
                input: {
                    amount: +amount,
                    note: note,
                    destinationMobileNo: recentTransfer.destinationWallet.account.mobileNumber,
                    pinCode: pinCode
                }
            },
        })
    }

    return (
        <>
        <EnterPinCode 
            visible={openPinCode} 
            setVisible={setOpenPinCode} 
            loading={loading}
            pinCodeAttempt={pinCodeAttempt}
            callBackFunc={Proceed}
        >
             <AlertOverlay visible={loading} />
        </EnterPinCode>
        <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount}
                note={note} 
                recipient={{
                    name: `${recentTransfer.destinationPerson.firstName} ${recentTransfer.destinationPerson.lastName}`, 
                    mobileNo: recentTransfer.destinationWallet.account.mobileNumber,
                }}
                walletinfoParams={walletinfoParams}
            />
        <View style={{flex:1,backgroundColor:"white"}}>
             <View style={styles.headings}>
                 <HeaderImageBackground>
                 <HeaderTitle label="Send Money"/>
                 <View style={{height: 32}}/>
                 <View style={styles.walletContent}>
                        <View>
                            <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance ? tokwaAccount.wallet.balance : 0)}</Text>
                            <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Available Balance</Text>
                        </View>
                        <TouchableOpacity onPress={()=> navigation.navigate("ToktokWalletPaymentOptions")} style={styles.topUp}>
                                    <View style={styles.topUpbtn}>
                                            <VectorIcon iconSet={ICON_SET.FontAwesome5} color={'black'} name="plus" size={12}/>
                                    </View>
                        </TouchableOpacity>
                 </View>
                 </HeaderImageBackground>
                 <RecipientInfo recentTransfer={recentTransfer}/>
             </View>
             <View style={{flex:1 ,padding: 16,marginTop: 10,}}>
             <EnterAmount 
                    setSwipeEnabled={setSwipeEnabled}
                    tokwaAccount={tokwaAccount}
                    amount={amount} 
                    setAmount={setAmount}
                />
                <EnterNote
                    note={note}
                    setNote={setNote}
                />
             </View>
             <View style={{height: 70,padding: 16, justifyContent:"flex-end"}}>
                {
                    swipeEnabled
                    ? <YellowButton label="Proceed" onPress={reviewAndConfirm}/>
                    : <DisabledButton label="Proceed" />
                }

            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    headings: {
        height: 190,
        backgroundColor:"black"
    }, 
    walletContent: {
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 16,
        alignItems:"flex-start",
        justifyContent:"flex-start"
    },
    topUp: {
        justifyContent:"flex-start",
        alignItems: "center",
        width: 40,
        marginLeft: 5,
        paddingTop: 10,
    },
    topUpbtn: {
        height: 34,
        width: 34,
        borderRadius: 100,
        borderWidth: 2,
        justifyContent:"center",
        alignItems:"center",
    },
})

export default ToktokWalletRecentTransferProceed