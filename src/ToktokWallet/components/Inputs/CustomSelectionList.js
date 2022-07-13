import React, {createRef, useContex, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {CheckIdleStateContext, ListModal} from 'toktokwallet/components';
import {moderateScale} from 'toktokwallet/helper';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

export const CustomSelectionList = ({
  style,
  placeholder,
  errorMessage = '',
  onSelectedValue = () => {},
  selectedValue = '',
  setSelectedValue,
  data = [],
  withSearch = false,
  onSearchValue,
  hasDefault,
  defaultCondition,
  searchPlaceholder,
  //use this props for additional validation
  hasValidation = false,
  onChangeValidation = () => {},
  showList,
  setShowList,
}) => {
  const [visible, setVisible] = useState(false);

  const onChangeSelect = ({value, index}) => {
    onSelectedValue({value, index});
  };

  const onPressInput = () => {
    hasValidation ? onChangeValidation() : setVisible(true);
  };

  return (
    <>
      <ListModal
        data={data}
        visible={hasValidation ? showList : visible}
        setVisible={hasValidation ? setShowList : setVisible}
        onChangeSelect={onChangeSelect}
        withSearch={withSearch}
        onSearchValue={onSearchValue}
        hasDefault={hasDefault}
        defaultCondition={defaultCondition}
        searchPlaceholder={searchPlaceholder}
      />
      <TouchableOpacity
        onPress={() => onPressInput()}
        style={{
          ...styles.input,
          ...styles.selectionContainer,
          ...styles.shadow,
          ...(errorMessage != '' ? styles.errorBorder : {}),
          ...style,
        }}>
        {selectedValue == '' ? (
          <Text style={[styles.selectionText, {color: COLOR.DARK}]}>{placeholder}</Text>
        ) : (
          <Text style={styles.selectionText}>{selectedValue}</Text>
        )}
        <FIcon5 name="chevron-down" size={moderateScale(16)} color={COLOR.ORANGE} />
      </TouchableOpacity>
      {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: SIZE.FORM_HEIGHT,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    paddingHorizontal: moderateScale(15),
  },
  errorBorder: {
    borderColor: COLOR.RED,
    borderWidth: 1,
  },
  errorMessage: {
    color: COLOR.RED,
    fontSize: FONT_SIZE.S,
    marginTop: 5,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'white',
  },
  selectionText: {
    flex: 1,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
});
