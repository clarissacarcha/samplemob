import React from 'react';
import { View , Text , StyleSheet , Modal , Dimensions , Image } from 'react-native';
import {useThrottle} from 'src/hooks'
import { YellowButton } from 'src/revamp';
import SuccessIcon from 'toktokwallet/assets/images/success.png';
import { useNavigation } from '@react-navigation/native'
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;
const { width , height } = Dimensions.get("window");

export const SuccessfulModal = ({visible , setVisible})=> {
    let imageIcon = SuccessIcon
    const navigation = useNavigation();
    const onPress = ()=> {
        setVisible(false)
        navigation.pop(3)
        return navigation.navigate("ToktokWalletHomePage")
    }
    const onPressThrottled = useThrottle(onPress , 2000);

    return (
        <>
        <Modal 
            visible={visible}
            transparent={true}
            onRequestClose={onPressThrottled}
            style={styles.container}
        >
            <View style={styles.modalBody}>
                <View style={styles.content}>
                    <Image source={imageIcon}/>
                    <Text style={styles.successText}>Successful!</Text>
                    <Text style={styles.messageText}>Your account has been recovered. If you forgot your MPIN go to settings and click "Change MPIN"</Text>
                    <View style={{justifyContent:"flex-end",width: "50%",marginTop: 20}}>
                            <YellowButton label="OK" onPress={onPressThrottled}/>
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
