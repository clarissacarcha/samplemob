/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {BrokenLine, Container, FooterContainer, FooterText, LineContainer, Logo} from './Styled';
import {ReceiptSeparator} from 'toktokwallet/components';

const ReceiptDetails = (props: PropsType): React$Node => {
  const {children} = props;
  const [footerHeight, setFooterHeight] = useState(80);

  return (
    <>
      <Container>
        {children}
        <ReceiptSeparator bottomHeight={footerHeight} left={-3} right={-3} />
        <LineContainer>
          <BrokenLine />
        </LineContainer>
        <FooterContainer
          onLayout={event => {
            let {height} = event.nativeEvent.layout;
            setFooterHeight(height);
          }}>
          <FooterText>A copy of this receipt will be delivered on the email provided.</FooterText>
          <Logo />
        </FooterContainer>
      </Container>
    </>
  );
};

export default ReceiptDetails;
