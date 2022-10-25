/**
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
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
import {pesonetPolicy, currencyCode, numberFormat, moderateScale} from 'toktokwallet/helper';

const PaymentSummaryDetails = (props: PropsType): React$Node => {
  const {navigation, route} = props;
  const {paymentData} = route.params;
  const {firstField, secondField, amount, emailAddress, billType, totalServiceFee, billItemSettings} = paymentData;
  const totalAmount =
    parseFloat(amount) +
    billItemSettings?.commissionRateDetails?.providerServiceFee +
    billItemSettings?.commissionRateDetails?.systemServiceFee;
  const [logo, setLogo] = useState({height: 0, width: 0});
  const [imageLoading, setImageLoading] = useState(true);
  let firstFieldName = '';
  let secondFieldName = '';

  switch (paymentData.itemCode) {
    case 'SSS':
      firstFieldName = 'Payment Reference Number (PRN)';
      secondFieldName = 'Payor Type';
      break;
    case 'PAG_IBIG':
      firstFieldName = 'Payment Type';
      secondFieldName = 'Account Number';
      break;
    default:
      firstFieldName = billItemSettings.firstFieldName;
      secondFieldName = billItemSettings.secondFieldName;
      break;
  }

  useEffect(() => {
    Image.getSize(billItemSettings.logo, (width, height) => {
      let size = height > width ? height - width : width - height;
      if (size > 10) {
        if (width > moderateScale(80) || height > moderateScale(40)) {
          setLogo({width: 80, height: 50});
        } else {
          setLogo({width, height});
        }
      } else {
        setLogo({width: 50, height: 50});
      }
    });
  }, []);

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
      <PolicyNote
        note1={billItemSettings?.itemDocumentDetails?.paymentPolicy1}
        note2={billItemSettings?.itemDocumentDetails?.paymentPolicy2}
      />
      <ContentContainer>
        <DetailsContainer>
          <Label>{firstFieldName}</Label>
          <Value>{firstField}</Value>
        </DetailsContainer>
        <DetailsContainer>
          <Label>{secondFieldName}</Label>
          <Value>{secondField}</Value>
        </DetailsContainer>
        <DetailsContainer>
          <Label>Email Address</Label>
          <Value>{emailAddress}</Value>
        </DetailsContainer>
      </ContentContainer>
      <Separator />
      <ContentContainer>
        <DetailsContainer isCenter>
          <Label>Payment Method</Label>
          <ProviderLogo />
        </DetailsContainer>
        <DetailsContainer>
          <Label>Payment Amount</Label>
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
        <TermsText onPress={() => navigation.navigate('ToktokBillsTermsAndConditions')}>
          Please review the accuracy of the details provided and read our
          <TncText> Terms and Conditions </TncText>
          before you proceed with your transaction.
        </TermsText>
      </TncContainer>
    </>
  );
};

export default PaymentSummaryDetails;
