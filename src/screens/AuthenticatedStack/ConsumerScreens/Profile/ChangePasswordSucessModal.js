import React, { useState } from 'react'
import { Text, StyleSheet, Image, View, Modal, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native'
import constants from '../../../../common/res/constants'
import DeliveryComplete from '../../../../common/assets/globalert/Success.png';

export const ChangePasswordSuccessModal = ({navigation, successfulChangePassword, setSuccessfulChangePassword}) => {
    
    const [confirmed, setConfirmed] = useState(false);

    
    return (
       <Modal 
        animationType="fade"
        transparent={true}
        visible={successfulChangePassword}
        style={StyleSheet.absoluteFill}>
            <View style={styles.transparent}>
                <View style={styles.card}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image 
                            source={DeliveryComplete}
                            style={{height:125,width:150}}
                            resizeMode={'contain'}
                        />
                        <Text style={{
                            marginVertical: 20,
                            fontFamily: constants.FONT_FAMILY.BOLD,
                            fontSize: constants.FONT_SIZE.XL + 3,
                            color: constants.COLOR.ORANGE
                        }} >Password Changed</Text>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: constants.FONT_FAMILY.REGULAR,
                            fontSize: constants.FONT_SIZE.M,
                            color: '#000000',
                            marginBottom:  20
                        }} >Your password has now been successfully changed. You may now log in using your new password.</Text>
                    </View>
                    <View style={{marginHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity style={{
                        backgroundColor: constants.COLOR.ORANGE,
                        borderRadius: 8,
                        paddingHorizontal:'45%',
                        alignItems: 'center',
                        paddingVertical: 10
                    }} onPress={() => {
                        setSuccessfulChangePassword(false)
                        navigation.pop();
                        navigation.pop();
                    }}>
                        <Text style={{
                            fontFamily: constants.FONT_FAMILY.BOLD,
                            fontSize: constants.FONT_SIZE.XL,
                            color: constants.COLOR.WHITE,
                           
                        }}>OK</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
       </Modal>
    )
}

const styles = StyleSheet.create({
    transparent: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 30,
        justifyContent: 'center'
    },
    card: {
        backgroundColor: constants.COLOR.WHITE,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 30
    }
})
