import React, { useState , useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,ScrollView,Image,Alert} from 'react-native'
import { HeaderBack, HeaderTitle } from '../../../../../../components'
import { numberFormat } from '../../../../../../helper'
import { FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR } from '../../../../../../res/constants'
import {useSelector} from 'react-redux'
import SwipeProceedButton from './SwipeProceedButton'
import EnterMobileNo from './EnterMobileNo'
import EnterAmount from './EnterAmount'
import {GET_DAILY_MONTHLY_YEARLY_OUTGOING} from '../../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'

const SendMoneyComponent = ({children , walletinfo})=> (
    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <View style={styles.balance}>
            <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16}}>Balance: {'\u20B1'} {numberFormat(walletinfo.balance)}</Text>
        </View>

        <View style={styles.recipient}>
                {children}
        </View>
    </ScrollView>
)

export default ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Send Money']} />,
      })
    
    const session = useSelector(state => state.session)
    const walletinfo = route.params.walletinfo

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
        incomingRecords: {
            daily: 0,
            monthly: 0,
            yearly: 0,
            walletlimit: {
                id: null,
                walletSize: null,
                incomingValueDailyLimit: null,
                incomingValueMonthlyLimit: null,
                incomingValueAnnualLimit: null,
              }
        }
    })

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

    const [getDailyMonthlyYearlyOutgoing] = useLazyQuery(GET_DAILY_MONTHLY_YEARLY_OUTGOING, {
        fetchPolicy: 'network-only',
        onError: (error)=>{

        },
        onCompleted: (response)=> {
            setSenderDetails({
                outgoingRecords: {
                    ...response.getDailyMonthlyYearlyOutgoing
                }
            })
        }
    })

    useEffect(()=>{

        // getDailyMonthlyYearlyOutgoing({
        //     variables: {
        //         input: {
        //             userID: session.user.id
        //         }
        //     }
        // })

        if(route.params){
            if(route.params.recentTransfer){
                setAmount(route.params.recentTransfer.amount)
                setMobileNo(route.params.recentTransfer.destinationInfo.username.replace("+63","0"))
                setSwipeEnabled(route.params.recentTransfer.amount <= walletinfo.balance)
            }
        }
        

        return ()=> {

        }
    },[])

    return (
    <>    
    <KeyboardAvoidingView  
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 90}  
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <SendMoneyComponent walletinfo={walletinfo}>
                <EnterMobileNo 
                    mobileNo={mobileNo}
                    setMobileNo={setMobileNo}
                    navigation={navigation} 
                    session={session} 
                    setProceed={setProceed} 
                    proceed={proceed}
                    setRecipientDetails={setRecipientDetails}
                    recipientDetails={recipientDetails}
                />
                { 
                    proceed
                    ? <EnterAmount 
                            setSwipeEnabled={setSwipeEnabled}
                            walletinfo={walletinfo} 
                            amount={amount} 
                            note={note}
                            setAmount={setAmount}
                            setNote={setNote}
                            recipientDetails={recipientDetails}
                            senderDetails={senderDetails}
                     />
                    : <View style={{marginTop: 19}}>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 13}}>Enter number to transfer.</Text>
                        <Text style={{fontFamily: FONT_LIGHT,fontSize: 10}}>You can click the "Address Book" to open your contact list.</Text>
                    </View>
                }

            </SendMoneyComponent>
           { proceed && <SwipeProceedButton amount={amount} note={note} swipeEnabled={swipeEnabled} session={session} recipientDetails={recipientDetails}/> }
       </KeyboardAvoidingView>
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding:20
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
