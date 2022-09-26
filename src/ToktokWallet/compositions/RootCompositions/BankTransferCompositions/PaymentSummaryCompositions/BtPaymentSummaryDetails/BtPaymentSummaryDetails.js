/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {
  BackgroundContainer,
  Container,
  ContentContainer,
  DetailsContainer,
  Description,
  Label,
  LogoContainer,
  LogoLoadingContainer,
  Logo,
  ProviderLogo,
  Value,
  TotalSeparator,
  Total,
  TncContainer,
  TncText,
  TermsText,
} from './Styled';
import {LoadingIndicator, PolicyNote, Separator} from 'toktokwallet/components';
//HELPER
import {pesonetPolicy, currencyCode, numberFormat} from 'toktokwallet/helper';

const BtPaymentSummaryDetails = (props: PropsType): React$Node => {
  const {route, navigation} = props;
  const {bankDetails, accountName, accountNumber, emailAddress, amount, totalServiceFee, purpose, type} =
    route.params.transactionDetails;
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
      {type === 'Pesonet' && <PolicyNote note1={pesonetPolicy} />}
      <ContentContainer>
        <DetailsContainer>
          <Label>Transfer via</Label>
          <ProviderLogo type={type} />
        </DetailsContainer>
        <DetailsContainer>
          <Label>Account Name</Label>
          <Value>{accountName}</Value>
        </DetailsContainer>
        <DetailsContainer>
          <Label>Account Number</Label>
          <Value>{accountNumber}</Value>
        </DetailsContainer>
        <DetailsContainer>
          <Label>Email Address</Label>
          <Value>{emailAddress}</Value>
        </DetailsContainer>
        {purpose !== '' && (
          <DetailsContainer>
            <Label>Purpose</Label>
            <Value>{purpose}</Value>
          </DetailsContainer>
        )}
      </ContentContainer>
      <Separator />
      <ContentContainer>
        <DetailsContainer>
          <Label>Amount</Label>
          <Value>
            {currencyCode}
            {numberFormat(amount)}
          </Value>
        </DetailsContainer>
        <DetailsContainer>
          <Label>Convenience Fee</Label>
          <Value>
            {currencyCode}
            {numberFormat(totalServiceFee)}
          </Value>
        </DetailsContainer>
      </ContentContainer>
      <TotalSeparator />
      <DetailsContainer>
        <Total>Total</Total>
        <Total>
          {currencyCode}
          {numberFormat(totalServiceFee + amount)}
        </Total>
      </DetailsContainer>
      <TotalSeparator />
      <TncContainer>
        <TermsText onPress={() => navigation.navigate('ToktokWalletTermsConditions')}>
          Please review the accuracy of the details provided and read our
          <TncText> Terms and Conditions </TncText>
          before you proceed with your transaction.
        </TermsText>
      </TncContainer>
    </>
  );
};

export default BtPaymentSummaryDetails;
