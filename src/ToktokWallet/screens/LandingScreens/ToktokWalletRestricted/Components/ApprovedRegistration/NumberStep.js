import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS

const NumberStep = ({ number, label}) => {


    return (
        <View style={styles.container}>
            <View style={styles.number}>
                <Text style={styles.numberLabel}>
                    {number}
                </Text>
            </View>

            <Text style={styles.labelText}>
                    {label}
            </Text>

            {/* <View style={styles.label}>
                <Text style={styles.numberLabel}>
                    {label}
                </Text>
            </View> */}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        marginHorizontal: 20,
        marginVertical: 10,
    },
    number: {
        height: 40,
        width: 40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 20,
        borderColor: COLOR.ORANGE,
        borderWidth: 1.5,
    },
    numberLabel: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.L,
    },
    labelText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.L,
        alignSelf:"center",
        marginLeft: 20,
    },
    label: {
        flex: 1,
        alignItems:"flex-start",
        justifyContent:'center',
        height: 40,
        marginLeft: 20
    }   
})

export default NumberStep;