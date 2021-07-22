import React, { useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,ActivityIndicator} from 'react-native'
import {HeaderBack, YellowButton} from '../../../../../../revamp'
import { numberFormat } from '../../../../../../helper'
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables'
import {useSelector} from 'react-redux'
import {GET_DAILY_MONTHLY_YEARLY_OUTGOING} from '../../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {HeaderImageBackground,HeaderTitle,DisabledButton} from '../../Components'

//SELF IMPORTS
import SwipeProceedButton from './SwipeProceedButton'
import EnterMobileNo from './EnterMobileNo'
import EnterAmount from './EnterAmount'
import EnterNote from './/EnterNote'
import SwipeButtonComponent from './SwipeButtonComponent'
import ProceedButton from './ProceedButton'
import { KeyboardAvoidingView } from 'react-native'


const ToktokWalletSendMoney = ({navigation,route})=> {

    navigation.setOptions({
        // headerLeft: ()=> <HeaderBack />,
        // headerTitle: ()=> <HeaderTitle label={['Send Money']} />,
        headerShown:false,
      })
    
    const session = useSelector(state => state.session)
    const tokwaAccount = useSelector(state => state.toktokWallet)

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

    const [senderDetails , setSenderDetails] = useState({
        outgoingRecords: {
            daily: 0,
            monthly: 0,
            yearly: 0,
            walletlimit: {
                id: null,
                walletSize: null,
                outgoingValueDailyLimit: null,
                outgoingValueMonthlyLimit: null,
                outgoingValueAnnualLimit: null,
              }
        }
    })

    useEffect(()=>{

        if(route.params){
            if(route.params.recentTransfer){
                setAmount(route.params.recentTransfer.amount)
                setNote(route.params.recentTransfer.note)
                setMobileNo(route.params.recentTransfer.destinationWallet.account.mobileNumber.replace("+63","0"))
                setSwipeEnabled(route.params.recentTransfer.amount <= tokwaAccount.wallet.balance)
            }
        }
        

        return ()=> {

        }
    },[])

    return (
        <View style={{flex:1,backgroundColor:"white"}}>
                <View style={styles.headings}>
                    <HeaderImageBackground>
                        <HeaderTitle label="Send Money"/>
                        <View style={{flex: 1,justifyContent:"flex-end",paddingBottom: 45}}>
                            <View>  
                                    <View style={styles.walletContent}>
                                        <View>
                                            <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance ? tokwaAccount.wallet.balance : 0)}</Text>
                                            <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Available Balance</Text>
                                        </View>
                                        <TouchableOpacity onPress={()=> navigation.navigate("ToktokWalletPaymentOptions")} style={styles.topUp}>
                                            <View style={styles.topUpbtn}>
                                                    <FIcon5 name={'plus'} size={12}/> 
                                            </View>
                                        </TouchableOpacity>
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
                />

              
                <KeyboardAvoidingView style={{paddingHorizontal: 16,flex:1 }}>
                { 
                        proceed
                        ? <> 
                             <EnterAmount 
                                setSwipeEnabled={setSwipeEnabled}
                                tokwaAccount={tokwaAccount}
                                amount={amount} 
                                setAmount={setAmount}
                                recipientDetails={recipientDetails}
                                senderDetails={senderDetails}
                            />

                            <EnterNote
                                note={note}
                                setNote={setNote}
                            />
                        </>
                        : <View style={{marginTop: 10}}>
                            <Text style={{fontFamily: FONT.BOLD,fontWeight:"bold", fontSize: FONT_SIZE.M}}>Enter number to transfer</Text>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.DARK}}>You can click the "Address Book" to open your contact list.</Text>
                        </View>
                    }
                    {
                        getAccountLoading
                        ? <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <ActivityIndicator color={COLOR.YELLOW}/>
                        </View>
                        : null
                    }
                </KeyboardAvoidingView>
                
     
                <View style={{height: 70,padding: 16, justifyContent:"flex-end"}}>
                    <ProceedButton
                        swipeEnabled={swipeEnabled}
                        amount={amount}
                        navigation={navigation}
                        tokwaAccount={tokwaAccount}
                        note={note}
                        recipientDetails={recipientDetails}
                    />
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headings: {
        height: 190,
        backgroundColor:"black"
    },  
    header: {
        marginTop: 42,
        height: 24,
        width: "100%",
        flexDirection:"row"
    },
    walletbackgroundimage: {
        flex: 1,
        resizeMode: "cover",
    },
    whitespace: {
        height: 50,
        backgroundColor:"#FFFFFF",
        position:'relative'
    },
    walletContent: {
        flexDirection: "row",
        paddingHorizontal: 16,
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
    container: {
        flex: 1,
        backgroundColor:"white",
        padding:10
    },
    balance: {
       justifyContent:"center",
       alignItems:"center"
    },
    recipient: {
        marginTop: 39
    },
    mobileno: {
        flexDirection: "row",
        borderWidth: .5,
        borderColor:"silver",
        borderRadius:5,
        padding: 10,
        marginTop: 5
    },
    mobileIcon: {
        width: 22,
        justifyContent:"center"
    },
    contactAddress: {
        width:65,
        borderWidth: 1,
        borderColor: "#F6841F",
        borderRadius: 2,
    },
    addressbtn: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
    },
     amount: {
        padding: 5,
        width: "100%",
        borderColor: "silver",
        borderWidth: .5,
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
    }
})

export default ToktokWalletSendMoney

