import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image} from 'react-native'
import { FONTS, SIZES } from '../../../../../../res/constants'
import FIcon from 'react-native-vector-icons/Feather';

const CashOutOption = ({icon,title,iconSize,onPress})=> {

    return (
     <TouchableOpacity style={styles.cashoutoption} onPress={onPress}>
            <View style={styles.logo}>
                <Image source={icon} style={{height: iconSize.height, width: iconSize.width}} resizeMode="contain"/>
            </View>
            <View style={styles.name}>
                <Text style={{fontSize:SIZES.M,fontFamily: FONTS.BOLD}}>{title}</Text>
                <Text style={{fontSize: SIZES.S, fontFamily: FONTS.REGULAR}}>Use {title} to cash out</Text>
            </View>
            <View style={styles.arrowright}>
                <FIcon name="chevron-right" size={16} color={"#A6A8A9"} /> 
            </View>
    </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    cashoutoption: {
        paddingVertical: 20,
        borderBottomWidth: 0.2,
        borderColor: "silver",
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
    }
})

export default CashOutOption