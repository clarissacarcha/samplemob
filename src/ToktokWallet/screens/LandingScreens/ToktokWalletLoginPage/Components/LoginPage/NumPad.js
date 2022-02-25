import React from "react";
import { View , StyleSheet , TouchableOpacity , Dimensions , Text } from "react-native";
import { verticalScale,moderateScale } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'
import FIcon from 'react-native-vector-icons/Feather';

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS
const { height, width } = Dimensions.get('window');

const ButtonPad = ()=> {

}

const RowPad = ({
    first,
    second,
    third,
    onPress,
    pinCode
})=> {
  
    return (
        <View style={styles.rowPad}>
            <TouchableOpacity onPress={()=>onPress(first.value)} disabled={!first.enableButton} style={[styles.button, {...(!first.enableButton ? {backgroundColor:"transparent"} : {})}]}>
                <Text style={styles.textBtn}>{first.value}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>onPress(second.value)} disabled={!second.enableButton} style={[styles.button, {...(!second.enableButton ? {backgroundColor:"transparent"} : {})}]}>
                <Text style={styles.textBtn}>{second.value}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>onPress(third.value)} disabled={!third.enableButton} style={[styles.button, {...(!third.enableButton ? {backgroundColor:"transparent"} : {})}]}>
               {
                   third.value == "remove"
                   ?  pinCode.length > 0 && <FIcon name="delete" size={30} color="white"/>
                   :  <Text style={styles.textBtn}>{third.value}</Text>
               }
            </TouchableOpacity>
        </View>
    )
}


const NumPad = ({
    setPinCode,
    pinCode,
    buttonColor = null,
    textColor = null
})=> {

    const onPress = (value)=> {
        if(value == "remove"){
            setPinCode(oldstate=> oldstate.slice(0,-1))
            return
        }

        setPinCode(oldstate=> oldstate + value)
    }
    return (
        <View style={styles.container}>
             <RowPad
                first={{
                    enableButton: 1,
                    value: 1,
                }}
                second={{
                    enableButton: 1,
                    value: 2,
                }}
                third={{
                    enableButton: 1,
                    value: 3,
                }}
                onPress={onPress}
                pinCode={pinCode}
             />
              <RowPad
                first={{
                    enableButton: 1,
                    value: 4,
                }}
                second={{
                    enableButton: 1,
                    value: 5,
                }}
                third={{
                    enableButton: 1,
                    value: 6,
                }}
                onPress={onPress}
                pinCode={pinCode}
             />
             <RowPad
                first={{
                    enableButton: 1,
                    value: 7,
                }}
                second={{
                    enableButton: 1,
                    value: 8,
                }}
                third={{
                    enableButton: 1,
                    value: 9,
                }}
                onPress={onPress}
                pinCode={pinCode}
             />
              <RowPad
                first={{
                    enableButton: 0,
                    value: null,
                }}
                second={{
                    enableButton: 1,
                    value: 0,
                }}
                third={{
                    enableButton: pinCode.length > 0,
                    value: "remove",
                }}
                onPress={onPress}
                pinCode={pinCode}
             />
        </View>  
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor:"orange",
    },
    rowPad: {
        flexDirection:"row",
    },
    button: {
        backgroundColor: COLOR.YELLOW,
        // backgroundColor: '#F7F7FA',
        borderRadius: 5,
        height: verticalScale(width * .15),
        width: moderateScale(width * .15),
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    textBtn: {
        fontFamily: FONT.BOLD,
        color: "white",
        fontSize: moderateScale(FONT_SIZE.XL)
    }
})

export default NumPad