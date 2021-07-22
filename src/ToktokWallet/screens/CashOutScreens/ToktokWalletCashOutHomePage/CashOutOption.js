import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image,Alert} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import FIcon from 'react-native-vector-icons/Feather';
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const CashOutOption = ({route, label })=> {

    const navigation = useNavigation()

    return (
        <>
     <TouchableOpacity style={styles.cashoutoption}
                onPress={()=>navigation.navigate(route)}
     >
            <View style={styles.name}>
                <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.BOLD}}>{label}</Text>
            </View>
            <View style={styles.arrowright}>
                <FIcon name="chevron-right" size={16} color={"#A6A8A9"} /> 
            </View>
    </TouchableOpacity>
    <View style={styles.divider}/>
    </>

    )
}

const styles = StyleSheet.create({
    cashoutoption: {
        paddingVertical: 20,
        flexDirection: "row",
    },
    logo: {
        flexBasis: 45,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    name: {
        flex: 1,
        justifyContent: "center",
        alignItems:"flex-start",
    },
    arrowright: {
        justifyContent: "center",
        alignItems: "flex-end",
    },
    divider: {
        height: 1,
        width:"100%",
        backgroundColor: COLOR.LIGHT
    }
})

export default CashOutOption