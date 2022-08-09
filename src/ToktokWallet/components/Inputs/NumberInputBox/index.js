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
      ...(!error ? {} : {borderWidth: 1, borderRadius: 5, borderColor: COLOR.RED}),
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
        marginBottom: 20,
        alignSelf: 'center',
      }}>
      {numberBoxes}
    </View>
  );
};

export const NumberInputBox = ({otpCode, onNumPress, errorMessage, callBackFunc, onChangeText}) => {
  return (
    <>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <NumberBoxes pinCode={otpCode} onNumPress={onNumPress} showPin={true} error={errorMessage} />
        <TextInput
          caretHidden
          value={otpCode}
          style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => {
            if (otpCode.length == 6) callBackFunc();
          }}
          onChangeText={value => {
            if (value.length <= 6) {
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
            color: 'red',
            alignSelf: 'center',
            fontSize: 12,
            textAlign: 'center',
          }}>
          {errorMessage}
        </Text>
      )}
    </>
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
