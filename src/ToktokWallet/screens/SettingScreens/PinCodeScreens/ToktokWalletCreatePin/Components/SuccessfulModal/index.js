import React, { useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Image,Dimensions} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { BlackButton, ICON_SET, VectorIcon, YellowButton } from 'src/revamp'
import {BuildingBottom} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import { useAccount } from 'toktokwallet/hooks'

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
            <Text style={{fontSize: FONT_SIZE.XL,fontFamily: FONT.BOLD}}>Setup PIN Successful!</Text>
            <Text style={{color: "#212529",marginTop:5,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,textAlign:"center"}}>You have secured your toktokwallet. Make sure to remember your PIN and do not share it with anyone.</Text>
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
        <Text style={{fontSize: FONT_SIZE.XL,fontFamily: FONT.BOLD}}>toktokwallet PIN changed successfully</Text>
        <Text style={{color: "#212529",marginTop:5,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,textAlign:"center"}}>You can now use your new pin.</Text>
    </View>
    )
}


export const SuccessfulModal = ({modalVisible,tokwaAccount,amount,onCashIn,setSuccessModalVisible})=> {
    const navigation = useNavigation()
    const { getMyAccount , tokwaAccount: tokwaAccountLatest } = useAccount()

    useEffect(()=>{
      if(tokwaAccountLatest.pinCode && onCashIn){
        navigation.pop();
        navigation.push("ToktokWalletPaymentOptions", {
            amount: amount ? amount : 0,
            onCashIn: onCashIn
        })
        setSuccessModalVisible(false)
      }
    },[tokwaAccountLatest,onCashIn])

    const closeModal = async ()=> {
        await getMyAccount();
        if(onCashIn) return;
        navigation.navigate("ToktokWalletHomePage")

    }


    return (
        <Modal
             visible={modalVisible}
             onRequestClose={closeModal}
        >
             <View style={styles.container}>
                { tokwaAccount.pinCode ? <UpdatePIN/> : <NewPIN/>}
                <View style={{flex: 1,alignItems:"center", justifyContent:"center"}}>
                        <Text style={{textAlign:"left",fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10,}}>Reminders</Text>
                        <View>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>Use a <Text style={{color: COLOR.YELLOW}}>secure</Text> PIN combination</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Remember</Text> your PIN</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Never share</Text> your PIN with anyone</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>If you think your PIN is no longer a secret, </Text>      
                            </Reminder>
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M,marginLeft: 28}}><Text style={{color: COLOR.YELLOW}}>change your</Text> PIN immediately</Text>
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
