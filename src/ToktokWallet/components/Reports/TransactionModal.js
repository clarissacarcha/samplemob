import React from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity, Dimensions} from 'react-native'
import { YellowButton } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const { width } = Dimensions.get("window")

export const TransactionModal = ({
    visible,
    setVisible,
    children
})=> {

    const closeModal = ()=> setVisible(false)

    return (
        <Modal
            visible={visible}
            onRequestClose={closeModal}
            transparent={true}
            style={styles.container}
        >
             <View style={styles.content}>  
                    <View style={{
                        width: width * 0.9,
                        backgroundColor:"white",
                        borderRadius: 5,
                        padding: 16,
                    }}>
                        {children}
                        <View style={{justifyContent:"flex-end", width: "50%",alignSelf:"center",marginTop: 16}}>
                            <YellowButton label="Ok" onPress={closeModal}/>
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
    content: {
        flex: 1,
        backgroundColor:"rgba(0,0,0, 0.1)",
        justifyContent:"center",
        alignItems:"center"
    },
    labelText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
    }
})