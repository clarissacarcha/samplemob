/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {BackgroundContainer, Container, Description, LogoContainer, LogoLoadingContainer, Logo} from './Styled';
import {LoadingIndicator} from 'toktokwallet/components';

const TransactionHeader = (props: PropsType): React$Node => {
  const {billItemSettings} = props;
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <>
      <BackgroundContainer>
        <Container>
          <LogoContainer>
            {imageLoading && billItemSettings?.logo && (
              <LogoLoadingContainer>
                <LoadingIndicator isLoading={true} size="small" />
              </LogoLoadingContainer>
            )}
            {billItemSettings?.logo && (
              <Logo
                source={{
                  uri: billItemSettings?.logo,
                }}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            )}
          </LogoContainer>
          <Description noLogo={!billItemSettings?.logo}>{billItemSettings?.descriptions}</Description>
        </Container>
      </BackgroundContainer>
    </>
  );
};

export default TransactionHeader;
