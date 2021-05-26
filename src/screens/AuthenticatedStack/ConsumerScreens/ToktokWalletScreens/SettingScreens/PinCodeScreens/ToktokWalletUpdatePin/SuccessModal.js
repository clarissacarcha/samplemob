import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { COLOR, DARK, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../../../res/constants'
import { BlackButton } from '../../../../../../../revamp'



const SuccessModal = ({modalVisible})=> {
    const navigation = useNavigation()

    const closeModal = ()=> {
       // navigation.pop()
        navigation.navigate("ToktokWalletHomePage")
        navigation.replace("ToktokWalletHomePage")
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
                         height: 80,
                         width: 80,
                         backgroundColor: "#FEEABA",
                         borderRadius: 100,
                         marginTop: 30,
                         marginBottom: 40,
                     }}>
                         <Image style={{height: 40,width: 40}} source={require('../../../../../../../assets/icons/walletVerify.png')}/>
                     </View>
                     <Text style={{fontSize: SIZES.XL,fontFamily: FONT_MEDIUM}}>toktokwallet PIN has been updated</Text>
                     <Text style={{color: "#212529",marginTop:5,fontFamily: FONT_REGULAR,fontSize: SIZES.M}}>Your toktokwallet is now safe.</Text>
                 </View>
      
                 <BlackButton label="Done" onPress={closeModal}/>
            </View>
     
        </Modal>
     )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
    },
    content: {
        alignItems: "center",
       
        flex: 1,
    },
})

export default SuccessModal