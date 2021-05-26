import React from 'react'
import {TouchableHighlight,View,Text,StyleSheet} from 'react-native'
import { COLOR } from '../../../../../../res/constants';

const NumberBox = ({onPress, value , showPin}) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5,}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 25}}>{value ? showPin ? value : "*" : '_'}</Text>
      </View>
    </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress, showPin}) => {

    const numberBoxes = [];
    var i;
    for (i = 0; i <= 5; i++) {
      numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} showPin={showPin}/>);
    }
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20,alignSelf:"center"}}>
            {numberBoxes}
        </View>
    );
};


const styles = StyleSheet.create({
    inputView: {
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default NumberBoxes


