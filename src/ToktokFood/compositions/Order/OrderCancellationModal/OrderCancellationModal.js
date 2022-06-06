/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import type {PropsType} from './types';
import {CancelModal, ErrorText, ButtonContainer, Column, Container} from './Styled';
import {ModalHeader, ModalTitle, ModalBody} from 'toktokfood/components/Modal';
import Radio from 'toktokfood/components/Radio';
import StyledButton from 'toktokfood/components/StyledButton';

const CANCELLATION_REASONS = [
  {id: 1, reason: "I'd like to change my order"},
  {id: 2, reason: "I'll use another food app"},
  {id: 3, reason: "I'd like to change my delivery address"},
  {id: 4, reason: 'I found a cheaper option'},
  {id: 5, reason: "I'd like to add another order"},
  {id: 6, reason: "I'd like to have my order delivered"},
  {id: 7, reason: "I'd like to have my order picked up"},
  {id: 8, reason: 'Merchant took so long to accept my order'},
];

const OrderCancellationModal = (props: PropsType): React$Node => {
  const {isVisible, onCancel, onConfirm} = props;
  const [selectedReason, setSelectedReason] = useState('');
  const [showError, setShowError] = useState(false);

  const onSubmit = () => {
    if (selectedReason) {
      setShowError(false);
      onConfirm(selectedReason);
    } else {
      setShowError(true);
    }
  };

  const onClose = () => {
    setSelectedReason('');
    setShowError(false);
    onCancel();
  };

  return (
    <CancelModal isVisible={isVisible} hideModalContentWhileAnimating={true}>
      <ModalHeader>
        <ModalTitle align="left" size={18}>
          Reason for cancelling
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Container />
        {CANCELLATION_REASONS.map(reason => (
          <Radio
            key={reason.id}
            title={reason.reason}
            checked={reason.reason === selectedReason}
            onPress={() => setSelectedReason(reason.reason)}
          />
        ))}
        {showError && <ErrorText>Please make a selection</ErrorText>}
        <ButtonContainer>
          <Column marginRight={15}>
            <StyledButton buttonText="Cancel" type="secondary" onPress={onClose} />
          </Column>
          <Column>
            <StyledButton buttonText="Confirm" onPress={onSubmit} />
          </Column>
        </ButtonContainer>
      </ModalBody>
    </CancelModal>
  );
};

export default OrderCancellationModal;
