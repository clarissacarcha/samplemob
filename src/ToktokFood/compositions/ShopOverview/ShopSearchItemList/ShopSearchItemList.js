/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {Avatar} from 'react-native-elements';
import {useLazyQuery} from '@apollo/react-hooks';
import {useIsFocused} from '@react-navigation/native';

import type {PropsType} from './types';
import {AnimatedList, ContentLoading, Title, Separator} from './Styled';

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
  Container,
} from '../ShopItemList/Styled';

import {empty_search_2} from 'toktokfood/assets/images';

// Queries
import {GET_SEARCH_PRODUCTS_BY_SHOP} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {filterAvailableProducts} from 'toktokfood/helper/product';

const ShopSearchItemList = (props: PropsType): React$Node => {
  const isFocused = useIsFocused();
  const {search, shopId, routes = []} = props;
  const [productList, setProductList] = useState([]);

  // data fetching for product
  const [getSearchProductsByShop] = useLazyQuery(GET_SEARCH_PRODUCTS_BY_SHOP, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getSearchProductsByShop}) => {
      setProductList([]);
      const products = getSearchProductsByShop;
      const availableProducts = filterAvailableProducts(products, routes);
      setProductList(availableProducts);
      console.log('availableProducts', availableProducts);
    },
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

  const renderItem = ({item}) => {
    console.log('item', item);
    const {filename, itemname, price, promoVoucher, resellerDiscount, summary} = item;
    const avatarStyle = {borderRadius: 10};
    const containerStyle = {height: 70, width: 70, marginRight: 15};
    const textProps = {numberOfLines: 1};

    const {discRatetype, referralDiscount} = resellerDiscount;
    const discountText = discRatetype === 'p' ? `${referralDiscount * 100}%` : referralDiscount;

    return (
      <ItemContainer>
        <Container>
          <Avatar
            size="medium"
            source={{
              uri: filename,
            }}
            avatarStyle={avatarStyle}
            containerStyle={containerStyle}
          />

          <Row>
            <Column flex={2} marginRight={20}>
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
                    <PromoText>Reseller {discountText}</PromoText>
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
          </Row>
        </Container>
      </ItemContainer>
    );
  };
  return (
    <AnimatedList
      sections={productList}
      renderItem={renderItem}
      renderSectionHeader={({section: {title}}) => <Title>{title}</Title>}
      ListEmptyComponent={() => {
        if (productList.length === 0) {
          return (
            <EmptyList image={empty_search_2} subtitle="Try to search something similar." title="No Results Found" />
          );
        }
        return <ContentLoading />;
      }}
      SectionSeparatorComponent={() => <Separator />}
    />
  );
};

export default ShopSearchItemList;
