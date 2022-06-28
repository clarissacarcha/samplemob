/**
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
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
  FooterButton,
  FooterText,
} from './Styled';
import StyledText from 'toktokfood/components/StyledText';
import {useTheme} from 'styled-components';
import Divider from 'toktokfood/components/Divider';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

const OrderSummary = (props: PropsType): React$Node => {
  const {state} = props;
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [fullList, setFullList] = useState([]);
  const [limitedList, setLimitedList] = useState([]);

  useEffect(() => {
    if (state?.length > 0) {
      setFullList(state);
      if (state?.length > 5) {
        const limit = state?.slice(0, 5);
        setLimitedList(limit);
      } else {
        setIsCollapsed(true);
      }
    }
  }, [state]);

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

  const renderFooterComponent = () => {
    return (
      fullList.length > 5 && (
        <FooterButton onPress={() => setIsCollapsed(!isCollapsed)}>
          <FooterText>{isCollapsed ? 'Hide' : 'Show more'}</FooterText>
          <FA5Icon name={isCollapsed ? 'chevron-up' : 'chevron-down'} size={13} color={theme.color.orange} />
        </FooterButton>
      )
    );
  };

  const renderOrderListComponent = () => {
    return (
      <VirtualizedScroll>
        <OrderList
          data={isCollapsed ? fullList : limitedList}
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
          ListFooterComponent={renderFooterComponent}
        />
      </VirtualizedScroll>
    );
  };

  return (
    <Container>
      {renderOrderListComponent()}
      <Divider />
    </Container>
  );
};

export default OrderSummary;
