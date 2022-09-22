/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import {Container, HeaderContainer, List, SeeAllContainer, SeeAllIcon, SeeAllText, Title} from './Styled';
import BankTransferBankItem from '../BankTransferBankItem';

const BankTransferBankList = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const {billTypes} = props;

  const onPressSeeAll = () => {
    navigation.navigate('ToktokWalletBankTransferBanks');
  };
  const onPressItem = index => {};

  const onThrottledPress = useThrottle(onPressSeeAll, 2000);

  return (
    <Container>
      <HeaderContainer>
        <Title>Select Bank</Title>
        <SeeAllContainer onPress={onThrottledPress}>
          <SeeAllText>See All</SeeAllText>
          <SeeAllIcon />
        </SeeAllContainer>
      </HeaderContainer>
      <List
        data={billTypes}
        renderItem={({item, index}) => <BankTransferBankItem item={item} onPressItem={onPressItem} index={index} />}
        keyExtractor={(val, index) => index.toString()}
      />
    </Container>
  );
};

export default BankTransferBankList;
