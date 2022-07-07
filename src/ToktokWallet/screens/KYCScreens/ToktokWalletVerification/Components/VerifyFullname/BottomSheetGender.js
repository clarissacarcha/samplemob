import React, {useCallback, useEffect, useMemo, forwardRef, useState, useContext} from 'react';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import CONSTANTS from 'common/res/constants';
import {ListModal} from 'toktokwallet/components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const BottomSheetGender = ({
  changePersonInfo,
  visibleGenderModal,
  setVisibleGenderModal,
  changeVerifyFullNameErrors,
}) => {
  const onChangeSelect = ({value}) => {
    changePersonInfo('gender', value);
    changeVerifyFullNameErrors('genderError', '');
  };

  return (
    <ListModal
      data={[{description: 'Female'}, {description: 'Male'}]}
      visible={visibleGenderModal}
      setVisible={setVisibleGenderModal}
      onChangeSelect={onChangeSelect}
    />
  );
};

export default BottomSheetGender;
