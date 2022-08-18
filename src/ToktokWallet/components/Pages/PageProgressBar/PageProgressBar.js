/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, ProgressBarContainer, ProgressBarItem} from './Styled';

const PageProgressBar = (props: PropsType): React$Node => {
  const {currentIndex, screens} = props;

  return (
    <Container>
      <ProgressBarContainer>
        {screens.map((item, index) => {
          if (index < screens.length) {
            return <ProgressBarItem donePage={index <= currentIndex} />;
          }
        })}
      </ProgressBarContainer>
      {screens[currentIndex]}
    </Container>
  );
};

export default PageProgressBar;
