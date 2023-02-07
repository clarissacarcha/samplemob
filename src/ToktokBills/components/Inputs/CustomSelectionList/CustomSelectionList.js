/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {ArrowDown, ErrorText, Label, Placeholder, SelectionInput} from './Styled';
import {ListModal} from 'toktokbills/components';

const CustomSelectionList = (props: PropsType): React$Node => {
  const {
    placeholder,
    errorMessage = '',
    onSelectedValue,
    selectedValue = '',
    data = [],
    withSearch = false,
    onSearchValue,
    hasDefault,
    defaultCondition,
    searchPlaceholder,
    hasValidation = false,
    onChangeValidation = () => {},
    showList,
    setShowList,
    label = '',
    multiple = false,
    removeValue,
  } = props;
  const hasError = !!errorMessage;
  const [visible, setVisible] = useState(false);

  const onChangeSelect = item => {
    onSelectedValue(item);
  };

  const onPressInput = () => {
    hasValidation ? onChangeValidation() : setVisible(true);
  };

  return (
    <>
      {label !== '' && <Label>{label}</Label>}
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
        multiple={multiple}
        removeValue={removeValue}
      />
      <SelectionInput onPress={() => onPressInput()} hasError={hasError}>
        <Placeholder hasValue={selectedValue !== ''}>{selectedValue !== '' ? selectedValue : placeholder}</Placeholder>
        <ArrowDown />
      </SelectionInput>
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </>
  );
};

export default CustomSelectionList;
