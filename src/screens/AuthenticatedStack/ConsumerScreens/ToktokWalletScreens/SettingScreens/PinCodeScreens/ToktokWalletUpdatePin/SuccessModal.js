import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { FONTS, SIZES } from '../../../../../../../res/constants'
import { BlackButton, YellowButton } from '../../../../../../../revamp'



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
                         height: 160,
                         width: 160,
                         backgroundColor: "#FEEABA",
                         borderRadius: 100,
                         marginTop: 60,
                         marginBottom: 35,
                     }}>
                         <Image style={{height: 89,width: 89}} source={require('../../../../../../../assets/icons/walletVerify.png')}/>
                     </View>
                     <Text style={{fontSize: SIZES.XL,fontFamily: FONTS.BOLD}}>Update PIN Successful!</Text>
                     <Text style={{color: "#212529",marginTop:5,fontFamily: FONTS.REGULAR,fontSize: SIZES.M,textAlign:"center"}}>You have successfully changed your toktokwallet PIN. Make sure to remember your PIN and do not share it with anyone.</Text>
                 </View>
                
                <View>
                    <YellowButton label="Done" onPress={closeModal}/>
                </View>
                
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

export default SuccessModal