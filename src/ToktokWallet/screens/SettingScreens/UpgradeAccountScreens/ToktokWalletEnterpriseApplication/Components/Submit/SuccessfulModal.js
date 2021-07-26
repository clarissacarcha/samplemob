import React from 'react';
import { View , Text , StyleSheet , Modal , Dimensions , Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SuccessIcon from 'toktokwallet/assets/images/success.png';
import { YellowButton } from 'src/revamp';
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;
const { width , height } = Dimensions.get("window");

const SuccessfulModal = ({visible , setVisible})=> {

    const navigation = useNavigation()
    const closeModal = ()=> {
        navigation.replace("ToktokWalletEnterpriseApplication");
        return setVisible(false);
    }

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
                    <Image source={SuccessIcon}/>
                    <Text style={styles.successText}>Success !</Text>
                    <Text style={styles.messageText}>Your business documents have been submitted. These documents are for review and approval.</Text>
                    <View style={{justifyContent:"flex-end",width: "50%",marginTop: 20}}>
                            <YellowButton label="Ok" onPress={closeModal}/>
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

export default SuccessfulModal;