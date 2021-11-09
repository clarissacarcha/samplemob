import React, { useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Image,Dimensions,Alert} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { BlackButton, ICON_SET, VectorIcon, YellowButton } from 'src/revamp'
import {BuildingBottom} from 'toktokwallet/components'
import { useAccount } from 'toktokwallet/hooks'
import { AlertOverlay } from 'src/components'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS
const {width,height} = Dimensions.get("window")

const Reminder = ({children})=> {
    return (
        <View style={{flexDirection: "row",marginVertical: 5}}>
            <View style={{padding: 2, borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                <VectorIcon size={12} iconSet={ICON_SET.Feather} name="check"/>
            </View>
           {children}
    </View>
    )
}

const NewPIN = ()=> {
    return (
        <View style={[styles.content]}>
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                height: 160,
                width: 160,
                backgroundColor: "#FEEABA",
                borderRadius: 100,
                marginTop: 60,
                marginBottom: 35,
            }}>
                <Image style={{height: 89,width: 89}} source={require('toktokwallet/assets/icons/walletVerify.png')}/>
            </View>
            <Text style={{fontSize: FONT_SIZE.XL,fontFamily: FONT.BOLD}}>Setup TPIN Successful!</Text>
            <Text style={{color: "#212529",marginTop:5,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,textAlign:"center"}}>You have secured your toktokwallet. Make sure to remember your TPIN and do not share it with anyone.</Text>
        </View>
    )
}

const UpdatePIN = ()=> {
    return (
        <View style={[styles.content]}>
        <View style={{
            justifyContent: "center",
            alignItems: "center",
            height: 160,
            width: 160,
            backgroundColor: "#FEEABA",
            borderRadius: 100,
            marginTop: 60,
            marginBottom: 35,
        }}>
            <Image style={{height: 89,width: 89}} source={require('toktokwallet/assets/icons/walletVerify.png')}/>
        </View>
        <Text style={{fontSize: FONT_SIZE.XL,fontFamily: FONT.BOLD}}>toktokwallet TPIN changed successfully</Text>
        <Text style={{color: "#212529",marginTop:5,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,textAlign:"center"}}>You can now use your new TPIN.</Text>
    </View>
    )
}


export const SuccessfulModal = ({modalVisible,tokwaAccount,amount,onCashIn,setSuccessModalVisible,setUpTpinCallBack})=> {
    const navigation = useNavigation()
    const { getMyAccount , tokwaAccount: tokwaAccountLatest , getMyAccountLoading } = useAccount()

    useEffect(()=>{
        if(tokwaAccountLatest.pinCode && onCashIn){
          if(navigation.canGoBack()) navigation.pop();
          navigation.push("ToktokWalletPaymentOptions", {
              amount: amount ? amount : 0,
              onCashIn: onCashIn
          })
          setSuccessModalVisible(false);
        }
        if(tokwaAccountLatest.pinCode && setUpTpinCallBack){
            setUpTpinCallBack()
            if(navigation.canGoBack()) navigation.pop();
            setSuccessModalVisible(false);
            return;
        }

        if(tokwaAccountLatest.pinCode && !onCashIn && !setUpTpinCallBack){
            navigation.navigate("ToktokWalletHomePage")
            setSuccessModalVisible(false);
            return;
        }
      },[tokwaAccountLatest,onCashIn,setUpTpinCallBack])
  
      const closeModal = async ()=> {
          getMyAccount();
      }

    return (
        <Modal
             visible={modalVisible}
             onRequestClose={closeModal}
        >
            <AlertOverlay visible={getMyAccountLoading}/>
             <View style={styles.container}>
                { tokwaAccount.pinCode 
                    ? onCashIn ? <NewPIN/> : <UpdatePIN/> 
                    : <NewPIN/>
                }
                <View style={{flex: 1,alignItems:"center", justifyContent:"center"}}>
                        <Text style={{textAlign:"left",fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10,}}>Reminders</Text>
                        <View>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>Use a <Text style={{color: COLOR.YELLOW}}>secure</Text> TPIN combination</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Remember</Text> your TPIN</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Never share</Text> your TPIN with anyone</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>If you think your TPIN is no longer a secret, </Text>      
                            </Reminder>
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M,marginLeft: 28}}><Text style={{color: COLOR.YELLOW}}>change your</Text> TPIN immediately</Text>
                        </View>
                   
                </View>
                <View>
                    <YellowButton label="Done" onPress={closeModal}/>
                </View>
               <BuildingBottom/>
            </View>
     
        </Modal>
     )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    content: {
        alignItems: "center",
        flex: 1,
    },
})
