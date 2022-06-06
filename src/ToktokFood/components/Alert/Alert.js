/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, ButtonContainer, AlertButton, Column, TitleContainer} from './Styled';
import {Modal, ModalBody, ModalImage, ModalTitle, ModalSubtitle} from '../Modal';
import {success_image, warning_image, question_image} from 'toktokfood/assets/images';
import StyledButton from 'toktokfood/components/StyledButton';
import {useTheme} from 'styled-components';

const Alert = (props: PropsType): React$Node => {
  const theme = useTheme();
  const {
    isVisible,
    type = '',
    title = '',
    subtitle = '',
    buttonText = 'OK',
    onPress,
    buttonText2 = '',
    onPress2 = () => {},
    BodyComponent,
  } = props;
  var image;
  var color;
  if (type === 'success') {
    image = success_image;
    color = theme.color.orange;
  } else if (type === 'warning') {
    image = warning_image;
    color = theme.color.yellow;
  } else if (type === 'question') {
    image = question_image;
    color = theme.color.yellow;
  }

  const hasSecondButton = buttonText2.length > 0;

  return (
    <Modal isVisible={isVisible} borderRadius={10} flex={0}>
      <ModalBody>
        <Container>
          {image && <ModalImage source={image} size={130} />}
          {title.length > 0 && (
            <TitleContainer>
              <ModalTitle color={color}>{title}</ModalTitle>
            </TitleContainer>
          )}
          {subtitle.length > 0 && <ModalSubtitle>{subtitle}</ModalSubtitle>}
          {BodyComponent ? <BodyComponent /> : null}
          <ButtonContainer>
            <Column>
              <AlertButton type={hasSecondButton ? 'secondary' : 'primary'} onPress={onPress} buttonText={buttonText} />
            </Column>
            {hasSecondButton && (
              <Column marginLeft={15}>
                <StyledButton type="primary" onPress={onPress2} buttonText={buttonText2} />
              </Column>
            )}
          </ButtonContainer>
        </Container>
      </ModalBody>
    </Modal>
  );
};

export default Alert;
