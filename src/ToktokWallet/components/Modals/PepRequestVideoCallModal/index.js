import React from "react";
import { View , Text , StyleSheet , Modal } from 'react-native';
import { getStatusbarHeight , moderateScale } from 'toktokwallet/helper'

export const PepRequestVideoCallModal = ({
    visible,
    setVisible,
    callback
})=> {

    const closeModal = ()=> {
        setVisible(false)
    }

    return (
        <Modal
            style={styles.container}
            visible={visible}
            onRequestClose={closeModal}
        >
            <View style={styles.header}>

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        marginTop: getStatusbarHeight,
    },
    header: {
        flexDirection:"row",
        padding: 16,
        justifyContent:"center",
        alignItems:"center",
        height: moderateScale(50),
        flex: 1,
        backgroundColor:"green"
    }
})