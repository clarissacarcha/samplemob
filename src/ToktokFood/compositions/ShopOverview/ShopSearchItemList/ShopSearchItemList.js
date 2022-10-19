/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {Avatar} from 'react-native-elements';
import {useLazyQuery} from '@apollo/react-hooks';
import {useIsFocused} from '@react-navigation/native';

import type {PropsType} from './types';
import {AnimatedList, ContentLoading} from './Styled';

import EmptyList from 'toktokfood/components/EmptyList/EmptyList';
import StyledText from 'toktokfood/components/StyledText';

import {
  Column,
  Description,
  ItemContainer,
  Pricetext,
  TagContainer,
  PromoTag,
  PromoText,
  ResellerTag,
  Row,
} from '../ShopItemList/Styled';

import {empty_search_2} from 'toktokfood/assets/images';

// Queries
import {GET_SEARCH_PRODUCTS_BY_SHOP} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

const ShopSearchItemList = (props: PropsType): React$Node => {
  const isFocused = useIsFocused();
  const {search, shopId} = props;

  // data fetching for product
  const [getSearchProductsByShop, {data}] = useLazyQuery(GET_SEARCH_PRODUCTS_BY_SHOP, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    // onCompleted: ({getSearchProductsByShop}) => {
    //   const products = getSearchProductsByShop;
    //   console.log(products);
    //   // filterProducts(products);
    // },
  });

  useEffect(() => {
    if (isFocused && search) {
      getSearchProductsByShop({
        variables: {
          input: {
            id: shopId,
            key: search,
          },
        },
      });
    }
  }, [isFocused, search]);

  // const renderListHeader = () => (
  //   <TitleContainer>
  //     <StyledText fontSize={18} mode="medium">
  //       {route.title}
  //     </StyledText>
  //   </TitleContainer>
  // );

  // const renderFooter = () => (
  //   <LoaderContainer>
  //     <Loader animating={showMore} />
  //   </LoaderContainer>
  // );

  const renderItem = ({item}) => {
    const {filename, itemname, price, promoVoucher, resellerDiscount, summary} = item;
    const avatarStyle = {borderRadius: 10};
    const containerStyle = {height: 70, width: 70};
    const textProps = {numberOfLines: 1};

    const {discRatetype, referralDiscount} = resellerDiscount;
    const discountText = discRatetype === 'p' ? `${referralDiscount * 100}%` : referralDiscount;

    return (
      <ItemContainer>
        <Avatar
          size="medium"
          source={{
            uri: filename,
          }}
          avatarStyle={avatarStyle}
          containerStyle={containerStyle}
        />

        <Column flex={2}>
          <StyledText mode="semibold" textProps={textProps}>
            {itemname}
          </StyledText>
          <Description>{summary}</Description>

          <TagContainer>
            {promoVoucher && (
              <PromoTag>
                <PromoText>{promoVoucher?.vname}</PromoText>
              </PromoTag>
            )}

            {resellerDiscount?.referralShopRate > 0 && (
              <ResellerTag>
                <PromoText>`Reseller ${discountText}`</PromoText>
              </ResellerTag>
            )}
          </TagContainer>
        </Column>

        <Column>
          <Row>
            <StyledText>from </StyledText>
            <Pricetext>&#8369;{price.toFixed(2)}</Pricetext>
          </Row>
        </Column>
      </ItemContainer>
    );
  };
  return (
    <AnimatedList
      data={data?.getSearchProductsByShop || []}
      renderItem={renderItem}
      ListEmptyComponent={() => {
        if (data) {
          return (
            <EmptyList image={empty_search_2} subtitle="Try to search something similar." title="No Results Found" />
          );
        }
        return <ContentLoading />;
      }}
    />
  );
};

export default ShopSearchItemList;
