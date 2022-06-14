/**
 * @format
 * @flow
 */

import React from 'react';
import type {PropsType} from './types';
import {Container, Image, ImageContainer, Text} from './Styled';
import {Modal} from 'toktokfood/components/Modal';

const StyledLoader = (props: PropsType): React$Node => {
  const {isVisible, message = ''} = props;
  return (
    <Modal
      isVisible={isVisible}
      borderRadius={10}
      flex={0}
      alignSelf="center"
      animationIn="zoomIn"
      animationOut="zoomOut">
      <Container>
        <ImageContainer>
          <Image />
        </ImageContainer>
        {message.length > 0 && <Text>{message}</Text>}
      </Container>
    </Modal>
  );
};

export default StyledLoader;
