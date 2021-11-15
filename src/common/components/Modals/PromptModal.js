import React from 'react'
import { View , Modal , Text , StyleSheet , Image , Dimensions , TouchableOpacity} from 'react-native'
import { useThrottle } from 'src/hooks'
import { moderateScale } from 'toktokwallet/helper'
import Error from 'src/common/assets/globalert/Error.png'
import Question from 'src/common/assets/globalert/Question.png'
import Success from 'src/common/assets/globalert/Success.png'
import Warning from 'src/common/assets/globalert/Warning.png'
import CONSTANTS from 'common/res/constants';

const { width } = Dimensions.get("window")
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE  , SHADOW } = CONSTANTS

export const PromptModal = ({
    type,
    title,
    message,
    visible,
    setVisible,
    onPress,
}) => {

    const closeModal = ()=> setVisible(false)
    const onThrottledPress = useThrottle(onPress ? onPress : closeModal, 2000)

    let icon = Error
    switch(type){
        case "success":
            icon = Success;
            break;
        case "error":
            icon = Error;
            break;
        case "warning":
            icon = Warning;
            break;
        case "question":
            icon = Question;
            break;
        default: 
            break;
    }

    return (
        <Modal
            visible={visible}
            style={styles.container}
            transparent={true}
            onRequestClose={onThrottledPress}
        >
                <View style={styles.content}>
                       <View style={styles.body}>
                            <Image resizeMode="contain" style={styles.image} source={icon}/>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.message}>{message}</Text>
                            <TouchableOpacity onPress={onThrottledPress} style={styles.btn}>
                                    <Text style={styles.btnText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        backgroundColor:"rgba(0,0,0,0.3)",
        justifyContent:"center",
        alignItems:'center'
    },
    body: {
        width: width * 0.7,
        backgroundColor:"white",
        borderRadius: 5,
        padding: 16,
        justifyContent:"center",
        alignItems:'center',
    },
    image: {
        height: moderateScale(130),
        width: moderateScale(130)
    },
    title: {
        fontFamily: FONT.BOLD,
        fontSize: moderateScale(FONT_SIZE.XL),
        color: COLOR.ORANGE,
        marginVertical: 5,
    },
    message: {
        fontFamily: FONT.REGULAR,
        fontSize: moderateScale(FONT_SIZE.M),
        marginVertical: 5,
        marginHorizontal: moderateScale(2),
        textAlign:"center",
    },
    btn: {
        height: moderateScale(50),
        width: moderateScale(100),
        borderRadius: 5,
        backgroundColor: COLOR.ORANGE,
        justifyContent:"center",
        alignItems:'center',
        marginTop: 30,
    },
    btnText: {
        fontFamily: FONT.BOLD,
        fontSize: moderateScale(FONT_SIZE.L),
        color: "white",
    }
})