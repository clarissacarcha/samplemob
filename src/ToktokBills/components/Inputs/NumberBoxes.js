import React from 'react'
import {TouchableHighlight,View,Text,StyleSheet} from 'react-native'
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const NumberBox = ({onPress, value , showPin}) => (
  <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5,}}>
    <View style={styles.inputView}>
      <Text style={{fontSize: 25, fontFamily: FONT.BOLD}}>{value ? showPin ? value : "•" : ''}</Text>
    </View>
  </TouchableHighlight>
);

export const NumberBoxes = ({pinCode, onNumPress, showPin , numberOfBox = 6}) => {

  const numberBoxes = [];
  var i;
  for (i = 0; i <= (numberOfBox - 1); i++) {
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
    backgroundColor: '#F7F7FA',
    borderRadius: 5,
    height: 48,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
})



