/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, SearchBox, SearchBg} from './Styled';

const HomeSearchBar = (props: PropsType): React$Node => {
  return (
    <Container>
      <SearchBg>
        <SearchBox
        // hasClose={search || false}
        // onClose={() => setSearch('')}
        // onValueChange={text => setSearch(text)}
        // value={search}
        />
      </SearchBg>
    </Container>
  );
};

export default HomeSearchBar;
