/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/**
 * @format
 * @flow
 */

import React, {useState, useEffect, useMemo, useRef} from 'react';
import {TouchableOpacity, FlatList} from 'react-native';
import type {PropsType} from './types';
import {
  Container,
  SearchContainer,
  ComponentContainer,
  Row,
  Center,
  Image,
  Title,
  Subtitle,
  XIcon,
  Logo,
  Column,
  Icon,
  MapIcon,
  UnavailableText,
  Separator,
  UnavailableTextContainer,
} from './Styled';
import {useTheme} from 'styled-components';
import Header from 'toktokfood/components/Header';
import SearchBar from 'toktokfood/components/SearchBar';
import StyledText from 'toktokfood/components/StyledText';
import {useDebounce} from 'toktokfood/util/debounce';
import {saveNewShopHistory, getShopHistory, clearShopHistory} from 'toktokfood/helper/persistentHistory';
import {no_history, time, no_result_search} from 'toktokfood/assets/images';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SEARCH_FOOD} from 'toktokfood/graphql/toktokfood';
import ContentLoader from 'react-native-easy-content-loader';

const ToktokFoodHomeSearch = (props: PropsType): React$Node => {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {location} = useSelector(state => state.toktokFood);
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [shopList, setShopList] = useState([]);
  const debounceText = useDebounce(search, 1000);
  const searchBoxRef = useRef(null);

  const [getSearchFood, {loading}] = useLazyQuery(GET_SEARCH_FOOD, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getSearchFood}) => {
      setShopList(getSearchFood);
    },
  });

  const onValueChange = (value: string): void => setSearch(value);
  const onClear = (): void => {
    setShopList([]);
    setSearch('');
  };

  const onRestaurantNavigate = (item, forHistory = true) => {
    if (forHistory) {
      setSearch(item.shopname);
    } else {
      navigation.navigate('ToktokFoodShopOverview', {item});
    }
  };

  const shopAlreadyExist = shopId => {
    return history.some(function (el) {
      return el.id === shopId;
    });
  };

  const updateHistoryList = item => {
    const currentHistory = history;

    if (!shopAlreadyExist(item.id)) {
      if (currentHistory.length === 5) {
        currentHistory.pop();
      }

      currentHistory.unshift(item);
      saveNewShopHistory(currentHistory);
    }

    onRestaurantNavigate(item, false);
  };

  const initSearchHistoryList = async () => {
    const historyList = await getShopHistory();
    setHistory(historyList);
  };

  const removeSelectedHistory = item => {
    const newList = history.filter(h => h.id !== item.id);
    if (newList.length > 0) {
      setHistory(newList);
      saveNewShopHistory(newList);
    } else {
      clearHistoryList();
    }
  };

  const clearHistoryList = async () => {
    await clearShopHistory();
    setHistory([]);
  };

  useEffect(() => {
    if (debounceText.length > 0) {
      getSearchFood({
        variables: {
          input: {
            foodName: debounceText,
            userLatitude: location.latitude,
            userLongitude: location.longitude,
          },
        },
      });
    }
  }, [debounceText, getSearchFood, location]);

  useEffect(() => {
    initSearchHistoryList();
  }, []);

  useEffect(() => {
    if (isFocused) {
      searchBoxRef.current?.focus();
    }
  }, [isFocused]);

  const CenterComponent = () => {
    return (
      <SearchContainer>
        <SearchBar
          ref={searchBoxRef}
          onValueChange={onValueChange}
          color={theme.color.orange}
          hasClose={search.length > 0 || false}
          onClose={onClear}
          value={search}
        />
      </SearchContainer>
    );
  };

  const renderHistoryList = () => {
    if (search.length === 0) {
      if (history.length > 0) {
        return (
          <ComponentContainer>
            <Row marginBottom={10}>
              <StyledText mode="semibold" color={theme.color.orange}>
                Search History
              </StyledText>
              <TouchableOpacity activeOpacity={0.9} onPress={() => clearHistoryList()}>
                <StyledText color={theme.color.orange}>Clear All</StyledText>
              </TouchableOpacity>
            </Row>
            {history.map(list => {
              return (
                <React.Fragment>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => onRestaurantNavigate(list, true)}>
                    <Row marginVertical={15}>
                      <StyledText>{list.shopname}</StyledText>
                      <XIcon onPress={() => removeSelectedHistory(list)} />
                    </Row>
                  </TouchableOpacity>
                  <Separator />
                </React.Fragment>
              );
            })}
          </ComponentContainer>
        );
      }

      return (
        <Center>
          <Image source={no_history} />
          <Title>No History</Title>
          <Subtitle>Try searching what you like and{'\n'}your search history will appear here.</Subtitle>
        </Center>
      );
    }
    return null;
  };

  const EmptyListComponent = useMemo(
    () => () =>
      (
        <Container>
          <Center>
            <Image source={no_result_search} />
            <Title>No Results Found</Title>
            <Subtitle>Try to search something similar.</Subtitle>
          </Center>
        </Container>
      ),
    [],
  );

  const renderShopList = () => {
    if (search.length > 0) {
      if (loading) {
        return (
          <ComponentContainer>
            {[1, 2, 3, 4].map(item => {
              return (
                <React.Fragment>
                  <ContentLoader
                    avatar
                    aShape="square"
                    aSize={70}
                    active
                    title={false}
                    pRows={3}
                    pWidth={[120, '100%', 50]}
                  />
                  <Column marginVertical={20}>
                    <Separator />
                  </Column>
                </React.Fragment>
              );
            })}
          </ComponentContainer>
        );
      }

      return (
        <FlatList
          data={shopList}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity activeOpacity={0.9} onPress={() => updateHistoryList(item)}>
              <ComponentContainer>
                <Row alignItems="flex-start" justifyContent="flex-start">
                  <Logo source={{uri: item.logo}} />
                  <Column>
                    <StyledText mode="semibold">{item.shopname}</StyledText>
                    <Row justifyContent="flex-start" marginTop={8}>
                      <Icon source={time} />
                      <StyledText fontSize={11} color={theme.color.darkgray}>
                        {item.estimatedDeliveryTime} mins
                      </StyledText>
                      <MapIcon />
                      <StyledText fontSize={11} color={theme.color.darkgray}>
                        {item.estimatedDistance} km
                      </StyledText>
                    </Row>
                    <Row>
                      {(!item.hasOpen || !item.hasProduct) && (
                        <UnavailableTextContainer>
                          <UnavailableText>
                            {!item.hasProduct ? 'Currently Unavailable' : 'Currently Closed'}
                          </UnavailableText>
                        </UnavailableTextContainer>
                      )}
                    </Row>
                  </Column>
                </Row>
              </ComponentContainer>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <Separator />}
          ListEmptyComponent={<EmptyListComponent />}
          contentContainerStyle={{flexGrow: 1}}
        />
      );
    }
    return null;
  };

  return (
    <Container>
      <Header hasBack CenterComponent={CenterComponent} centerContainerStyle={{flex: 15}} />
      {renderHistoryList()}
      {renderShopList()}
    </Container>
  );
};

export default ToktokFoodHomeSearch;
