import React , {useState,useReducer , useRef,useEffect} from 'react'
import {View,StyleSheet,Text,ScrollView,KeyboardAvoidingView,Platform,Dimensions} from 'react-native'
import { 
    HeaderImageBackground,
    HeaderTitle,
    Separator
} from '../../Components'
import {useSelector} from 'react-redux'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../graphql'
import { GET_CASH_OUT_PROVIDER_OTHER_BANKS } from '../../../../../../graphql/toktokwallet'
import { useQuery } from '@apollo/react-hooks'
import { COLOR , FONT, FONT_SIZE} from '../../../../../../res/variables'
import { numberFormat } from '../../../../../../helper';

//SELF IMPORTS
import InstaPayOption from './InstaPayOption'
import PesoNetOption from './PesoNetOption';
import MySavedAccounts from './MySavedAccounts';
import FundTransferForm from './FundTransferForm';
import BottomSheetSavedAccountBanks from './BottomSheetSavedAccountBanks';
import BottomSheetSavedAccounts from './BottomSheetSavedAccounts';
import BottomSheetChooseBank from './BottomSheetChooseBank'

const screen = Dimensions.get('window');

const ToktokWalletCashOutOtherBanks = ({navigation,route})=> {
    navigation.setOptions({
        headerShown: false
     })
     const tokwaAccount = useSelector(state=>state.toktokWallet)
     const bottomSheetSaveAccountBankRef = useRef()
     const bottomSheetSavedAccountRef = useRef(null)
     const bottomSheetBanksRef = useRef(null)

     const initialState = {
         bank: "",
         bankDescription: "",
         bankAccountNumberLength: "",
         accountName: `${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`,
         accountNumber: "",
         amount: "",
         note: "",
         savedAccounts: [],
         banks: [],
         activeAccount: null
     }

     const reducer = (state,action) => {
         switch(action.type){
            case "UPDATE_SAVE_ACCOUNTS": 
                return {
                    ...state,
                    savedAccounts: [...action.payload]
                }
            case "UPDATE_BANKS_LIST" :
                return {
                    ...state,
                    banks: [...action.payload]
                }
            case "SET_BANK":
                return {
                    ...state,
                    bank: action.payload.id,
                    bankDescription: `${action.payload.name}`, 
                    bankAccountNumberLength: action.payload.accountNumberLength
                }
            case "SET_ACCOUNT_NUMBER":
                return {
                    ...state,
                    accountNumber: action.payload
                }
            case "SET_NOTE":
                return {
                    ...state,
                    note: action.payload
                }
            case "SET_AMOUNT":
                return {
                    ...state,
                    amount: action.payload
                }
            case "SET_ACTIVE_ACCOUNT":
                return {
                    ...state,
                    activeAccount: action.payload
                }
            default:
                return state
         }
     }

    const [state,dispatch] = useReducer(reducer , initialState)

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
                        keyboardVerticalOffset={Platform.OS === 'ios' ? screen.height * 0.25 : screen.height * 0.5}
                        style={{ flex: 1 }}
                >
               <ScrollView showsVerticalScrollIndicator={false} style={styles.transferOptions}>
                    <MySavedAccounts state={state} dispatch={dispatch} bottomRef={bottomSheetSaveAccountBankRef} edit={()=>bottomSheetSavedAccountRef.current.expand()}/>
                    <FundTransferForm state={state} dispatch={dispatch} selectBanks={()=>bottomSheetBanksRef.current.expand()}/>
               </ScrollView>
               </KeyboardAvoidingView>
         </View>

         <BottomSheetSavedAccountBanks ref={bottomSheetSaveAccountBankRef}/>   
         <BottomSheetSavedAccounts ref={bottomSheetSavedAccountRef} accounts={state.savedAccounts}/> 
         <BottomSheetChooseBank 
            ref={bottomSheetBanksRef} 
            banks={state.banks} 
            onChange={(bank)=> {
                dispatch({
                    type: "SET_BANK",
                    payload: bank
                })
                dispatch({
                    type: "SET_ACTIVE_ACCOUNT",
                    payload: null
                })
                dispatch({
                    type: "SET_ACCOUNT_NUMBER",
                    payload: ""
                })
            }}
         />
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

export default ToktokWalletCashOutOtherBanks