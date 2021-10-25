import React from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { YellowButton } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , SIZE , COLOR } = CONSTANTS
const {height,width} = Dimensions.get("screen")

export const SuccessfulModal = ({ visible, title, description, redirect })=> {

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={redirect}
            style={styles.container}
        >
            <View style={styles.modalBody}>
                <View style={styles.content}>
                    <View style={styles.subContent}>
                        <Image style={styles.image} source={require('toktokwallet/assets/images/success.png')}/>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
                    </View>
                    <TouchableOpacity style={styles.buttonStyle} onPress={redirect}>
                        <Text style={[ styles.fontBoldStyle, { textAlign: "center" } ]}>
                            Ok
                        </Text>
                    </TouchableOpacity>
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
        backgroundColor:"rgba(0,0,0, 0.25)",
        justifyContent:"center",
        alignItems:"center"
    },
    content: {
        width: width * 0.8,
        backgroundColor: "white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
        alignItems: "center"
    },
    buttonStyle: {
        backgroundColor: COLOR.YELLOW,
        borderRadius: 5,
        width: "40%",
        paddingVertical: 7,
        marginTop: 20
    },
    fontBoldStyle: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M
    },
    description: {
        textAlign:"center",
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M
    },
    title: {
        marginVertical: 15,
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.L,
        textAlign: "center"
    },
    subContent: {
        justifyContent:"center",
        alignItems:"center"
    },
    image: {
        width: 95,
        height: 95,
        resizeMode: "contain"
    }
})
