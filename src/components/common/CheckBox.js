import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {RaisedTextButton, TextButton} from 'react-native-material-buttons';
import {COLOR, FONT_COLOR, FONT_SIZE, FONT_FAMILY} from '../../res/constants';
import RNCheckBox from 'react-native-check-box';

export const CheckBox = props => {
  const {onChange} = props;
  const [getChecked, setChecked] = useState(false);

  onChange(getChecked);

  return (
    <View style={[{flexDirection: 'row', alignItems: 'center'}, props.containerStyle]}>
      <RNCheckBox
        isChecked={getChecked}
        checkBoxColor={COLOR}
        onClick={() => {
          setChecked(!getChecked);
        }}
        style={{marginRight: 8}}
      />
      <TextButton
        titleColor={FONT_COLOR}
        titleStyle={styles.titleStyle}
        shadeColor={COLOR}
        rippleColor={COLOR}
        {...props}
        style={{
          flex: 1,
        }}
        onPress={() => {
          setChecked(!getChecked);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
    fontWeight: 'normal',
    alignSelf:'flex-start'
  },
  extend: {
    flex: 1,
  },
});
