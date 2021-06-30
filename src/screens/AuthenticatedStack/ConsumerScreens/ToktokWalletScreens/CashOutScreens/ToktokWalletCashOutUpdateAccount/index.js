import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,Alert,TouchableOpacity} from 'react-native'
import {Separator} from '../../Components'
import {HeaderBack,HeaderTitle,YellowButton} from '../../../../../../revamp'
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables'
import { useSelector } from 'react-redux'
import { AlertOverlay } from '../../../../../../components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import {PATCH_CASH_OUT_BANK_ACCOUNT,PATCH_REMOVE_ACCOUNT} from '../../../../../../graphql/toktokwallet'
import { useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import {useAlert} from '../../../../../../hooks'

//SELF IMPORTS
import RemoveModal from './RemoveModal'
import RemoveSuccessfulModal from './RemoveSuccessfulModal'
import SuccessfulModal from './SuccessfulModal'

const ToktokWalletCashOutUpdateAccount = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Update Account','']}/>,
    })
   
    const bankAccount = route.params.bankAccount
    const bank = bankAccount.bank
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [nickName,setNickName] = useState(bankAccount.nickName)
    const [accountName,setAccountName] = useState(bankAccount.accountName)
    const [accountNumber ,setAccountNumber] = useState(bankAccount.accountNumber)
    const [errorMessage,setErrorMessage] = useState("")
    const [showSuccessModal,setShowSuccessModal] = useState(false)
    const [showRemoveModal,setShowRemoveModal] = useState(false)
    const [showRemoveSuccessModal,setShowRemoveSuccessModal] = useState(false)

    const alert = useAlert()

    const [patchCashOutBankAccount , {data,error,loading}] = useMutation(PATCH_CASH_OUT_BANK_ACCOUNT, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: ({patchCashOutBankAccount})=> {
            // console.log(patchCashOutBankAccount)
            setShowSuccessModal(true)
        }
    })

    const [patchRemoveAccount,{loading: removeLoading}] = useMutation(PATCH_REMOVE_ACCOUNT, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: ({patchRemoveAccount})=> {
            // console.log(patchCashOutBankAccount)
            setShowRemoveSuccessModal(true)
        }
    })

    const removeAccount = ()=> {
        patchRemoveAccount({
            variables: {
                input: {
                    accountId: bankAccount.id
                }
            }
        })
    }

    const saveAccount = ()=> {
        if(nickName == ""){
            return Alert.alert("","Nickname is required.")
        }

        if(accountNumber == ""){
            return Alert.alert("","Account Number is required.")
        }

        patchCashOutBankAccount({
            variables: {
                input: {
                    accountId: bankAccount.id,
                    cashOutBankId: bank.id,
                    oldAccountNumber: bankAccount.accountNumber,
                    accountName: accountName,
                    accountNumber: accountNumber,
                    nickName: nickName,
                }
            }
        })
    }

    const changeAccountNumber = (value)=> {

        if(value.length != +bank.accountNumberLength){
            setErrorMessage("Account number format must be valid.")
        }

        if(value.length == 11) setErrorMessage("")

        setAccountNumber(value)
    }
    

    useEffect(()=>{
        if(accountNumber == "" || accountNumber.length === +bank.accountNumberLength) setErrorMessage("")
    },[accountNumber])

    return (
        <>
        <AlertOverlay visible={loading}/>
        <AlertOverlay visible={removeLoading}/>
        <SuccessfulModal visible={showSuccessModal} setVisible={setShowSuccessModal}/>
        <RemoveModal visible={showRemoveModal} setVisible={setShowRemoveModal} bankAccount={bankAccount} removeAccount={removeAccount}/>
        <RemoveSuccessfulModal visible={showRemoveSuccessModal} setVisible={setShowRemoveSuccessModal}/>
        <Separator/>
        <View style={styles.container}>
             <View style={{flex: 1}}>
                    <View style={styles.bank}>
                        {
                            bank.image 
                            ? <View style={styles.bankLogo}>

                            </View>
                            :  <View style={[styles.bankLogo,{justifyContent:"center",alignItems:"center"}]}>
                                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>{bank.code}</Text>
                            </View>
                        }
                          
                            <Text style={styles.bankName}>{bank.name}</Text>
                            <TouchableOpacity style={{padding: 2}} onPress={()=>setShowRemoveModal(true)}>
                                <Text style={[styles.bankName , {color: COLOR.ORANGE}]}>Remove Account</Text>
                            </TouchableOpacity>
                           
                    </View>
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Nickname</Text>
                        <View style={[styles.input, {justifyContent:"center"}]}>
                            <TextInput
                                    style={styles.input}
                                    value={nickName}
                                    onChangeText={(value)=>setNickName(value)}
                                    placeholder="Enter nickname here"
                                />
                        </View>
                    </View>

                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
                        <View style={[styles.input, {justifyContent:"center"}]}>
                               <View
                                    style={[styles.input, {justifyContent:"center"}]}
                                >
                                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountName}</Text>
                                </View>
                        </View>
                    </View>

                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                        <View style={[styles.input, {borderWidth: 1, borderColor: errorMessage == "" ? "transparent" : COLOR.RED}]}>
                            <TextInput
                                    value={accountNumber}
                                    onChangeText={changeAccountNumber}
                                    maxLength={+bank.accountNumberLength}
                                    placeholder={`Enter your ${bank.accountNumberLength}-digit bank account number here`}
                                />
                        </View>
                        <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.RED}}>{errorMessage}</Text>
                    </View>
                   
             </View>
             <View style={{justifyContent:'center',alignItems:"center"}}>
                    <Text style={{textAlign:"center",fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#CCCCCC",marginBottom: 20,}}>Please verify the accuracy and completeness of the details before you proceed.</Text>
             </View>
             <View style={{height: 70,justifyContent:'flex-end'}}>
                <YellowButton label="Update" onPress={saveAccount}/>
             </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        padding: 16,
    },
    bank: {
        alignItems:'center',
        marginBottom: 20,
    },  
    bankLogo: {
        height: 50,
        width: 50,
        backgroundColor:"white",
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginRight: 10,
      },
    bankName: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M,
        marginTop: 10,
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    },
})

export default ToktokWalletCashOutUpdateAccount