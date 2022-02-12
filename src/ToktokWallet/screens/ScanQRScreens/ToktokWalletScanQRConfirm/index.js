import React, {useState} from 'react'
import {View,Text,StyleSheet, TouchableOpacity} from 'react-native'
import {numberFormat} from 'toktokwallet/helper'
import {useSelector} from 'react-redux'
import {useAlert} from 'src/hooks/useAlert'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import CheckBox from 'react-native-check-box'
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
    const [errorMessage,setErrorMessage] = useState("")
    const [isCertify, setCertify] = useState(true)
 
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
                            <TouchableOpacity 
                                onPress={()=> navigation.navigate("ToktokWalletPaymentOptions" ,{onCashIn: ()=> null,amount: 0})} 
                                style={styles.topUp}
                            >
                                <View style={styles.topUpbtn}>
                                        <FIcon5 name={'plus'} color={"black"} size={12}/> 
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
                recipientInfo={recipientInfo}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />

            <EnterNote
                note={note}
                setNote={setNote}
            />

            <View style={{paddingHorizontal: 10}}> 
            <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,marginBottom: 10 ,textAlign:"center"}}>
                             Please read our Terms and Conditions before you proceed with your transaction.
                         </Text>  
                         <View style={{
                        flexDirection:"row",     
                        marginBottom: 16,
                    }}>

                    <CheckBox
                            isChecked={isCertify}
                            onClick={()=>{
                                return setCertify(!isCertify)
                            }}
                            style={{
                                alignSelf: "center",
                                marginRight: 2,
                            }}
                        />

                        <TouchableOpacity 
                            // onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")} 
                            onPress={()=>navigation.navigate("ToktokWalletTermsConditions")}
                            style={{paddingHorizontal: 10,marginRight: 20,alignSelf:"center"}}
                        >
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>I hereby certify that I accept the <Text style={{color: COLOR.ORANGE,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Terms and Conditions.</Text></Text>
                        </TouchableOpacity>
                    </View>

                <ProceedButton 
                    amount={amount} 
                    swipeEnabled={swipeEnabled} 
                    setSwipeEnabled={setSwipeEnabled}
                    note={note} 
                    session={session} 
                    recipientInfo={recipientInfo}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    isCertify={isCertify}
                />
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
