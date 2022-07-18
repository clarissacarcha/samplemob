import React from 'react';
import {TouchableHighlight, View, Text, StyleSheet, Dimensions} from 'react-native';
import CONSTANTS from 'common/res/constants';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {height, width} = Dimensions.get('window');

const NumberBox = ({onPress, value, showPin, error}) => (
  <TouchableHighlight
    onPress={onPress}
    underlayColor={COLOR}
    style={{
      borderRadius: 10,
      marginHorizontal: 5,
      ...(!error ? {} : {borderWidth: 1, borderRadius: 5, borderColor: COLOR.RED}),
    }}>
    <View style={styles.inputView}>
      <Text style={{fontSize: showPin ? 25 : 40, fontFamily: FONT.REGULAR}}>
        {value ? (showPin ? value : '•') : ''}
      </Text>
    </View>
  </TouchableHighlight>
);

export const NumberBoxes = ({pinCode, onNumPress, showPin, numberOfBox = 6, error = false}) => {
  const numberBoxes = [];
  var i;
  for (i = 0; i <= numberOfBox - 1; i++) {
    numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} showPin={showPin} error={error} />);
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
        alignSelf: 'center',
      }}>
      {numberBoxes}
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: '#F7F7FA',
    borderRadius: 5,
    height: width * 0.14,
    width: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
