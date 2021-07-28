import React from 'react'
import {Modal,View,Text,StyleSheet,Dimensions , Image} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { YellowButton } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , SIZE , COLOR } = CONSTANTS
const {width,height} = Dimensions.get("window")

export const RemoveSuccessfulModal = ({visible,setVisible})=> {

    const navigation = useNavigation()

    const Redirect = ()=>{
        setVisible(false)
        navigation.pop(2)
        return navigation.replace("ToktokWalletCashOutOtherBanks")
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
                        <Image source={require('toktokwallet/assets/images/success.png')}/>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M, textAlign:"center",marginVertical: 10,marginHorizontal: 20}}>Account has been removed.</Text>
                        <View style={{flex: 1,justifyContent:"flex-end",width: "50%"}}>
                                <YellowButton label="Continue" onPress={Redirect}/>
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
        height: 240,
        backgroundColor:"white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
        alignItems:'center'
    }
})
