/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, SearchBox, SearchBg} from './Styled';
import {useNavigation} from '@react-navigation/native';
const HomeSearchBar = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  return (
    <Container>
      <SearchBg>
        <SearchBox onPressIn={e => navigation.navigate('ToktokFoodHomeSearch')} />
      </SearchBg>
    </Container>
  );
};

export default HomeSearchBar;
