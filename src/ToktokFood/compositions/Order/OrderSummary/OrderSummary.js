/**
 * @format
 * @flow
 */

import React, {useState, useEffect, useCallback, useRef} from 'react';
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
  HiddenContainer,
  DeleteContainer,
  DeletePaddingContainer,
  DeleteImageContainer,
  DeleteImage,
  EditContainer,
  EditButton,
  NotesText,
} from './Styled';
import StyledText from 'toktokfood/components/StyledText';
import {useTheme} from 'styled-components';
import Divider from 'toktokfood/components/Divider';
import FA5Icon from 'react-native-vector-icons/Entypo';
import {SwipeRow, SwipeListView} from 'react-native-swipe-list-view';
import {TouchableOpacity} from 'react-native';
import {delete_ic} from 'toktokfood/assets/images';
import {DELETE_TEMPORARY_CART_ITEM} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useMutation} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

const arrangeAddons = addons => {
  if (addons.length > 0) {
    let selectedAddons = {};
    addons.map(item => {
      let {id, optionPrice, optionName, optionDetailsName} = item;
      let data = {addon_id: id, addon_name: optionName, addon_price: optionPrice};
      if (selectedAddons[optionDetailsName] != undefined) {
        selectedAddons[optionDetailsName].push(data);
      } else {
        selectedAddons = {...selectedAddons, [optionDetailsName]: [data]};
      }
    });
    return selectedAddons;
  }
};

const OrderSummary = (props: PropsType): React$Node => {
  const {state, placement = 'Cart', cartRefetch = ({}) => {}} = props;
  const {loader, customerInfo} = useSelector(s => s.toktokFood);
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [fullList, setFullList] = useState([]);
  const [limitedList, setLimitedList] = useState([]);
  const [remainingList, setRemainingList] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const swipeRowRef = useRef(null);

  const [deleteCartItem] = useMutation(DELETE_TEMPORARY_CART_ITEM, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onCompleted: ({deleteTemporaryCartItem}) => {
      const {status} = deleteTemporaryCartItem;
      if (status === 200) {
        const index = state?.findIndex(val => val.id === selectedItem.id);
        state?.splice(index, 1);
        cartRefetch({
          variables: {
            input: {
              userId: customerInfo.userId,
            },
          },
        });
        const payload = {...loader, type: 'success', text: 'Item Removed'};
        dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
        setTimeout(() => {
          const isLastItem = state?.length === 0;
          if (isLastItem) {
            dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: []});
            return navigation.goBack();
          }
        }, 3000);
      } else {
        const payload = {...loader, type: 'error', text: 'Failed'};
        dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
      }
    },
    onError: err => console.log('deleteCartItem', JSON.stringify(err)),
  });

  const removeCartItem = useCallback(
    item => {
      setSelectedItem(item);
      const payload = {isVisible: true, text: 'Removing from Cart', type: null};
      dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
      deleteCartItem({
        variables: {
          input: {
            deleteid: item?.id,
          },
        },
      });
    },
    [deleteCartItem, dispatch],
  );

  const onEditItem = item => {
    const {
      productid,
      parentProductId,
      addonsDetails,
      id,
      totalAmount,
      addonsTotalAmount,
      quantity,
      notes,
      orderInstructions,
    } = item;
    dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: []});
    const totalAmountWithAddons = totalAmount + addonsTotalAmount;
    const addons = arrangeAddons(addonsDetails);
    navigation.navigate('ToktokFoodItemDetails', {
      Id: productid,
      parentProductId,
      selectedAddons: addons,
      selectedItemId: id,
      selectedPrice: totalAmountWithAddons,
      selectedQty: quantity,
      selectedNotes: notes,
      action: 'edit',
      hasOrderInstruction: orderInstructions,
      cartRefetch,
    });
  };

  const getItemList = useCallback(() => {
    if (state?.length > 0) {
      const list = state.sort((a, b) => a.id - b.id);
      setFullList(list);
      if (list.length > 5) {
        const limit = list.slice(0, 5);
        setLimitedList(limit);
        const remaining = list.slice(4, -1);
        setRemainingList(remaining);
      } else {
        setIsCollapsed(true);
      }
    }
  }, [state]);

  useEffect(() => {
    getItemList();
  }, [getItemList, state]);

  const isJSON = text => {
    if (typeof text !== 'string') {
      return false;
    }
    try {
      var json = JSON.parse(text);
      return typeof json === 'object';
    } catch (error) {
      return false;
    }
  };

  const renderAddonsComponent = addons => {
    if (isJSON(addons)) {
      const parsedAddons = JSON.parse(addons);
      return parsedAddons.map(item => <AddOnText>{item.addon_name.trim()}</AddOnText>);
    }

    return addons.map(item => <AddOnText>{item.optionName.trim()}</AddOnText>);
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
        <React.Fragment>
          <Divider />
          <FooterButton onPress={() => setIsCollapsed(!isCollapsed)}>
            <FooterText>{isCollapsed ? 'Show Less' : `(${remainingList.length}) Show More`}</FooterText>
            <FA5Icon name={isCollapsed ? 'chevron-thin-up' : 'chevron-thin-down'} size={12} color={theme.color.gray} />
          </FooterButton>
        </React.Fragment>
      )
    );
  };

  const renderDeleteButtonComponent = item => {
    return (
      <DeleteContainer>
        <DeletePaddingContainer />
        <TouchableOpacity activeOpacity={0.9} onPress={() => removeCartItem(item)}>
          <DeleteImageContainer>
            <DeleteImage source={delete_ic} />
          </DeleteImageContainer>
        </TouchableOpacity>
      </DeleteContainer>
    );
  };

  const renderOrderListComponent = () => {
    return (
      <VirtualizedScroll>
        <OrderList
          data={isCollapsed ? fullList : limitedList}
          keyExtractor={item => item.logId}
          renderItem={({item}) => (
            <SwipeRow
              ref={swipeRowRef}
              disableRightSwipe
              disableLeftSwipe={placement === 'OrderDetails'}
              rightOpenValue={-100}
              previewOpenValue={-40}
              forceCloseToLeftThreshold={0}
              closeOnRowPress={true}>
              <HiddenContainer>{renderDeleteButtonComponent(item)}</HiddenContainer>
              <OrderCard key={item.logId}>
                {(item?.productDetails?.filename || item?.productLogo) &&
                  renderOrderImageComponent(
                    item?.productLogo || item?.productDetails?.filename,
                    item?.status,
                    item?.isModified,
                  )}
                <OrderProductDetailsContainer opacity={item?.status === 0 ? 0.5 : 1}>
                  <ProductName>
                    {item?.parentProductId
                      ? item?.parentProductName
                      : item?.productName ?? item?.productDetails?.parentProductName ?? item?.productDetails?.itemname}
                  </ProductName>
                  {(item?.parentProductId || item?.productDetails?.parentProductName) && (
                    <AddOnText fontSize={11}>{item?.productName ?? item?.productDetails?.itemname}</AddOnText>
                  )}
                  {(item?.addonsDetails?.length > 0 || item?.addons?.length > 0) &&
                    renderAddonsComponent(item?.addonsDetails ?? item?.addons)}
                  {item?.notes?.length > 0 && <NotesText>{item?.notes}</NotesText>}
                  {placement === 'Cart' && (
                    <EditButton onPress={() => onEditItem(item)}>
                      <EditContainer>
                        <StyledText color={theme.color.orange} fontSize={11} mode="semibold">
                          Edit
                        </StyledText>
                      </EditContainer>
                    </EditButton>
                  )}
                </OrderProductDetailsContainer>
                <AmountQuantityContainer opacity={item?.status === 0 ? 0.5 : 1}>
                  <ProductName mode="semibold" color={theme.color.orange}>
                    &#x20B1;
                    {parseFloat(
                      item?.basePrice
                        ? item?.basePrice + item?.addonsTotalAmount
                        : item?.totalAmountWithAddons * item?.quantity,
                    ).toFixed(2)}
                  </ProductName>
                  <StyledText>Qty: {item?.quantity}</StyledText>
                </AmountQuantityContainer>
              </OrderCard>
            </SwipeRow>
          )}
          ListFooterComponent={renderFooterComponent}
          ItemSeparatorComponent={() => placement === 'Cart' && <Divider />}
        />
      </VirtualizedScroll>
    );
  };

  return (
    <Container>
      {renderOrderListComponent()}
      {placement === 'OrderDetails' && <Divider />}
    </Container>
  );
};

export default OrderSummary;
