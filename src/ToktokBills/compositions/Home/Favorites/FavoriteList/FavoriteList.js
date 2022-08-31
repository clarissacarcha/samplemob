/**
 * @format
 * @flow
 */

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import type {PropsType} from './types';
import {Container, HeaderContainer, List, SeeAllContainer, SeeAllIcon, SeeAllText, Title} from './Styled';
import FavoriteItems from '../FavoriteItems';

const FavoriteList = (props: PropsType): React$Node => {
  const {favoriteBills} = props;
  const navigation = useNavigation();

  const onPressSeeAll = () => {
    navigation.navigate('ToktokBillsFavorites');
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>Favorite Billers</Title>
        {favoriteBills.length > 3 && (
          <SeeAllContainer onPress={onPressSeeAll}>
            <SeeAllText>See All</SeeAllText>
            <SeeAllIcon />
          </SeeAllContainer>
        )}
      </HeaderContainer>
      <List data={favoriteBills.slice(0, 3)} renderItem={({item}) => <FavoriteItems item={item} />} />
    </Container>
  );
};

export default FavoriteList;
