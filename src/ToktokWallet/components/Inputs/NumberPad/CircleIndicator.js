import React from 'react'
import {TouchableHighlight, View, Text, StyleSheet, Dimensions} from 'react-native'
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const { height, width } = Dimensions.get('window');

const Circle = ({onPress, value , showPin , error }) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5, ...(!error ? {} : {borderWidth: 1,borderRadius: 0, borderColor:COLOR.RED}) }}>
      <View style={[styles.inputView, {...(value ? {backgroundColor:COLOR.ORANGE} : {})}]}>
        {/* <Text style={{fontSize: 20, fontFamily: FONT.BOLD,}}>{value ? showPin ? value : "•" : ''}</Text> */}
      </View>
    </TouchableHighlight>
);

export const CircleIndicator = ({
    pinCode, 
    onNumPress, 
    showPin, 
    numberOfBox = 6,
    error = false
})=> {

    const numberBoxes = [];
    var i;
    for (i = 0; i <= (numberOfBox - 1); i++) {
      numberBoxes.push(<Circle onPress={onNumPress} value={pinCode[i]} showPin={showPin} error={error}/>);
    }

    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20,alignSelf:"center"}}>
                {numberBoxes}
        </View>
    )
}


const styles = StyleSheet.create({
    inputView: {
        backgroundColor: '#F7F7FA',
        borderRadius: 5,
        // height: width * .15,
        // width: width * .13,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

