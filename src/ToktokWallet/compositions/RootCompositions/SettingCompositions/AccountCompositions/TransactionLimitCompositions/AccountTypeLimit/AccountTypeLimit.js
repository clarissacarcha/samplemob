/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {
  Container,
  FlexContainer,
  LabelText,
  TitleContainer,
  TitleText,
  TransactionContainer,
  TransactionHeaderContainer,
} from './Styled';
import {Text} from 'react-native';
import {numberFormat} from 'toktokwallet/helper';
import CONSTANTS from 'src/common/res/constants';
const {COLOR} = CONSTANTS;

const TransactionLimit = ({type, incoming, outgoing, index}) => {
  let backgroundColor = '#FFEEC6';

  switch (index) {
    case 0:
      backgroundColor = '#F2F2F2';
      break;
    case 1:
      backgroundColor = '#FDE0C7';
      break;
    case 2:
      backgroundColor = '#FFEEC6';
      break;
    default:
      break;
  }

  return (
    <TransactionContainer backgroundColor={backgroundColor}>
      <FlexContainer>
        <LabelText>{type}</LabelText>
      </FlexContainer>
      <FlexContainer>
        {incoming && incoming > 0 ? <LabelText>₱{numberFormat(incoming)}</LabelText> : <Text>-</Text>}
      </FlexContainer>
      {outgoing ? (
        <FlexContainer>
          {outgoing && outgoing > 0 ? <LabelText>₱{numberFormat(outgoing)}</LabelText> : <Text>-</Text>}
        </FlexContainer>
      ) : (
        <FlexContainer />
      )}
    </TransactionContainer>
  );
};

const AccountTypeLimit = (props: PropsType): React$Node => {
  const {item, index} = props;

  let headerBackgroundColor = COLOR.YELLOW;

  switch (index) {
    case 0:
      headerBackgroundColor = '#CCCCCC';
      break;
    case 1:
      headerBackgroundColor = '#F6841F';
      break;
    case 2:
      headerBackgroundColor = COLOR.YELLOW;
      break;
    default:
      break;
  }

  return (
    <Container>
      <TitleContainer headerBackgroundColor={headerBackgroundColor}>
        <TitleText>{item.title}</TitleText>
      </TitleContainer>
      <TransactionLimit index={index} type="WalletSize" incoming={item.walletSize} />
      <TransactionHeaderContainer>
        <FlexContainer />
        <FlexContainer>
          <LabelText>Incoming</LabelText>
        </FlexContainer>
        <FlexContainer>
          <LabelText>Outgoing</LabelText>
        </FlexContainer>
      </TransactionHeaderContainer>
      <TransactionLimit
        index={index}
        type="Daily"
        incoming={item.incomingValueDailyLimit}
        outgoing={item.outgoingValueDailyLimit}
      />
      <TransactionLimit
        index={index}
        type="Monthly"
        incoming={item.incomingValueMonthlyLimit}
        outgoing={item.outgoingValueMonthlyLimit}
      />
      <TransactionLimit
        index={index}
        type="Annual"
        incoming={item.incomingValueAnnualLimit}
        outgoing={item.outgoingValueAnnualLimit}
      />
    </Container>
  );
};

export default AccountTypeLimit;
