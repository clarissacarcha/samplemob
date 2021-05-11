import React, { useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {HeaderBack, YellowButton} from '../../../../../../revamp'
import { numberFormat } from '../../../../../../helper'
import { COLORS, FONTS, SIZES } from '../../../../../../res/constants'
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


const ToktokWalletSendMoney = ({navigation,route})=> {

    navigation.setOptions({
        // headerLeft: ()=> <HeaderBack />,
        // headerTitle: ()=> <HeaderTitle label={['Send Money']} />,
        headerShown:false,
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
        <View style={{flex:1,backgroundColor:"white"}}>
                <View style={styles.headings}>
                    <HeaderImageBackground>
                        <HeaderTitle label="Send Money"/>
                        <View style={{height: 32}}/>
                        <View style={styles.walletContent}>
                                <View>
                                    <Text style={{fontSize: 24,fontFamily: FONTS.BOLD}}>PHP {numberFormat(walletinfo.balance ? walletinfo.balance : 0)}</Text>
                                    <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR,color: COLORS.DARK}}>Available Balance</Text>
                                </View>
                                <TouchableOpacity onPress={()=> navigation.navigate("ToktokWalletPaymentOptions" , {walletinfo})} style={styles.topUp}>
                                    <View style={styles.topUpbtn}>
                                            <FIcon5 name={'plus'} size={12} color={COLORS.DARK}/> 
                                    </View>
                                </TouchableOpacity>
                        </View>
                    </HeaderImageBackground>
    
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
                </View>

              
                <View style={{padding: 16,marginTop: 15,flex:1 }}>
                { 
                        proceed
                        ? <> 
                             <EnterAmount 
                                setSwipeEnabled={setSwipeEnabled}
                                walletinfo={walletinfo} 
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
                            <Text style={{fontFamily: FONTS.BOLD,fontWeight:"bold", fontSize: SIZES.M}}>Enter number to transfer</Text>
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color:COLORS.MEDIUM}}>You can click the "Address Book" to open your contact list.</Text>
                        </View>
                    }
                </View>
                
     
                <View style={{height: 70,padding: 16, justifyContent:"flex-end"}}>
                    {/* {   swipeEnabled 
                        ? <SwipeButtonComponent amount={amount} swipeEnabled={swipeEnabled} note={note} session={session} recipientDetails={recipientDetails}/>
                        : <DisabledButton label="Proceed" />
                    } */}
                    <ProceedButton
                        swipeEnabled={swipeEnabled}
                        amount={amount}
                        navigation={navigation}
                        session={session}
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
        borderColor: COLORS.DARK,
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

