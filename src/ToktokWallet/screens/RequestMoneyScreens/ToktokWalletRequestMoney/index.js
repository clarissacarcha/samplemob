import React , {useState , createRef} from 'react'
import {View , Text , TouchableOpacity , StyleSheet, ScrollView,ActivityIndicator } from 'react-native'
import {HeaderImageBackground,HeaderTitle,CheckIdleState,Separator,DisabledButton} from 'toktokwallet/components'
import { YellowButton , VectorIcon, ICON_SET } from 'src/revamp'
import { useAccount } from 'toktokwallet/hooks'
import { numberFormat } from 'toktokwallet/helper'
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
    EnterAmount
} from './Components'

export const ToktokWalletRequestMoney = ({navigation,route})=> {

    navigation.setOptions({
        headerShown:false,
    })
    const favoritesRef = createRef()
    const {tokwaAccount} = useAccount();
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

    const confirmRequest = ()=> {

    }

    const openPendingHistory = ()=> {
        navigation.navigate("ToktokWalletRequestMoneyPending")
    }

    return (
        <CheckIdleState> 
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
                                    <TouchableOpacity onPress={()=> navigation.navigate("ToktokWalletPaymentOptions")} style={styles.topUp}>
                                            <View style={styles.topUpbtn}>
                                                    <FIcon5 name={'plus'} size={12}/> 
                                            </View>
                                    </TouchableOpacity>
                                    <View style={{flex: 1,alignItems:"flex-end",paddingVertical: MARGIN.M}}>
                                        <TouchableOpacity hitSlop={{top: 20,bottom: 20,left: 20,right: 20}} onPress={openPendingHistory}>
                                            <View style={styles.pendingRequestCount}>
                                                <Text style={styles.pendingRequestCountText}>
                                                        20
                                                </Text>
                                            </View>
                                            <VectorIcon color={"black"} iconSet={ICON_SET.FontAwesome} name="envelope" size={20}/>
                                        </TouchableOpacity>
                                    </View>
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
    pendingRequestCount: {
        borderRadius: 7, 
        height: 14,
        width: 14,
        backgroundColor:COLOR.RED,
        position:"absolute",
        top: -5,
        right: -2,
        justifyContent:"center",
        alignItems:"center",
        zIndex:1
    },
    pendingRequestCountText: {
        color: "white",
        fontSize: FONT_SIZE.XS,
        fontFamily:FONT.REGULAR
    }
})