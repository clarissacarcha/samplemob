/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {Animated} from 'react-native';
import {Avatar} from 'react-native-elements';
// import {useTheme} from 'styled-components/native';
import {useLazyQuery} from '@apollo/react-hooks';

import type {PropsType} from './types';
import {
  AnimatedList,
  Column,
  Description,
  ItemContainer,
  Pricetext,
  TagContainer,
  PromoTag,
  PromoText,
  ResellerTag,
  Row,
  TitleContainer,
} from './Styled';

import StyledText from 'toktokfood/components/StyledText';

// Queries
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_PRODUCTS_BY_SHOP_CATEGORY} from 'toktokfood/graphql/toktokfood';

const ShopItemList = (props: PropsType): React$Node => {
  const {onGetRef, onMomentumScrollBegin, onMomentumScrollEnd, onScrollEndDrag, route, shopId, scrollY} = props;
  // const theme = useTheme();

  const avatarStyle = {borderRadius: 10};
  const containerStyle = {height: 70, width: 70};
  const textProps = {numberOfLines: 1};

  const [getProductsByShopCategory, {data}] = useLazyQuery(GET_PRODUCTS_BY_SHOP_CATEGORY, {
    variables: {
      input: {
        id: shopId,
        catId: route?.id,
        page: 0,
        // key: searchProduct,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache and network',
    // onCompleted: ({getProductsByShopCategory}) => {
    //   const products = getProductsByShopCategory;
    //   filterProducts(products);
    // },
  });
  // console.log(data);

  useEffect(() => {
    getProductsByShopCategory();
  }, [shopId, route]);

  const renderListHeader = () => (
    <TitleContainer>
      <StyledText fontSize={18} mode="medium">
        {route.title}
      </StyledText>
    </TitleContainer>
  );

  const renderItem = ({item}) => {
    const {filename, itemname, price, promoVoucher, summary} = item;
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

            <ResellerTag>
              <PromoText>Reseller -1.75%</PromoText>
            </ResellerTag>
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

  // if (route.key !== activeRoute.key) {
  //   return null;
  // }

  return (
    <AnimatedList
      data={data?.getProductsByShopCategory || []}
      totalItems={data?.getProductsByShopCategory.length}
      ref={onGetRef}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {contentOffset: {y: scrollY}},
          },
        ],
        {
          listener: event => {},
          useNativeDriver: false,
        },
      )}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}
      // ItemSeparatorComponent={() => <View style={{height: 10}} />}
      ListHeaderComponent={renderListHeader}
    />
  );
};

export default ShopItemList;
