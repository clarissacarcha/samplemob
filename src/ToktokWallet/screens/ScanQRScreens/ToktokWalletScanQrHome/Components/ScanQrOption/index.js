import React from 'react';
import { View , Text , StyleSheet , Image , TouchableOpacity } from 'react-native';
import {useThrottle} from 'toktokwallet/hooks';
import { useNavigation } from '@react-navigation/native';
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE , MARGIN } = CONSTANTS;


export const ScanQrOption = ({
    logo,
    label,
    route
})=> {
    const navigation = useNavigation();
    const onPressThrottled = useThrottle(()=> {
            navigation.navigate(route)
    },2000)

    return (
        <TouchableOpacity onPress={onPressThrottled} style={styles.container}>
            <Image style={styles.logo} source={logo} resizeMode="contain"/>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        backgroundColor:"white",
        borderRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 6,
        padding: 15,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
    },
    label: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M,
        marginLeft: 5,
    },
    logo: {
        marginRight:5 ,
        height: FONT_SIZE.M + 5,
        width: FONT_SIZE.M + 5,
    }
})