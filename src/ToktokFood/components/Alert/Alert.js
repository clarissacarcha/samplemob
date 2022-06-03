/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container} from './Styled';
import {Modal, ModalBody, ModalImage, ModalTitle, ModalSubtitle} from '../Modal';
import {success_image, warning_image} from 'toktokfood/assets/images';
import StyledButton from 'toktokfood/components/StyledButton';

const Alert = (props: PropsType): React$Node => {
  const {isVisible, type = '', title = '', subtitle = '', buttonText = 'OK', onPress} = props;
  var image;
  if (type === 'success') {
    image = success_image;
  } else if (type === 'warning') {
    image = warning_image;
  }

  return (
    <Modal isVisible={isVisible} borderRadius={10} flex={0}>
      <ModalBody>
        <Container>
          {image && <ModalImage source={image} size={130} />}
          {title.length > 0 && <ModalTitle>{title}</ModalTitle>}
          {subtitle.length > 0 && <ModalSubtitle>{subtitle}</ModalSubtitle>}
          <StyledButton onPress={onPress}>{buttonText}</StyledButton>
        </Container>
      </ModalBody>
    </Modal>
  );
};

export default Alert;
