import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,Alert,TouchableOpacity} from 'react-native'
import {Separator,CheckIdleState,FlagSecureScreen} from 'toktokwallet/components'
import {HeaderBack,HeaderTitle,YellowButton} from 'src/revamp'
import { useSelector } from 'react-redux'
import { AlertOverlay } from 'src/components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {PATCH_REMOVE_ACCOUNT} from 'toktokwallet/graphql'
import { useMutation } from '@apollo/react-hooks'
import {  } from 'src/util/ErrorUtility'
import {useAlert} from 'src/hooks'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    RemoveModal,
    RemoveSuccessfulModal
} from "./Components";

const { FONT_FAMILY: FONT , FONT_SIZE , SIZE , COLOR } = CONSTANTS

export const ToktokWalletCashOutViewAccount = ({navigation,route})=> {

    const bankAccount = route.params.bankAccount
    const bank = bankAccount.bank

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[bank.name.length < 20 ? bank.name : bank.name.slice(0,20)+'...','']}/>,
    })

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [showRemoveModal,setShowRemoveModal] = useState(false)
    const [showRemoveSuccessModal,setShowRemoveSuccessModal] = useState(false)
    const alert = useAlert()

    const [patchRemoveAccount,{loading: removeLoading}] = useMutation(PATCH_REMOVE_ACCOUNT, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error,navigation})
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

    const editAccount = ()=> navigation.navigate("ToktokWalletCashOutUpdateAccount" , {bankAccount: bankAccount})


    return (
        <FlagSecureScreen>
        <CheckIdleState>
        <AlertOverlay visible={removeLoading}/>
        <RemoveModal visible={showRemoveModal} setVisible={setShowRemoveModal} bankAccount={bankAccount} removeAccount={removeAccount}/>
        <RemoveSuccessfulModal visible={showRemoveSuccessModal} setVisible={setShowRemoveSuccessModal}/>
        <Separator/>
        <View style={styles.container}>
             <View style={{flex: 1}}>
                    {/* <View style={styles.bank}>                
                            <Text style={styles.bankName}>{bank.name}</Text>
                    </View> */}
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Alias</Text>
                        <View style={[{justifyContent:"center"}]}>
                               <View
                                    style={[styles.input, {justifyContent:"center"}]}
                                >
                                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{bankAccount.nickName}</Text>
                                </View>
                        </View>
                    </View>

                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Name</Text>
                        <View style={[ {justifyContent:"center"}]}>
                               <View
                                    style={[styles.input, {justifyContent:"center"}]}
                                >
                                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{bankAccount.accountName}</Text>
                                </View>
                        </View>
                    </View>
                    
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                        <View style={[ {justifyContent:"center"}]}>
                               <View
                                    style={[styles.input, {justifyContent:"center"}]}
                                >
                                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{bankAccount.accountNumber}</Text>
                                </View>
                        </View>
                    </View>

                    {/* <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Address</Text>
                        <View style={[{justifyContent:"center"}]}>
                               <View
                                    style={[styles.input, {justifyContent:"center"}]}
                                >
                                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{bankAccount.address}</Text>
                                </View>
                        </View>
                    </View> */}

                    
                   
             </View>
             <View style={{justifyContent:'center',alignItems:"center"}}>
                    <Text style={{textAlign:"center",fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#CCCCCC",marginBottom: 20,}}>Please verify the accuracy and completeness of the details before you proceed.</Text>
             </View>
             <View style={{height: 70,alignItems:'flex-end',flexDirection:"row"}}>
                 <View style={{flex: 1 , marginRight: 10}}>
                    <TouchableOpacity onPress={()=>setShowRemoveModal(true)} style={{ borderRadius:SIZE.BORDER_RADIUS, height: SIZE.FORM_HEIGHT,backgroundColor:"#F7F7FA",justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L}}>Delete</Text>
                    </TouchableOpacity>
                 </View>
                 <View style={{flex: 1,marginLeft: 10}}>
                 <YellowButton label="Edit" onPress={editAccount}/>
                 </View>
               
             </View>
        </View>
        </CheckIdleState>
        </FlagSecureScreen>
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
        fontSize: FONT_SIZE.XL,
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
