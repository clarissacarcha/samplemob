import React from 'react'
import {Modal,StyleSheet, View, Text, ActivityIndicator} from 'react-native'
import CONSTANTS from 'common/res/constants'
const { COLOR } = CONSTANTS

export const ModalPaginationLoading = ({visible,setVisible})=> {

    return (
       <Modal
            transparent={true}
            visible={visible}
            style={styles.container}
       >
           <View style={styles.modalBody}>
                    <ActivityIndicator color={COLOR.YELLOW}/>
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
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"transparent"
    }
})
