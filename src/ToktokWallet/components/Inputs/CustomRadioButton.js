import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import React, {useState, useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import CONSTANTS from 'common/res/constants';

const {FONT_FAMILY: FONT, FONT_SIZE, COLOR, SHADOW, SIZE} = CONSTANTS;

export const CustomRadioButton = ({onPress, data, selected}) => {
  return (
    <RadioForm animation={true}>
      {/* To create radio buttons, loop through your array of options */}
      {data.map((obj, i) => {
        return (
          <RadioButton labelHorizontal={true} key={i} style={{alignItems: 'center', paddingVertical: 3}}>
            {/*  You can set RadioButtonLabel before RadioButtonInput */}
            <RadioButtonInput
              obj={obj}
              index={i}
              isSelected={selected === i}
              onPress={onPress}
              borderWidth={1}
              buttonInnerColor={COLOR.YELLOW}
              buttonOuterColor={COLOR.YELLOW}
              buttonSize={10}
              buttonOuterSize={15}
            />
            <TouchableOpacity onPress={() => onPress(obj.value)} style={{flexDirection: 'row', flex: 1}}>
              <Text style={{width: '50%', marginLeft: 10}}>{obj.label}</Text>
              <Text style={{color: '#525252', textAlign: 'left'}}>{obj.description}</Text>
            </TouchableOpacity>
          </RadioButton>
        );
      })}
    </RadioForm>
  );
};
