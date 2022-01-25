import React from "react";
import { TouchableOpacity , StyleSheet , Text , View } from "react-native";
import { useThrottle } from 'src/hooks';
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const PaymentMethod = ({
    onPress,
    label,
})=> {

    const onThrottledPress = useThrottle(onPress , 2000);

    return (
        <>
       <TouchableOpacity
            style={styles.container}
            onPress={onThrottledPress}
       >
           <Text style={styles.label}>{label}</Text>
       </TouchableOpacity>
       <View style={styles.divider}/>
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        justifyContent:"center"
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: "#FFF2D5",
    },
    label: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR
    }
})