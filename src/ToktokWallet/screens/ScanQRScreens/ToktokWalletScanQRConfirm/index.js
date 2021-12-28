import React, {useState} from 'react'
import {View,Text,StyleSheet, TouchableOpacity} from 'react-native'
import {numberFormat} from 'toktokwallet/helper'
import {useSelector} from 'react-redux'
import {useAlert} from 'src/hooks/useAlert'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {
    HeaderImageBackground,
    HeaderTitle,
    CheckIdleState
} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

//SELF  IMPORTS
import {
    EnterAmount,
    EnterNote,
    ProceedButton,
    RecipientInfo
} from "./Components";

const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN } = CONSTANTS

export const ToktokWalletScanQRConfirm = ({navigation,route})=> {

    navigation.setOptions({
      headerShown:false,
    })
    const alert = useAlert()
    const { recipientInfo } = route.params
    const session = useSelector(state=>state.session)
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [amount,setAmount] = useState("")
    const [note,setNote] = useState("")
    const [swipeEnabled,setSwipeEnabled] = useState(false)
 
    return (
        <CheckIdleState>
        <View style={styles.container}>
            <View style={styles.headings}>
                <HeaderImageBackground>
                    <HeaderTitle label="Send Money"/>
                    <View style={{height: 32}}/>
                    <View style={styles.walletContent}>
                            <View>
                                <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>PHP {numberFormat(tokwaAccount.wallet.balance ? tokwaAccount.wallet.balance : 0)}</Text>
                                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Available Balance</Text>
                            </View>
                            <TouchableOpacity onPress={()=> navigation.navigate("ToktokWalletPaymentOptions")} style={styles.topUp}>
                                <View style={styles.topUpbtn}>
                                        <FIcon5 name={'plus'} size={12}/> 
                                </View>
                            </TouchableOpacity>
                    </View>
                </HeaderImageBackground>
                <RecipientInfo recipientInfo={recipientInfo}/>
            </View>


            <EnterAmount 
                amount={amount} 
                setAmount={setAmount} 
                setSwipeEnabled={setSwipeEnabled}
                tokwaAccount={tokwaAccount}
            />

            <EnterNote
                note={note}
                setNote={setNote}
            />

            <View style={{paddingHorizontal: 10}}> 
                <ProceedButton amount={amount} swipeEnabled={swipeEnabled} note={note} session={session} recipientInfo={recipientInfo}/>
            </View>   

        </View>
      </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
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
    walletContent: {
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: MARGIN.M,
        alignItems:"flex-start",
        justifyContent:"flex-start"
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
    },
    amount: {
        height: SIZE.FORM_HEIGHT,
        width: "100%",
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
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
