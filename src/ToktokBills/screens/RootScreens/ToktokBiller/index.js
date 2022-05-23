import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
  Image,
  TouchableHighlight,
  RefreshControl,
} from 'react-native';

//COMPONENTS
import {
  HeaderBack,
  HeaderTitle,
  Separator,
  SearchInput,
  LoadingIndicator,
  EmptyList,
  SomethingWentWrong,
} from 'toktokbills/components';
import {Biller} from './Components';

//IMAGES
import {empty_search, empty_list} from 'toktokbills/assets/images';

//HELPER
import {moderateScale} from 'toktokbills/helper';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BILL_ITEMS, GET_SEARCH_BILL_ITEMS} from 'toktokbills/graphql/model';
import {usePrompt, useThrottle} from 'src/hooks';
import {useDebounce} from 'toktokwallet/hooks';

//FONTS & COLORS
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;

export const ToktokBiller = ({navigation, route}) => {
  const {billType} = route.params;
  const prompt = usePrompt();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={billType.name} isRightIcon />,
  });

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [getBillItems, {loading: billItemsLoading, error: billItemsError}] = useLazyQuery(GET_BILL_ITEMS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
      setBillItems([]);
    },
    onCompleted: ({getBillItemsPaginate}) => {
      let data = refreshing ? getBillItemsPaginate.edges : [...billItems, ...getBillItemsPaginate.edges];
      setBillItems(data);
      setPageInfo(getBillItemsPaginate.pageInfo);
      setRefreshing(false);
    },
  });

  const [getSearchBillItems, {loading: getSearchLoading, error: searchError}] = useLazyQuery(GET_SEARCH_BILL_ITEMS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
      setSearchLoading(false);
    },
    onCompleted: ({getSearchBillItemsPaginate}) => {
      let data = refreshing ? getSearchBillItemsPaginate.edges : [...filteredData, ...getSearchBillItemsPaginate.edges];

      setFilteredData(data);
      setPageInfo(getSearchBillItemsPaginate.pageInfo);
      setRefreshing(false);
      setSearchLoading(false);
    },
  });

  useEffect(() => {
    setIsMounted(true);
    handleGetBillItems();
  }, []);

  const handleGetBillItems = () => {
    getBillItems({
      variables: {
        input: {
          billTypeId: billType.id,
          afterCursorId: null,
          afterCursorName: null,
        },
      },
    });
  };

  useEffect(() => {
    if (!search) {
      handleGetBillItems();
      setBillItems([]);
    }
  }, [search]);

  const getData = () => {
    if (search) {
      return filteredData.length > 0 ? filteredData : [];
    }
    return billItems;
  };

  const onRefresh = () => {
    setRefreshing(true);
    search ? processSearch(search) : handleGetBillItems();
  };

  const fetchMoreData = () => {
    if (pageInfo.hasNextPage) {
      if (search) {
        getSearchBillItems({
          variables: {
            input: {
              billTypeId: billType.id,
              afterCursorId: pageInfo.endCursorId,
              afterCursorName: pageInfo.endCursorName,
              search,
            },
          },
        });
      } else {
        getBillItems({
          variables: {
            input: {
              billTypeId: billType.id,
              afterCursorId: pageInfo.endCursorId,
              afterCursorName: pageInfo.endCursorName,
            },
          },
        });
      }
    }
  };

  const onSearchChange = value => {
    setFilteredData([]);
    setSearchLoading(value.length > 0);
    setSearch(value);
    debounceProcessSearch(value);
  };

  const debounceProcessSearch = useDebounce(value => processSearch(value), 1000);

  const processSearch = value => {
    getSearchBillItems({
      variables: {
        input: {
          billTypeId: billType.id,
          afterCursorId: null,
          afterCursorName: null,
          search: value,
        },
      },
    });
  };

  const ListFooterComponent = () => {
    return (
      <View style={{marginTop: moderateScale(15)}}>
        <LoadingIndicator isLoading={pageInfo.hasNextPage} size="small" />
      </View>
    );
  };

  const ListEmptyComponent = () => {
    const emptyImage = search ? empty_search : empty_list;
    const emptyText = search
      ? "We can't find any biller matching your search"
      : 'There is no assigned biller at the moment.';
    const emptyLabel = search ? 'No Results Found' : 'No Biller Found';

    return <EmptyList imageSrc={emptyImage} label={emptyLabel} message={emptyText} />;
  };

  if (billItemsError || searchError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={billItemsError ?? searchError} />
      </View>
    );
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          {isMounted && (billItems.length != 0 || billItemsLoading) && (
            <SearchInput
              search={search}
              onChangeText={onSearchChange}
              onClear={() => {
                setSearch('');
              }}
              placeholder="What bill do you have to pay?"
            />
          )}
        </View>
        {(searchLoading && filteredData.length === 0) || (billItemsLoading && billItems.length === 0 && !refreshing) ? (
          <LoadingIndicator isLoading={true} isFlex />
        ) : (
          <FlatList
            data={getData()}
            renderItem={({item, index}) => <Biller item={item} index={index} />}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item, index) => index.toString()}
            extraData={{filteredData, billItems}}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            onEndReachedThreshold={0.2}
            onEndReached={fetchMoreData}
            ListFooterComponent={ListFooterComponent}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    padding: moderateScale(16),
  },
  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(16),
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(-50),
  },
});
