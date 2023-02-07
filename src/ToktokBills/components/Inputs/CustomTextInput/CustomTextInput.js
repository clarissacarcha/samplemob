/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {InformationModal} from '../../Modals';

import type {PropsType} from './types';
import {Error, Label, Input, InfoContainer, InfoIcon} from './Styled';
import CONSTANTS from 'src/common/res/constants';
const {COLOR} = CONSTANTS;

const CustomTextInput = (props: PropsType): React$Node => {
  const {
    style,
    placeholder,
    placeholderTextColor = '#9E9E9E',
    value,
    onChangeText,
    returnKeyType = 'done',
    onSubmitEditing,
    keyboardType = 'default',
    maxLength = null,
    onBlur,
    onFocus,
    caretHidden,
    editable = true,
    errorMessage = '',
    label = '',
    multiline = false,
    numberOfLines,
    textAlignVertical,
    information = '',
  } = props;

  const [visible, setVisible] = useState(false);

  return (
    <View>
      <InformationModal setVisible={setVisible} visible={visible} information={information} />
      <InfoContainer>
        {label !== '' && <Label>{label}</Label>}
        {information !== '' && (
          <TouchableOpacity onPress={() => setVisible(true)}>
            <InfoIcon />
          </TouchableOpacity>
        )}
      </InfoContainer>
      <Input
        style={style}
        value={value}
        defaultValue={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        returnKeyType={returnKeyType}
        editable={editable}
        maxLength={maxLength}
        keyboardType={keyboardType}
        hasError={errorMessage !== ''}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        caretHidden={caretHidden}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
      />
      {errorMessage !== '' && <Error>{errorMessage}</Error>}
    </View>
  );
};
export default CustomTextInput;
