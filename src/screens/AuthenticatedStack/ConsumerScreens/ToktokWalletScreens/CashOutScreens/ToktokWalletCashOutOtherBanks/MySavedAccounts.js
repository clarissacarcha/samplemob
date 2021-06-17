import React , {useRef, useState} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Dimensions,TouchableHighlight,ActivityIndicator} from 'react-native'
import { COLOR, FONT , FONT_SIZE } from '../../../../../../res/variables'
import { Separator } from '../../Components'
import {VectorIcon , ICON_SET} from '../../../../../../revamp'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_BANK_ACCOUNTS} from '../../../../../../graphql/toktokwallet'
import { useQuery } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useAlert} from '../../../../../../hooks'

const {width,height} = Dimensions.get("window")


const ActiveBankAccount = ({index,onPress, ...account}) => {
    return (
        <TouchableHighlight 
            onPress={()=>onPress(account , index)} 
            underlayColor={"transparent"} 
            key={`bankAccount${index}`} 
            style={{justifyContent:'center',alignItems:"center",marginRight: 10}}
        >
            <>
                <View style={[styles.account, {justifyContent:'center',alignItems:'center',borderWidth: 2 ,borderColor:"black"}]}>
                        <View style={{position:'absolute',top: 0 , right: -5, height: 20,width: 20 ,backgroundColor: COLOR.YELLOW,borderRadius: 100,justifyContent:'center',alignItems:"center",borderWidth: 0.5,borderColor:"black"}}>
                                <VectorIcon iconSet={ICON_SET.Feather} name="check" color="black" size={12}/>
                        </View>
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{account.bank.code}</Text>
                </View>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S}}>{account.nickName.length <= 10 ? account.nickName : `${account.nickName.slice(0,8)}...`}</Text>
            </>
        </TouchableHighlight>
    )
}

const BankAccount = ({index,onPress, ...account})=> {

    return (
        <TouchableHighlight onPress={()=>onPress(account , index)} underlayColor={"transparent"} key={`bankAccount${index}`} style={{justifyContent:'center',alignItems:"center",marginRight: 10}}>
            <>
                      <View style={[styles.account, {justifyContent:'center',alignItems:'center'}]}>
                            <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S}}>{account.bank.code}</Text>
                        </View>
     
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S}}>{account.nickName.length <= 10 ? account.nickName : `${account.nickName.slice(0,8)}...`}</Text>
            </>
        </TouchableHighlight>
    )
}

const MySavedAccounts = ({bottomRef , edit ,dispatch , state})=> {
    const alert = useAlert()
    // const [activeAccount,setActiveAccount] = useState(null)
    const activeAccount = state.activeAccount

    const {data,error,loading} = useQuery(GET_BANK_ACCOUNTS, {
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: ({getBankAccounts})=> {
            console.log(getBankAccounts)
            dispatch({
                type: "UPDATE_SAVE_ACCOUNTS",
                payload: getBankAccounts
            })
        }
    })

    if(loading){
        return (
            <View style={{flex: 1,justifyContent:"center",alignItems:"center",height: 125}}>
                <ActivityIndicator color={COLOR.YELLOW}/>
            </View>
        )
    }

    const addAccount = ()=> {
        bottomRef.current.expand()
    }

    const onPress = (account , index)=> {
       if(!activeAccount){
        dispatch({
            type: "SET_BANK",
            payload: account.bank
        })
        dispatch({
            type: "SET_ACCOUNT_NUMBER",
            payload: account.accountNumber
        })
        dispatch({
            type: "SET_ACTIVE_ACCOUNT",
            payload: index
        })
       }

       if(activeAccount == index){
        dispatch({
            type: "SET_ACTIVE_ACCOUNT",
            payload: null
        })
        dispatch({
            type: "SET_ACCOUNT_NUMBER",
            payload: ""
        })
       }else{
        dispatch({
            type: "SET_BANK",
            payload: account.bank
        })
        dispatch({
            type: "SET_ACCOUNT_NUMBER",
            payload: account.accountNumber
        })
        dispatch({
            type: "SET_ACTIVE_ACCOUNT",
            payload: index
        })
       }
    }

    return(
        <>
        <View style={styles.container}>
           <View style={styles.headings}>
           <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,textAlign: "left",flex: 1}}>My Saved Accounts</Text>
           {
               data.getBankAccounts.length > 0 &&
               <TouchableOpacity onPress={edit} style={styles.edit}>
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,textAlign: "right",color: COLOR.ORANGE}}>Edit</Text>
               </TouchableOpacity>
           }
          
           </View>

           <View style={styles.body}>
                {
                    data.getBankAccounts.map((account,index)=> {
                        if(index === activeAccount){
                            return <ActiveBankAccount onPress={onPress} index={index} {...account}/>
                        }
                        return <BankAccount onPress={onPress} index={index} {...account}/>
                    })
                }

                {
                    data.getBankAccounts.length < 5 && 
                        <TouchableHighlight onPress={addAccount} underlayColor={"transparent"} style={{justifyContent:'center',alignItems:"center",marginRight: 10}}>
                            <>
                            <View style={styles.addAccount}>
                                <VectorIcon iconSet={ICON_SET.FontAwesome5} name="plus" size={12}/>
                            </View>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S}}>Add Account</Text>
                            </>
                        </TouchableHighlight>
                }

               
           </View>
        </View>
        <Separator/>
      
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 125,
        backgroundColor:"white",
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    headings: {
        flexDirection: 'row'
    },
    edit: {
        flex: 1,
        paddingLeft: 5,
    },
    body: {
        flexDirection: "row",
        alignItems:'center',
        flex: 1,
    },
    account: {
        height: 50,
        width: width / 5 - 20,
        backgroundColor: COLOR.YELLOW,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addAccount: {
        height: 50,
        width: width / 5 - 20,
        backgroundColor: "white",
        borderRadius: 100,
        borderWidth: 2,
        borderColor: COLOR.YELLOW,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent:"center",
        alignItems:'center'
    }
})

export default MySavedAccounts