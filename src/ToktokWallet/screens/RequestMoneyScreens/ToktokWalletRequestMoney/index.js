import React , {useState , createRef} from 'react'
import {View , Text , TouchableOpacity , StyleSheet, ScrollView,ActivityIndicator } from 'react-native'
import {HeaderImageBackground,HeaderTitle,CheckIdleState,Separator,DisabledButton , PromptModal} from 'toktokwallet/components'
import { YellowButton , } from 'src/revamp'
import { useAccount } from 'toktokwallet/hooks'
import { numberFormat } from 'toktokwallet/helper'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {  POST_REQUEST_MONEY } from 'toktokwallet/graphql'
import { useMutation } from '@apollo/react-hooks'
import {useAlert} from 'src/hooks/useAlert'
import {onErrorAlert} from 'src/util/ErrorUtility'
import { AlertOverlay } from 'src/components'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN } = CONSTANTS

//SELF IMPORTS
import { 
    ContextProvider, 
    EnterMobileNo , 
    Favorites , 
    EnterNote 
} from "../../SendMoneyScreens/ToktokWalletSendMoney/Components"
import {
    EnterAmount,
    PendingEnvelopeIcon
} from './Components'

export const ToktokWalletRequestMoney = ({navigation,route})=> {

    navigation.setOptions({
        headerShown:false,
    })
    const favoritesRef = createRef()
    const {tokwaAccount,refreshWallet} = useAccount();
    const [mobileNo,setMobileNo] = useState("")
    const [amount,setAmount] = useState("")
    const [note,setNote] = useState("")
    const [proceed,setProceed] = useState(false)
    const [swipeEnabled,setSwipeEnabled] = useState(false)
    const [recipientDetails,setRecipientDetails] = useState({
        id: null,
        person: {
            firstName: "",
            middleName: "",
            lastName: ""
        },
    })
    const [getAccountLoading,setGetAccountLoading] = useState(false)
    const [showPrompt , setShowPrompt] = useState(false)
    const alert = useAlert()

    const [postRequestMoney , {loading}] = useMutation(POST_REQUEST_MONEY,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postRequestMoney})=>{
            setShowPrompt(true)
        },
        onError: (error) => onErrorAlert({alert,error})
    })

    const onSwipeFail = ()=> {

    }

    const onSwipeSuccess = ()=> {
        postRequestMoney({
            variables: {
                input: {
                    sourceAccountId: recipientDetails.id,
                    amount: +amount,
                    note: note,
                }
            }
        })
    }

    const onPress = ()=> {
        setShowPrompt(false);
        navigation.pop();
        navigation.replace("ToktokWalletRequestMoney")
    }

    const confirmRequest = ()=> {
        return navigation.navigate("ToktokWalletReviewAndConfirm", {
            label: "Request Money",
            event: "Request Money",
            isSwipe: true,
            onSwipeFail: onSwipeFail,
            onSwipeSuccess: onSwipeSuccess,
            swipeTitle: `Swipe to Request ${tokwaAccount.wallet.currency.code} ${amount != "" ? numberFormat(amount) : "0"}`,
            data: {
                amount: amount,
                note: note,
                recipient: {
                    name: `${recipientDetails.person}`,
                    mobileNo: recipientDetails.mobileNumber,
                },
            }
        })
    }


    return (
        <CheckIdleState> 
             <AlertOverlay visible={loading}/>
              <PromptModal 
                    visible={showPrompt}
                    event="success"
                    message="Your request has been sent."
                    title="Successful!"
                    onPress={onPress}
                />
            <ContextProvider>
            <View style={styles.container}>
                <View style={styles.headings}>
                    <HeaderImageBackground>
                    <HeaderTitle label="Request Money"/>
                    <View style={{flex: 1,justifyContent:"flex-end",paddingBottom: 45}}>
                        <View>  
                            <View style={styles.walletContent}>
                                    <View>
                                        <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance ? tokwaAccount.wallet.balance : 0)}</Text>
                                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Available Balance</Text>
                                    </View>
                                    <TouchableOpacity onPress={()=> navigation.navigate("ToktokWalletPaymentOptions" ,{
                                        onCashIn: null,
                                        amount: 0,
                                    })} style={styles.topUp}>
                                            <View style={styles.topUpbtn}>
                                                    <FIcon5 name={'plus'} size={12}/> 
                                            </View>
                                    </TouchableOpacity>
                                    <PendingEnvelopeIcon
                                        navigation={navigation}
                                    />
                            </View>
                        </View>
                    </View>
                    </HeaderImageBackground>
                </View>
                <EnterMobileNo
                        mobileNo={mobileNo}
                        setMobileNo={setMobileNo}
                        navigation={navigation} 
                        setProceed={setProceed} 
                        proceed={proceed}
                        setRecipientDetails={setRecipientDetails}
                        recipientDetails={recipientDetails}
                        tokwaAccount={tokwaAccount}
                        setGetAccountLoading={setGetAccountLoading}
                        favoritesRef={favoritesRef}
                        // placeHolder="gg"
                />

                {/* MAIN CONTENT HERE */}
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 16}}
                    style={{paddingHorizontal: MARGIN.M,flex:1 }}
                >

                    {
                        proceed 
                        ? <>
                            <EnterAmount 
                                setSwipeEnabled={setSwipeEnabled}
                                tokwaAccount={tokwaAccount}
                                amount={amount} 
                                setAmount={setAmount}
                                recipientDetails={recipientDetails}
                                senderDetails={null}
                            />
                            <EnterNote
                                note={note}
                                setNote={setNote}
                            />
                        </>
                        :  <View style={{marginTop: 10}}>
                                <Text style={{fontFamily: FONT.BOLD,fontWeight:"bold", fontSize: FONT_SIZE.M}}>Enter number to request</Text>
                                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.DARK}}>You can click the "Address Book" to open your contact list.</Text>
                            </View>
                    }

                    {
                        getAccountLoading &&
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <ActivityIndicator color={COLOR.YELLOW}/>
                        </View>
                    }

                    <Favorites 
                        ref={favoritesRef}
                        setMobileNo={setMobileNo}
                    />  

                    <View style={{height: SIZE.FORM_HEIGHT,marginTop: 50,justifyContent:"flex-end"}}>
                         {
                             proceed && swipeEnabled
                             ? <YellowButton label="Proceed" onPress={confirmRequest}/>
                             : <DisabledButton label="Proceed"/>
                         }
                    </View>

                </ScrollView>
                {/* END MAIN CONTENT */}

            </View>
            </ContextProvider>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    headings: {
        height: 190,
        backgroundColor:"black"
    },  
    walletContent: {
        flexDirection: "row",
        paddingHorizontal: MARGIN.M,
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