import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { COLOR, DARK, FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants'



const SuccessModal = ({modalVisible})=> {
    const navigation = useNavigation()

    const closeModal = ()=> {
        navigation.pop()
        navigation.replace("TokTokWallet")
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
                         height: 150,
                         width: 150,
                         backgroundColor: "#FEEABA",
                         borderRadius: 100,
                         marginVertical: 40,
                     }}>
                         <Image style={{height: 100,width: 100}} source={require('../../../../../assets/icons/walletVerify.png')}/>
                     </View>
                     <Text style={{fontSize: 20,fontFamily: FONT_MEDIUM}}>toktok wallet PIN set up successfully</Text>
                     <Text style={{color: "#212529",marginTop:5,fontFamily: FONT_REGULAR}}>Your toktok wallet is now safe!</Text>
                 </View>
      
                 <TouchableOpacity
                     onPress={closeModal}
                     style={{alignItems: "center",height: 40,backgroundColor: DARK,margin: 20,justifyContent: "center",borderRadius: 10,}}
                 >
                         <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Done</Text>
                 </TouchableOpacity>
            </View>
     
        </Modal>
     )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        alignItems: "center",
        padding: 20,
        flex: 1,
    },
})

export default SuccessModal