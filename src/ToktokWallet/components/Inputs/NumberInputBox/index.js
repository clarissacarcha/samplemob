import React from 'react';
import {TouchableHighlight, View, Text, StyleSheet, Dimensions, TextInput} from 'react-native';
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
      ...(!error ? {} : {borderWidth: 1, borderRadius: 5, borderColor: '#ED3A19'}),
    }}>
    <View style={styles.inputView}>
      <Text style={{fontSize: showPin ? 25 : 40, fontFamily: FONT.REGULAR}}>
        {value ? (showPin ? value : '•') : ''}
      </Text>
    </View>
  </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress, showPin, numberOfBox = 6, error = false}) => {
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
        alignSelf: 'center',
      }}>
      {numberBoxes}
    </View>
  );
};

export const NumberInputBox = ({
  pinCode,
  onNumPress,
  errorMessage,
  callBackFunc,
  onChangeText,
  numberOfBox = 6,
  showPin,
}) => {
  return (
    <View style={{marginBottom: 30}}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <NumberBoxes
          numberOfBox={numberOfBox}
          pinCode={pinCode}
          onNumPress={onNumPress}
          error={errorMessage}
          showPin={showPin}
        />
        <TextInput
          caretHidden
          value={pinCode}
          style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => {
            if (pinCode.length == numberOfBox && callBackFunc) callBackFunc();
          }}
          onChangeText={value => {
            if (value.length <= numberOfBox) {
              const replaceValue = value.replace(/[^0-9]/g, '');
              onChangeText(replaceValue);
            }
          }}
        />
      </View>
      {errorMessage != '' && (
        <Text
          style={{
            fontFamily: FONT.REGULAR,
            color: '#ED3A19',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 10,
          }}>
          {errorMessage}
        </Text>
      )}
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
