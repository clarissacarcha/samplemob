/**
 * @format
 * @flow
 */

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import type {PropsType} from './types';
import {Container, HeaderContainer, List, SeeAllContainer, SeeAllIcon, SeeAllText, Title} from './Styled';
import BankTransferFavoriteItems from '../BankTransferFavoriteItems';

const BankTransferFavoriteList = (props: PropsType): React$Node => {
  const {data, onRefreshFavorite, screenLabel} = props;
  const navigation = useNavigation();

  const onPressSeeAll = () => {
    navigation.navigate('ToktokWalletBankTransferFavorites', {screenLabel, onRefreshHomeFavorite: onRefreshFavorite});
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>Favorite Banks</Title>
        {data.length > 3 && (
          <SeeAllContainer onPress={onPressSeeAll}>
            <SeeAllText>See All</SeeAllText>
            <SeeAllIcon />
          </SeeAllContainer>
        )}
      </HeaderContainer>
      <List
        data={data.slice(0, 3)}
        renderItem={({item}) => (
          <BankTransferFavoriteItems item={item} onRefreshFavorite={onRefreshFavorite} screenLabel={screenLabel} />
        )}
      />
    </Container>
  );
};

export default BankTransferFavoriteList;
