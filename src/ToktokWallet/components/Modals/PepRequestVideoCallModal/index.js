import React from "react";
import { View , Text , StyleSheet , Modal } from 'react-native';
import { getStatusbarHeight , moderateScale } from 'toktokwallet/helper';
import { Separator, HeaderBack } from 'toktokwallet/components';
import { YellowButton } from 'src/revamp';
import CONSTANTS from 'common/res/constants';

const {COLOR, FONT_FAMILY: FONT ,SIZE,FONT_SIZE} = CONSTANTS

export const PepRequestVideoCallModal = ({
    visible,
    setVisible,
    callback,
    setShowPepQuestionnaire
})=> {

    const closeModal = ()=> {
        setVisible(false)
        setShowPepQuestionnaire(true)
    }

    return (
        <Modal
            style={styles.container}
            visible={visible}
            onRequestClose={closeModal}
        >
            <View style={styles.header}>
                
                <View style={{justifyContent:"center",alignItems:"center"}}>
                <HeaderBack onBack={closeModal} color={COLOR.YELLOW}/>
                </View>
                <View style={{justifyContent:"center",alignItems:"center",flex: 1,height: 50,paddingRight: 50}}>
                    <Text style={{fontFamily: FONT.BOLD , fontSize: FONT_SIZE.L}}>Request for Video Call</Text>
                </View>
            </View>
            <View style={styles.clickTitle}>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Click the button below to request for video call</Text>
            </View>
            <View style={styles.body}>
                <YellowButton label="Request for Video Call" onPress={callback}/>
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
        paddingVertical: 16,
        justifyContent:"center",
        alignItems:"center",
        height: moderateScale(50),
    },
    body: {
        padding: 16,
        marginTop: 10,
    },
    clickTitle: {
        height: 64,
        backgroundColor: "#F7F7FA",
        justifyContent:"center",
        paddingHorizontal: 16,
    }
})