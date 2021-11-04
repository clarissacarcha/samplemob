import React from 'react';
import { View , Text , StyleSheet , Modal , Dimensions , Image } from 'react-native';
import {useThrottle} from 'src/hooks'
import { YellowButton } from 'src/revamp';
import SuccessIcon from 'toktokwallet/assets/images/success.png';
import ErrorIcon from 'toktokwallet/assets/images/error.png';
import WarningIcon from 'toktokwallet/assets/images/warning.png';
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;
const { width , height } = Dimensions.get("window");

export const PromptModal = ({visible , title , message , onPress , event , children , closeModal = null})=> {

    const onPressThrottled = useThrottle(onPress , 2000);
    let imageIcon = SuccessIcon;
    switch(event){
        case "success":
            imageIcon = SuccessIcon;
            break
        case "error":
            imageIcon = ErrorIcon;
            break;
        case "warning":
            imageIcon = WarningIcon;
            break;
        default: 
            break;
    }

    return (
        <>
        <Modal 
            visible={visible}
            transparent={true}
            onRequestClose={closeModal ? closeModal : onPressThrottled}
            style={styles.container}
        >
            <View style={styles.modalBody}>
                <View style={styles.content}>
                    <Image source={imageIcon}/>
                    <Text style={styles.successText}>{title}</Text>
                    <Text style={styles.messageText}>{message}</Text>
                    {children}
                    <View style={{justifyContent:"flex-end",width: "50%",marginTop: 20}}>
                            <YellowButton label="Ok" onPress={onPressThrottled}/>
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
        backgroundColor:"rgba(0,0,0, 0.7)",
        justifyContent:"center",
        alignItems:"center",
    },
    content: {
        width: width * 0.8,
        backgroundColor:"white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
        alignItems:'center'
    },
    successText: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.L, 
        textAlign:"center",
        marginVertical: 10,
        marginHorizontal: 20
    },
    messageText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        textAlign:"center",
        marginHorizontal: 20,
    }
})
