import React from 'react'
import {Modal,View,Text,StyleSheet,Dimensions , Image} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
import { YellowButton } from '../../../../../../revamp'

const {width,height} = Dimensions.get("window")

const SuccessfulModal = ({visible,setVisible , provider})=> {

    const navigation = useNavigation()

    const Redirect = ()=>{
        setVisible(false)
        navigation.navigate("ToktokWalletBDOHomePage", {provider})
        return navigation.replace("ToktokWalletBDOHomePage", {provider})
    }

    return (
        <>
            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={Redirect}
                style={styles.container}
            >

                <View style={styles.modalBody}>
                    <View style={styles.content}>
                        <Image source={require('../../../../../../assets/toktokwallet-assets/success.png')}/>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L, textAlign:"center",marginVertical: 10,marginHorizontal: 20}}>Success !</Text>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M, textAlign:"center",marginHorizontal: 5}}>Your application has been submitted. Please wait for your BDO disbursement account to be verified.</Text>
                        <View style={{flex: 1,justifyContent:"flex-end",width: "50%"}}>
                                <YellowButton label="Ok" onPress={Redirect}/>
                        </View>
                    </View>
                </View>
                
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalBody: {
        flex: 1,
        backgroundColor:"rgba(34, 34, 34, 0.25)",
        justifyContent:'center',
        alignItems:'center'
    },
    content: {
        width: width * 0.8,
        height: 290,
        backgroundColor:"white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
        alignItems:'center'
    }
})

export default SuccessfulModal