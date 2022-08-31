/**
 * @format
 * @flow
 */

import React from 'react';
import {View} from 'react-native';
import type {PropsType} from './types';
import {HeaderContainer, HeaderText} from './Styled';

const getCellWidth = index => {
  switch (index) {
    case 0:
      return '25%';
    case 1:
      return '30%';
    case 2:
      return '14%';
    case 3:
      return '14%';
    case 4:
      return '17%';

    default:
      return '14%';
  }
};

const TableHeader = (props: PropsType): React$Node => {
  const {data} = props;

  return (
    <HeaderContainer>
      {data.map((header, index) => {
        let cellwidth = getCellWidth(index);
        return (
          <View style={{width: cellwidth}}>
            <HeaderText>{header}</HeaderText>
          </View>
        );
      })}
    </HeaderContainer>
  );
};

export default TableHeader;
