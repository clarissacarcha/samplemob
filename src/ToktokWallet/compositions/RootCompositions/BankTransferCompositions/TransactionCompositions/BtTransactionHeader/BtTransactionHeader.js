/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {BackgroundContainer, Container, Description, LogoContainer, LogoLoadingContainer, Logo} from './Styled';
import {LoadingIndicator} from 'toktokwallet/components';

const BtTransactionHeader = (props: PropsType): React$Node => {
  const {bankDetails} = props;
  const {image, name} = bankDetails;
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <>
      <BackgroundContainer>
        <Container>
          <LogoContainer>
            {imageLoading && image && (
              <LogoLoadingContainer>
                <LoadingIndicator isLoading={true} size="small" />
              </LogoLoadingContainer>
            )}
            {image && (
              <Logo
                source={{
                  uri: image,
                }}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            )}
          </LogoContainer>
          <Description noLogo={!image}>{name}</Description>
        </Container>
      </BackgroundContainer>
    </>
  );
};

export default BtTransactionHeader;
