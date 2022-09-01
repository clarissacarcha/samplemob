/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container} from './Styled';
import {CheckIdleState, HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import {HelpCentreLayeredSecurity, HelpCentreMoneyProtection} from 'toktokwallet/compositions';

const ToktokWalletHelpCentreSecurityPrivacy = (props: PropsType): React$Node => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Privacy Policy'} />,
  });

  return (
    <CheckIdleState>
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HelpCentreLayeredSecurity />
          <HelpCentreMoneyProtection />
        </ScrollView>
      </Container>
    </CheckIdleState>
  );
};

export default ToktokWalletHelpCentreSecurityPrivacy;
