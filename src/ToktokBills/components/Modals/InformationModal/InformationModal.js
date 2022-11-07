/**
 * @format
 * @flow
 */

import React, {useMemo, useState, useCallback} from 'react';

import type {PropsType} from './types';
import {Container, ContentContainer, CustomModal, Information} from './Styled';
import {OrangeButton} from 'toktokwallet/components';

const InformationModal = (props: PropsType): React$Node => {
  const {visible, setVisible, information} = props;

  const onPressClose = () => {
    setVisible(false);
  };

  return (
    <CustomModal visible={visible} onRequestClose={onPressClose}>
      <Container>
        <ContentContainer>
          <Information>{information}</Information>
          <OrangeButton onPress={onPressClose} label="OK" />
        </ContentContainer>
      </Container>
    </CustomModal>
  );
};

export default InformationModal;
