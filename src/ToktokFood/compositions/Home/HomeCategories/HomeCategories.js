/**
 * @format
 * @flow
 */

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'styled-components';
import {useQuery} from '@apollo/react-hooks';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import type {PropsType} from './types';
import {
  Container,
  CategoryList,
  CategoryText,
  CategoryImg,
  CategoryTouchable,
  RightIcon,
  SeeAllContainer,
  TitleContainer,
} from './Styled';

import StyledText from 'toktokfood/components/StyledText';

import {fastfood} from 'toktokfood/assets/images';

// Query Clients
import {GET_CATEGORIES_BY_LIMIT} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

import {getDeviceWidth, scale} from 'toktokfood/helper/scale';

const HomeCategories = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const theme = useTheme();

  // fetch data in categoties
  const {data, loading} = useQuery(GET_CATEGORIES_BY_LIMIT, {
    variables: {
      input: {
        page: 0,
        limit: 4,
        filterSearch: 0,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
  });

  const Loader = () => (
    <SkeletonPlaceholder backgroundColor="rgba(220, 220, 220, 1)">
      <SkeletonPlaceholder.Item paddingVertical={10} flexDirection="row" alignItems="center">
        {[1, 2, 3, 4].map(() => (
          <SkeletonPlaceholder.Item
            width={(getDeviceWidth - scale(60)) / 4 - 1}
            height={80}
            marginRight={10}
            borderRadius={10}
          />
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );

  const renderItem = ({item}) => {
    let image = item.filename ? {uri: item.filename} : fastfood;
    return (
      <CategoryTouchable
      // style={horizontal ? styles.listItemVerticalContainer : {flexDirection: 'row', paddingBottom: 10}}
      // onPress={() => showSearchPage(item)}
      >
        <CategoryImg resizeMode="cover" source={image} />
        <CategoryText>{item.categoryName}</CategoryText>
      </CategoryTouchable>
    );
  };

  const onSeeAll = () => navigation.navigate('ToktokFoodCategoriesScreen');

  return (
    <Container>
      <TitleContainer>
        <StyledText>Categories</StyledText>
        <SeeAllContainer onPress={onSeeAll}>
          <StyledText color={theme.color.orange}>See All</StyledText>
          <RightIcon />
        </SeeAllContainer>
      </TitleContainer>
      {loading ? <Loader /> : <CategoryList data={data?.getCategoriesByLimit || []} renderItem={renderItem} />}
    </Container>
  );
};

export default HomeCategories;
