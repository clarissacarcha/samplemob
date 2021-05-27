import React from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
const {height,width} = Dimensions.get("screen")

const SuccessfulModal = ({visible,setVisible,provider})=> {

    const navigation = useNavigation()

    const redirect = ()=> {
        setVisible(false)
        navigation.navigate("ToktokWalletGcashHomePage", {provider})
        return navigation.replace("ToktokWalletGcashHomePage",{provider})
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
                                  <Image source={require('../../../../../../assets/toktokwallet-assets/success.png')}/>
                                  <Text style={{marginTop: 20,fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L,textAlign:"center"}}>GCash number successfully linked</Text>
                            </View>
                            <View style={{height: SIZE.FORM_HEIGHT}}>
                                <TouchableOpacity 
                                        style={{
                                            flex: 1,
                                            paddingVertical: 2,
                                            height: SIZE.FORM_HEIGHT,
                                            justifyContent:"center",
                                            alignItems:"center"
                                        }}
                                        onPress={redirect}
                                    >
                                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Ok</Text>
                                </TouchableOpacity>
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
        height: 250,
        width: width * 0.9,
        backgroundColor: "white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
    }
})

export default SuccessfulModal