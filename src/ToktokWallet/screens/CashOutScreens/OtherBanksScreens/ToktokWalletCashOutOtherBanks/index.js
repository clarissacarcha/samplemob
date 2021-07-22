import React , {useState,useReducer , useRef,useEffect , useContext, useMemo, useCallback} from 'react'
import {View,StyleSheet,Text,ScrollView,KeyboardAvoidingView,Platform,Dimensions} from 'react-native'
import { 
    HeaderImageBackground,
    HeaderTitle,
    Separator
} from 'toktokwallet/components'
import { numberFormat } from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS 
import {
    ContextProvider,
    ContextCashOut,
    FundTransferForm,
    ModalChooseAccount,
    ModalChooseBank,
    MySavedAccounts
} from "./Components";

const { COLOR , FONT_FAMILY: FONT, FONT_SIZE } = CONSTANTS
const screen = Dimensions.get('window');

const MainComponent = ({navigation})=> {
    const {
        banks, 
        tokwaAccount,
        setBank,
        setActiveAccount,
        setAccountNumber,
        savedAccounts
    } = useContext(ContextCashOut)

    const [showChooseBankModal,setShowChooseBankModal] = useState(false)
    const [showAccountBankModal,setShowAccountBankModal] = useState(false)
    const [showChooseAccountModal,setShowChooseAccountModal] = useState(false)

    const changeBank = (bank)=> {
        setBank(bank)
        setActiveAccount(null)
        setAccountNumber("")
        setShowChooseBankModal(false)
    }

    const selectAccountBank = (bank) => {
        setShowAccountBankModal(false)
        return navigation.navigate("ToktokWalletCashOutSaveAccount", {bank: bank})
    }

    return (
        <>
        <View style={styles.container}>
                <View style={styles.headings}>
                   <HeaderImageBackground>
                       <HeaderTitle label="Fund Transfer"/>
                       <View style={styles.walletBalance}>
                                   <Text style={{fontSize: 24,fontFamily: FONT.BOLD}}>{tokwaAccount.wallet.currency.code} {numberFormat(tokwaAccount.wallet.balance ? tokwaAccount.wallet.balance : 0)}</Text>
                                   <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,marginBottom: 5}}>Available Balance</Text>
                       </View>
                   </HeaderImageBackground>
               </View>
               <Separator/>
               <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "height" : null}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? screen.height * 0.1 : screen.height * 0.25}
                        style={{ flex: 1 }}
                >
               <ScrollView showsVerticalScrollIndicator={false} style={styles.transferOptions}>
                    <MySavedAccounts selectBanks={()=>setShowAccountBankModal(true)} edit={()=>setShowChooseAccountModal(true)}/>
                    <FundTransferForm selectBanks={()=>setShowChooseBankModal(true)}/>
               </ScrollView>
               </KeyboardAvoidingView>
        </View>
        <ModalChooseBank banks={banks} visible={showChooseBankModal} setVisible={()=>setShowChooseBankModal(false)} onPress={changeBank}/>
        <ModalChooseBank banks={banks} visible={showAccountBankModal} setVisible={()=>setShowAccountBankModal(false)} onPress={selectAccountBank}/>
        <ModalChooseAccount accounts={savedAccounts} visible={showChooseAccountModal} setVisible={setShowChooseAccountModal}/>
        </>
    )
}

export const ToktokWalletCashOutOtherBanks = ({navigation,route})=> {
    navigation.setOptions({
        headerShown: false
     })
   
    return (
        <>
        <ContextProvider>
            <MainComponent navigation={navigation}/>
         </ContextProvider>
         </>
       )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
    },
    headings: {
        height: 190,
        backgroundColor:"black"
    },  
    walletBalance: {
        flex: 1,
        justifyContent:"center",
        alignItems:'center'
    },
    cashoutoptions: {
        padding: 16,
    },
    transferDetails: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor:"#F4F4F4",
        justifyContent:"center",
        alignItems:"center"
    },
    transferOptions: {
        flex: 1,
    },
})