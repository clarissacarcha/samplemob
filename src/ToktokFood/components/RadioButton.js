import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import {moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';

const RadioButton = (props) => {
  const {id, style, selected, onValueChange, readonly, isMultiple, name} = props;

  const componentClick = () => {
    if (!readonly) {
      onValueChange(selected);
    }
  };

  if(isMultiple){
    console.log(name)
    return (
      <TouchableOpacity onPress={() => componentClick()} style={styles.circleContainer}>
        <View
          key={id}
          style={[
            {
              width: 20,
              height: 20,
              borderWidth: 1,
              borderRadius: 7,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: selected ? '#FFA700' : '#C7C7C7',
            },
            style,
          ]}>
          {selected ? (
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 7,
                backgroundColor: '#FFA700',
              }}
            />
          ) : null}
        </View>
        <Text style={styles.checkBoxText}>{name}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={() => componentClick()} style={styles.circleContainer}>
      <View
        key={id}
        style={[
          {
            width: 20,
            height: 20,
            borderWidth: 1,
            borderRadius: 50,
            marginRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#FFA700',
          },
        ]}>
        {selected ? (
          <View
            style={{
              height: 14,
              width: 14,
              borderRadius: 50,
              backgroundColor: '#FFA700',
            }}
          />
        ) : null}
      </View>
      <Text style={styles.checkBoxText}>{name}</Text>
    </TouchableOpacity>
   
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  checkBoxText: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    textDecorationLine: 'none',
    flexShrink: 1
  },
});

export default RadioButton;
