import React from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { YellowButton } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , SIZE , COLOR } = CONSTANTS
const {height,width} = Dimensions.get("screen")

export const SuccessfulModal = ({visible,setVisible,provider})=> {

    const navigation = useNavigation()

    const redirect = ()=> {
        setVisible(false)
        // navigation.navigate("ToktokWalletGcashHomePage", {provider})
        // return navigation.replace("ToktokWalletGcashHomePage",{provider})
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={redirect}
            style={styles.container}
        >
            <View style={styles.modalBody}>
                    <View style={styles.content}>
                            <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                                  <Image source={require('toktokwallet/assets/images/cash-out-providers/gcash.png')}/>
                                  <Text style={{marginTop: 15,fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L,textAlign:"center"}}>Linking Successful!</Text>
                                  <Text style={{textAlign:"center", fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S}}>You have successfully linked your GCash number to your toktokwallet.</Text>
                            </View>
                            <View style={{height: SIZE.FORM_HEIGHT}}>
                                <YellowButton label="Continue" onPress={redirect}/>
                            </View>
                    </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalBody: {
        flex: 1,
        backgroundColor:"rgba(0,0,0, 0.7)",
        // backgroundColor:"white",
        justifyContent:"center",
        alignItems:"center"
    },
    content: {
        height: 270,
        width: width * 0.8,
        backgroundColor: "white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
    }
})
