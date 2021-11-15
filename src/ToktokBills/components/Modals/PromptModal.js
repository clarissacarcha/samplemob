import React from 'react'
import { View , Modal , Text , StyleSheet } from 'react-native'
import { useThrottle } from 'src/hooks'

export const PromptModal = ({
    type,
    title,
    message,
    visible,
    setVisible,
    onPress
}) => {

    const closeModal = setVisible(false)
    const onThrottledPress = useThrottle(onPress ? onPress : closeModal, 2000)

    return (
        <Modal
            visible={visible}
            style={styles.container}
            transparent={true}
            onRequestClose={onThrottledPress}
        >

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})