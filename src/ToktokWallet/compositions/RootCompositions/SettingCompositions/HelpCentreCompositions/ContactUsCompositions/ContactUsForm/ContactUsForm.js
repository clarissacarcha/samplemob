/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, InputMessage, InputSubject} from './Styled';

const ContactUsForm = (props: PropsType): React$Node => {
  const {subject, message, onChangeSubject, onChangeMessage} = props;
  return (
    <>
      <Container>
        <InputSubject
          label="Subject"
          value={subject.value}
          onChangeText={value => {
            onChangeSubject('value', value);
          }}
          errorMessage={subject.error}
        />
      </Container>
      <Container>
        <InputMessage
          value={message.value}
          onChangeText={value => {
            onChangeMessage('value', value);
          }}
          errorMessage={message.error}
        />
      </Container>
    </>
  );
};

export default ContactUsForm;
