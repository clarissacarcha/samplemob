import React from 'react'
import { View , Text , StyleSheet , Modal , Dimensions , Image , TouchableHighlight } from 'react-native';
import {useThrottle} from 'src/hooks'
import { YellowButton } from 'src/revamp';
import WarningIcon from 'toktokwallet/assets/images/warning.png';
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;
const { width , height } = Dimensions.get("window");

const CancelButton = ({
    label,
    onPress
})=> {
    const onPressThrottled = useThrottle(onPress , 1000);
    return (
        <TouchableHighlight onPress={onPressThrottled} style={styles.blackButton} underlayColor={'white'}>
        <View style={[styles.blackButtonBox]}>
          <Text style={[ styles.label ]}>{label}</Text>
        </View>
      </TouchableHighlight>
        
    )
}


export const ConfirmCreditCardModal = ({
    visible,
    setVisible,
    onPress,
})=> {

    const onPressThrottled = useThrottle(onPress , 1000);
    const closeModal = ()=> setVisible(false);
    return (
        <>
        <Modal 
            visible={visible}
            transparent={true}
            onRequestClose={closeModal}
            style={styles.container}
        >

            <View style={styles.modalBody}>
                <View style={styles.content}>
                    <Image source={WarningIcon}/>
                    <Text style={styles.successText}>Online Banking: Debit/Credit Card</Text>
                    <Text style={styles.messageText}>The amount you are trying to cash in via this option is non-transferable and can only be used for payments. Would you like to proceed?</Text>
                    
                    <View style={{flexDirection:"row", justifyContent:"center",marginTop: 20}}>
                            <View style={{width: "40%",marginRight: 10}}>
                                <CancelButton label="No" onPress={closeModal}/>
                            </View>
                            <View style={{width: "40%",marginLeft: 10}}>
                                <YellowButton label="Yes" onPress={onPressThrottled}/>
                            </View>
                          
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
    },
    messageText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        textAlign:"center",
    },
    blackButton: {
        borderRadius: 5,
    },
    blackButtonBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLOR.YELLOW
    },
    label: {
        color: 'black',
        fontSize: FONT_SIZE.L,
        paddingHorizontal: 10,
        fontFamily: FONT.BOLD,
    },
})
