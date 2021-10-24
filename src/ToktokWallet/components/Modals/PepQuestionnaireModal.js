import React from 'react'
import { StyleSheet , View , Text , Modal } from 'react-native'
import { getStatusbarHeight } from 'toktokwallet/helper'
import { YellowButton } from 'src/revamp';

export const PepQuestionnaireModal = ({
    visible,
    setVisible,
    pepInfo,
    setPepInfo,
    callback,
})=> {

    const closeModal = ()=> {
        setVisible(false);
    }

    const onPress = ()=> {
        callback()
    }

    return(
        <Modal
            style={styles.container}
            transparent={false}
            visible={visible}
            onRequestClose={closeModal}
        >
                <YellowButton onPress={onPress} label="Proceed"/>
                <Text>{JSON.stringify(pepInfo)}</Text>
        </Modal>
    )
}

const styles =  StyleSheet.create({
    container: {
        marginTop: getStatusbarHeight,
        padding: 16,
        flex: 1,
        backgroundColor:"white"
    }
})