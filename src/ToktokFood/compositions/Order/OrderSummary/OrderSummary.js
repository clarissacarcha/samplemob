/**
 * @format
 * @flow
 */

import React from 'react';
import type {PropsType} from './types';
import {
  Container,
  OrderList,
  VirtualizedScroll,
  OrderCard,
  OrderImage,
  OrderProductDetailsContainer,
  ProductName,
  AddOnText,
  AmountQuantityContainer,
  ModifiedContainer,
  ModifiedTextContainer,
  // Loader,
} from './Styled';
import StyledText from 'toktokfood/components/StyledText';
import {useTheme} from 'styled-components';
import Divider from 'toktokfood/components/Divider';
const OrderSummary = (props: PropsType): React$Node => {
  const {state} = props;
  // const isLoaded = state && Object.keys(state).length > 0;
  const theme = useTheme();
  const renderAddonsComponent = addons => {
    const parsedAddons = JSON.parse(addons);
    return parsedAddons.map(item => <AddOnText>{item.addon_name}</AddOnText>);
  };

  const renderModifiedComponent = (uri, color, text) => (
    <ModifiedContainer>
      <OrderImage source={{uri}} opacity={text === 'Removed' ? 0.5 : 1} />
      <ModifiedTextContainer backgroundColor={color}>
        <StyledText mode="semibold" fontSize={10} color={theme.color.white}>
          {text}
        </StyledText>
      </ModifiedTextContainer>
    </ModifiedContainer>
  );

  const renderOrderImageComponent = (uri, status, isModified) => {
    if (!status && isModified) {
      return renderModifiedComponent(uri, theme.color.red, 'Removed');
    }
    if (isModified) {
      return renderModifiedComponent(uri, theme.color.orange, 'Edited');
    }
    return <OrderImage source={{uri}} />;
  };

  // function generateRandomWidth(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  // const renderLoaderCardComponent = () => {
  //   return (
  //     <Loader
  //       pWidth={[generateRandomWidth(45, 80), generateRandomWidth(45, 80)]}
  //       tWidth={generateRandomWidth(90, 250)}
  //     />
  //   );
  // };

  const renderComponent = () => {
    // if (isLoaded) {
    return (
      <VirtualizedScroll>
        <OrderList
          data={state}
          keyExtractor={item => item.logId}
          renderItem={({item}) => (
            <OrderCard>
              {item?.productDetails?.filename &&
                renderOrderImageComponent(item?.productDetails?.filename, item?.status, item?.isModified)}
              <OrderProductDetailsContainer opacity={item?.status === 0 ? 0.5 : 1}>
                <ProductName>{item?.productDetails?.parentProductName ?? item?.productDetails?.itemname}</ProductName>
                {item?.productDetails?.parentProductName && (
                  <AddOnText fontSize={11}>Variation: {item?.productDetails?.itemname}</AddOnText>
                )}
                {item?.addons?.length > 0 && renderAddonsComponent(item?.addons)}
                {item?.notes?.length > 0 && (
                  <StyledText color={theme.color.gray} fontSize={11}>
                    {item?.notes}
                  </StyledText>
                )}
              </OrderProductDetailsContainer>
              <AmountQuantityContainer opacity={item?.status === 0 ? 0.5 : 1}>
                <ProductName mode="medium" color={theme.color.orange}>
                  &#x20B1;{parseFloat(item?.srpTotalamount).toFixed(2)}
                </ProductName>
                <StyledText>Qty: {item?.quantity}</StyledText>
              </AmountQuantityContainer>
            </OrderCard>
          )}
        />
      </VirtualizedScroll>
    );
    // }

    // return (
    //   <React.Fragment>
    //     {renderLoaderCardComponent()}
    //     {renderLoaderCardComponent()}
    //     {renderLoaderCardComponent()}
    //   </React.Fragment>
    // );
  };

  return (
    <Container>
      {renderComponent()}
      <Divider />
    </Container>
  );
};

export default OrderSummary;
