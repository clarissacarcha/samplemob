import React, { useState } from 'react'
import { Text, StyleSheet, Image, View, Modal, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native'
import constants from '../../../../common/res/constants'
import Warning from '../../../../common/assets/globalert/Warning.png';
export const ChangePasswordConfirmationModal = ({navigation, showConfirmationChangePassword, setConfirmationChangePassword, patchUserChangePassword}) => {
    
    const [confirmed, setConfirmed] = useState(false);

    
    return (
       <Modal 
        animationType="fade"
        transparent={true}
        visible={showConfirmationChangePassword}
        style={StyleSheet.absoluteFill}>
            <View style={styles.transparent}>
                <View style={styles.card}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image 
                            source={Warning}
                            style={{height:125,width:150}}
                            resizeMode={'contain'}
                        />
                        <Text style={{
                            marginVertical:20,
                            fontFamily: constants.FONT_FAMILY.BOLD,
                            fontSize: constants.FONT_SIZE.XL + 3,
                            color: constants.COLOR.YELLOW
                        }} >Change Password</Text>
                        <Text style={{
                            fontFamily: constants.FONT_FAMILY.REGULAR,
                            fontSize: constants.FONT_SIZE.M,
                            color: '#000000'
                        }} >Are you sure you want to</Text>
                        <Text style={{
                            marginBottom: 20,
                            fontFamily: constants.FONT_FAMILY.REGULAR,
                            fontSize: constants.FONT_SIZE.M,
                            color: '#000000'
                        }} > change your password?</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                    <TouchableOpacity style={{
                        backgroundColor: constants.COLOR.WHITE,
                        borderRadius: 8,
                        width: '43%',
                        alignItems: 'center',
                        paddingVertical: 10,
                        borderWidth: 1,
                        borderColor: constants.COLOR.ORANGE,
                    }} onPress={() => {setConfirmationChangePassword(false)}}>
                        <Text style={{
                            fontFamily: constants.FONT_FAMILY.BOLD,
                            fontSize: constants.FONT_SIZE.XL,
                            color: constants.COLOR.ORANGE
                        }}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: constants.COLOR.ORANGE,
                        borderRadius: 8,
                        width: '43%',
                        alignItems: 'center',
                        paddingVertical: 10
                    }} onPress={() => {
                        setConfirmationChangePassword(false);
                        patchUserChangePassword();
                    }}>
                        <Text style={{
                            fontFamily: constants.FONT_FAMILY.BOLD,
                            fontSize: constants.FONT_SIZE.XL,
                            color: constants.COLOR.WHITE
                        }}>Yes</Text>
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
        paddingHorizontal: 25,
        paddingVertical: 30
    }
})
