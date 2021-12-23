import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  Linking,
  TouchableWithoutFeedback
} from 'react-native'
import AccountRecoveryIcon from 'toktokwallet/assets/images/AccountRecovery/accountRecovery.png'
import EmailIcon from 'toktokwallet/assets/images/AccountRecovery/email.png'
import { SomethingWentWrong } from 'src/components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_ACCOUNT_RECOVERY } from 'toktokwallet/graphql'
import { useQuery } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native'
import { YellowButton } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT , SIZE } = CONSTANTS
const {width} = Dimensions.get("window")

const AccountRecovery = ({visible,setVisible,account})=> {

  const navigation = useNavigation();

  const {data,error,loading} = useQuery(GET_ACCOUNT_RECOVERY,{
    fetchPolicy: "network-only",
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
  })
  
  
  if(error && visible){
    return <SomethingWentWrong/>
  }

  if(loading && visible){
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size={24} color={COLOR.YELLOW} />
            </View>
  }

  const EmailCustomerService = ()=> {
    // closeModal();
    // Linking.openURL(
    //     `mailto:${constants.talkToUsEmail}?subject=Talk%20To%20Us&body=How%20can%20we%20help%20you%20ka-toktok?`,
    // );
    Linking.openURL(
        `mailto:support@toktokwallet.ph?subject=Talk%20To%20Us&body=How%20can%20we%20help%20you%20ka-toktok?`,
    );
    // navigation.navigate("ToktokWalletHelpCentreContactUs")
  }
  const AccountRecovery = ()=> {
    closeModal();
    navigation.navigate("ToktokWalletAccountRecovery" , {data: data?.getAccountRecovery})
  }

  const closeModal = ()=> setVisible(false)

  const MainComponent = ({children})=> (
    <Modal
      visible={visible}
      setVisible={setVisible}
      onRequestClose={closeModal}
      transparent={true}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.headerText}>
            Recover your toktokwallet account via:
          </Text>
          <TouchableOpacity onPress={EmailCustomerService} style={styles.option}>
            <Image 
              resizeMode="contain"
              source={EmailIcon}
              style={styles.image}
            />
            <Text style={styles.label}>Email Customer Service</Text>
          </TouchableOpacity>
          {children}
          <Text style={styles.reminder}>
            You can have your account back Katoktok! Our Customer
            Service Representative will assess your request
            via Email. Please wait for the activation of your account
            within 24hrs.
          </Text>
          <View style={{marginTop:16,width:"100%"}}>
              <YellowButton label="Close" onPress={()=>setVisible(false)}/>
          </View>
        </View>
      </View>
    </Modal>
  )

  if(data?.getAccountRecovery.length > 0){
    return (
      <MainComponent>
        { account.disabledType == "2" && (
          <TouchableOpacity onPress={AccountRecovery} style={styles.option}>
            <Image 
              resizeMode="contain"
              source={AccountRecoveryIcon}
              style={styles.image}
            />
            <Text style={styles.label}>Account Recovery</Text>
          </TouchableOpacity>
        )}
      </MainComponent>
    )
  }

  return (
    <MainComponent/>
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor:"rgba(0,0,0, 0.7)",
    justifyContent:"center",
    alignItems:"center",
  },
  content: {
    width: width * 0.8,
    backgroundColor:"white",
    borderRadius: SIZE.BORDER_RADIUS,
    padding: 16,
    alignItems:'center',
    borderWidth: 2,
    borderColor: COLOR.YELLOW
  },
  label: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    color: COLOR.ORANGE,
    textDecorationLine:"underline"
  },
  image: {
    height: FONT_SIZE.L + 10,
    width: FONT_SIZE.L + 20,
    marginHorizontal: 5,
  },  
  reminder: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    textAlign:"center",
    color:COLOR.DARK,
    marginTop: 20,
    marginBottom: 10
  },
  option: {
    flexDirection:'row',
    marginVertical: 10,
    alignItems: "center"
  },
  headerText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    marginBottom: 10,
    textAlign: "center"
  }
})

export default AccountRecovery