import React from 'react'
import {TouchableHighlight, View, Text, StyleSheet, Dimensions} from 'react-native'
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS
const { height, width } = Dimensions.get('window');

const NumberBox = ({onPress, value, showPin, isError}) => (
  <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5,}}>
    <View style={isError ? styles.error : styles.inputView}>
      <Text style={showPin ? styles.showPin : styles.hidePin}>{value ? showPin ? value : "•" : ''}</Text>
    </View>
  </TouchableHighlight>
);

export const NumberBoxes = ({pinCode, onNumPress, showPin , numberOfBox = 6, isError = false}) => {

  const numberBoxes = [];
  var i;
  for (i = 0; i <= (numberOfBox - 1); i++) {
    numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} showPin={showPin} isError={isError}/>);
  }
  return (
    <View style={styles.container}>
      {numberBoxes}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignSelf:"center"
  },
  inputView: {
    backgroundColor: '#F7F7FA',
    borderRadius: 5,
    height: width * .15,
    width: width * .13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    backgroundColor: '#F7F7FA',
    borderRadius: 5,
    height: width * .15,
    width: width * .13,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLOR.RED,
    borderWidth: 1
  },
  showPin: {
    fontSize: 20,
    color: "black"
  },
  hidePin: {
    fontSize: 25,
    fontFamily: FONT.BOLD,
    color: "black"
  }
})
