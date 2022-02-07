import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { BlackButton, ICON_SET, VectorIcon, YellowButton } from 'src/revamp'
import { BuildingBottom, PromptModal } from 'toktokwallet/components'
import { useAccount } from 'toktokwallet/hooks'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

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

export const SuccessModal = ({modalVisible , setModalVisible , event, category})=> {
  const navigation = useNavigation()
  const { getMyAccount } = useAccount();

  const closeModal = ()=> {
    setModalVisible(false)

    if(event == "ACCOUNT RECOVERY"){
      getMyAccount();
      navigation.pop(3);
      // navigation.navigate("ToktokWalletLoginPage")
      // navigation.replace("ToktokWalletLoginPage")
      navigation.navigate("ToktokLandingHome")
      navigation.push("ToktokWalletLoginPage")
      return;  
    }
    navigation.navigate("ToktokWalletHomePage")
    navigation.replace("ToktokWalletHomePage")
  }
  
  if(event == "ACCOUNT RECOVERY" && !category){
    let title = "Account Recovery Successful";
    let message = "You have successfully recovered your account. Please do not forget your new MPIN and do not share this with anyone."
    
    return (
      <PromptModal 
        visible={modalVisible} 
        onPress={closeModal}
        message={message}
        title={title}
        event="success"
      />
    )
  }
  return (
    <Modal
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.container}>
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
          <Text style={{fontSize: FONT_SIZE.XL,fontFamily: FONT.BOLD}}>toktokwallet MPIN changed successfully</Text>
          <Text style={{color: "#212529",marginTop:5,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,textAlign:"center"}}>You can now use your new MPIN.</Text>
        </View>

        <View style={{flex: 1,alignItems:"center", justifyContent:"center"}}>
          <Text style={{textAlign:"left",fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10,color: COLOR.YELLOW}}>Reminders</Text>
          <View>
            <Reminder>
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>Use a <Text style={{color: COLOR.YELLOW}}>secure</Text> MPIN combination</Text>
            </Reminder>
            <Reminder>
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Remember</Text> your MPIN</Text>
            </Reminder>
            <Reminder>
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}><Text style={{color: COLOR.YELLOW}}>Never share</Text> your MPIN with anyone</Text>
            </Reminder>
            <Reminder>
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>If you think your MPIN is no longer a secret, </Text>      
            </Reminder>
            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M,marginLeft: 28}}><Text style={{color: COLOR.YELLOW}}>change your</Text> MPIN immediately</Text>
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