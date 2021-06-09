import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Modal,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { FONTS, SIZES } from '../../../../../../../res/constants'
import { BlackButton, YellowButton } from '../../../../../../../revamp'


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
                <Image style={{height: 89,width: 89}} source={require('../../../../../../../assets/icons/walletVerify.png')}/>
            </View>
            <Text style={{fontSize: SIZES.XL,fontFamily: FONTS.BOLD}}>Setup PIN Successful!</Text>
            <Text style={{color: "#212529",marginTop:5,fontFamily: FONTS.REGULAR,fontSize: SIZES.M,textAlign:"center"}}>You have secured your toktokwallet. Make sure to remember your PIN and do not share it with anyone.</Text>
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
            <Image style={{height: 89,width: 89}} source={require('../../../../../../../assets/icons/walletVerify.png')}/>
        </View>
        <Text style={{fontSize: SIZES.XL,fontFamily: FONTS.BOLD}}>totkokwallet PIN changed successfully</Text>
        <Text style={{color: "#212529",marginTop:5,fontFamily: FONTS.REGULAR,fontSize: SIZES.M,textAlign:"center"}}>You can now use you new pin.</Text>
    </View>
    )
}


const SuccessModal = ({modalVisible,tokwaAccount})=> {
    const navigation = useNavigation()

    const closeModal = ()=> {
        navigation.pop()
        navigation.push("ToktokWalletHomePage")
        // navigation.pop()
        // // navigation.navigate("ToktokWalletHomePage")
        // navigation.push("ToktokWalletHomePage")
        // console.log("gg")
    }

    return (
        <Modal
             visible={modalVisible}
             onRequestClose={closeModal}
        >
             <View style={styles.container}>
                { tokwaAccount.pinCode ? <UpdatePIN/> : <NewPIN/>}
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