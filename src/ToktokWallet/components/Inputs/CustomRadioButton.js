import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import React, {useState, useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import CONSTANTS from 'common/res/constants';

const {FONT_FAMILY: FONT, FONT_SIZE, COLOR, SHADOW, SIZE} = CONSTANTS;

export const CustomRadioButton = ({
  onPress,
  data,
  selected,
  multipleLabel = true,
  buttonInnerColor = COLOR.YELLOW,
  buttonOuterColor = COLOR.YELLOW,
  horizontal = false,
}) => {
  return (
    <RadioForm animation={true} style={horizontal && {flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
      {/* To create radio buttons, loop through your array of options */}
      {data.map((item, index) => {
        return (
          <RadioButton labelHorizontal={true} key={index} style={{paddingVertical: 3, alignItems: 'center'}}>
            {/*  You can set RadioButtonLabel before RadioButtonInput */}
            <RadioButtonInput
              obj={item}
              index={index}
              isSelected={selected === index}
              onPress={() => onPress(index, item)}
              borderWidth={1}
              buttonInnerColor={buttonInnerColor}
              buttonOuterColor={buttonInnerColor}
              buttonSize={10}
              buttonOuterSize={15}
            />
            {multipleLabel ? (
              <TouchableOpacity onPress={() => onPress(item.value)} style={{flexDirection: 'row', flex: 1}}>
                <Text style={{width: '50%', marginLeft: 10}}>{item.label}</Text>
                <Text style={{color: '#525252', textAlign: 'left'}}>{item.description}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => onPress(index, item)}>
                <Text style={{marginLeft: 10}}>{item.display}</Text>
              </TouchableOpacity>
            )}
          </RadioButton>
        );
      })}
    </RadioForm>
  );
};
