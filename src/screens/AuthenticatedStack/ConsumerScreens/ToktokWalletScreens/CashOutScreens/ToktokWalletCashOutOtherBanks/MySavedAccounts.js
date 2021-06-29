import React , {useRef, useState, useContext} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Dimensions,TouchableHighlight,ActivityIndicator} from 'react-native'
import { COLOR, FONT , FONT_SIZE } from '../../../../../../res/variables'
import { Separator } from '../../Components'
import {VectorIcon , ICON_SET} from '../../../../../../revamp'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {GET_BANK_ACCOUNTS} from '../../../../../../graphql/toktokwallet'
import { useQuery } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useAlert} from '../../../../../../hooks'
import { ContextCashOut } from './ContextProvider'

const {width,height} = Dimensions.get("window")


const ActiveBankAccount = ({index,onPress, ...account}) => {
    const splitAlias = account.nickName.split(" ")
    const initialAlias = `${splitAlias[0][0]}${splitAlias[1] ? " "+splitAlias[1][0]: ""}`
    return (
        <TouchableHighlight 
            onPress={()=>onPress(account , index)} 
            underlayColor={"#FFFFE5"} 
            key={`bankAccount${index}`} 
            style={{justifyContent:'center',alignItems:"center",marginRight: 10}}
        >
            <>
                <View style={[styles.account, {justifyContent:'center',alignItems:'center',borderWidth: 2 ,borderColor:"black"}]}>
                        <View style={{position:'absolute',top: 0 , right: -5, height: 20,width: 20 ,backgroundColor: COLOR.YELLOW,borderRadius: 100,justifyContent:'center',alignItems:"center",borderWidth: 0.5,borderColor:"black"}}>
                                <VectorIcon iconSet={ICON_SET.Feather} name="check" color="black" size={12}/>
                        </View>
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.XL}}>{initialAlias.toUpperCase()}</Text>
                </View>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S}}>{account.nickName.length <= 10 ? account.nickName : `${account.nickName.slice(0,8)}...`}</Text>
            </>
        </TouchableHighlight>
    )
}

const BankAccount = ({index,onPress, ...account})=> {
    const splitAlias = account.nickName.split(" ")
    const initialAlias = `${splitAlias[0][0]}${splitAlias[1] ? " "+splitAlias[1][0]: ""}`
    return (
        <TouchableHighlight onPress={()=>onPress(account , index)} underlayColor={"#FFFFE5"} key={`bankAccount${index}`} style={{justifyContent:'center',alignItems:"center",marginRight: 10}}>
            <>
                      <View style={[styles.account, {justifyContent:'center',alignItems:'center'}]}>
                            <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>{initialAlias.toUpperCase()}</Text>
                        </View>
     
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S}}>{account.nickName.length <= 10 ? account.nickName : `${account.nickName.slice(0,8)}...`}</Text>
            </>
        </TouchableHighlight>
    )
}

const MySavedAccounts = ({selectBanks , edit})=> {
    const alert = useAlert()
    const {
        savedAccounts,
        setSaveAccounts,
        activeAccount,
        setActiveAccount,
        setBank,
        setAccountNumber,
        setAddress
    } = useContext(ContextCashOut)

    const {data,error,loading} = useQuery(GET_BANK_ACCOUNTS, {
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: ({getBankAccounts})=> {
            setSaveAccounts(getBankAccounts)
        }
    })

    if(loading){
        return (
            <View style={{flex: 1,justifyContent:"center",alignItems:"center",height: 125}}>
                <ActivityIndicator color={COLOR.YELLOW}/>
            </View>
        )
    }

    const onPress = (account , index)=> {
       if(!activeAccount){
           setBank(account.bank)
           setAccountNumber(account.accountNumber)
           setAddress(account.address)
           setActiveAccount(index)
       }

       if(activeAccount == index){
            setActiveAccount(null)
            setAccountNumber("")
            setAddress("")
       }else{
            setBank(account.bank)
            setAccountNumber(account.accountNumber)
            setAddress(account.address)
            setActiveAccount(index)
       }
    }

    return(
        <>
        <View style={styles.container}>
           <View style={styles.headings}>
           <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,textAlign: "left",flex: 1}}>My Saved Accounts ( {savedAccounts.length}/5 )</Text>
           {
               savedAccounts.length > 0 &&
               <TouchableOpacity onPress={edit} style={styles.edit}>
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,textAlign: "right",color: COLOR.ORANGE}}>Edit</Text>
               </TouchableOpacity>
           }
          
           </View>

           <View style={styles.body}>
                {
                    savedAccounts.map((account,index)=> {
                        if(index === activeAccount){
                            return <ActiveBankAccount onPress={onPress} index={index} {...account}/>
                        }
                        return <BankAccount onPress={onPress} index={index} {...account}/>
                    })
                }

                {
                    savedAccounts.length < 5 && 
                        <TouchableHighlight onPress={selectBanks} underlayColor={"transparent"} style={{justifyContent:'center',alignItems:"center",marginRight: 10}}>
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
        height: width / 5 - 20,
        width: width / 5 - 20,
        backgroundColor: COLOR.YELLOW,
        borderRadius: width / 5 - 20,
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
        height: width / 5 - 20,
        width: width / 5 - 20,
        backgroundColor: "white",
        borderRadius: width / 5 - 20,
        borderWidth: 2,
        borderColor: COLOR.YELLOW,
        justifyContent:"center",
        alignItems:'center'
    }
})

export default MySavedAccounts