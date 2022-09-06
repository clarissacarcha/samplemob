/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, ContentWrapper} from './Styled';
import {ScrollView} from 'react-native';
import {CheckIdleState, HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
import {termsAndConditionsDetails} from 'toktokwallet/helper';
import {useNavigation} from '@react-navigation/native';
import {TermsConditionsListCompositions, TermsConditionsSectionCompositions} from 'toktokwallet/compositions';
const ToktokWalletTermsConditions = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Terms and Conditions'} />,
  });
  return (
    <CheckIdleState>
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ContentWrapper>
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.WM_PARAGRAPH_1} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.WM_PARAGRAPH_2} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.WM_PARAGRAPH_3} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.WM_PARAGRAPH_4} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.WM_PARAGRAPH_5} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.DEFINITION_OF_TERMS} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.ACCESS_TO_TOKTOKWALLET} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.OTHER_TERMS} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.OBLIGATIONS_OF_THE_USER} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.SERVICES} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.LIMITS} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.FEES_AND_OTHER_CHARGES} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.TRANSACTION_HISTORY} />
            <TermsConditionsListCompositions
              contents={termsAndConditionsDetails.DISPUTE_AND_UNAUTHORIZED_TRANSACTIONS}
            />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.ACCOUNT_DORMANCY} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.USERS_ACCOUNTABILITY} />
            <TermsConditionsListCompositions
              contents={termsAndConditionsDetails.OBLITAGATIONS_OF_TOKTOKWALLET_CARD_HOLDER}
            />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.PIN} />
            <TermsConditionsListCompositions
              contents={termsAndConditionsDetails.TERMINATION_AND_SUSPENSION_OF_ACCOUNT}
            />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.LIMITATION_OF_LIABILITY} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.CARD_LOSS_REPLACEMENT} />
            <TermsConditionsListCompositions
              contents={termsAndConditionsDetails.DATA_PRIVACY_POLICY_AND_INFORMATION_COLLECTION}
            />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.DATA_SHARING} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.SECURITY} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.PUBLICITY} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.GOVERNING_LAW} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.VENUE} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.NON_WAIVER_OF_RIGHTS} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.SEVERABILITY} />
            <TermsConditionsSectionCompositions contents={termsAndConditionsDetails.AMENDMENT} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.AGREEMENT} />
            <TermsConditionsListCompositions contents={termsAndConditionsDetails.CUSTOMER_CARE} />
          </ContentWrapper>
        </ScrollView>
      </Container>
    </CheckIdleState>
  );
};

export default ToktokWalletTermsConditions;
