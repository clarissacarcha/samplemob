/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {TextInput, Container, CloseIcon, SearchIcon, PressableContainer} from './Styled';

const SearchBar = (props: PropsType): React$Node => {
  const {
    value,
    onValueChange,
    onClose,
    hasClose = false,
    style,
    onPress,
    color,
    textColor,
    placeholder = 'What would you like to eat?',
    onPressIn,
    ref,
  } = props;

  if (onPress) {
    return (
      <PressableContainer onPress={onPress} style={style}>
        <SearchIcon color={color} />
        <TextInput
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChangeText={text => onValueChange(text)}
          onFocus={onPress}
          color={color}
        />
      </PressableContainer>
    );
  }
  return (
    <Container style={style}>
      <SearchIcon color={color} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={text => onValueChange(text)}
        color={textColor}
        onPressIn={onPressIn}
      />
      {hasClose && <CloseIcon onPress={onClose} color={color} />}
    </Container>
  );
};

export default SearchBar;
