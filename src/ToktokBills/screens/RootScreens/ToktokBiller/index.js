import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';

//COMPONENTS
import {
  HeaderBack,
  HeaderTitle,
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
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {
  GET_BILL_ITEMS,
  GET_SEARCH_BILL_ITEMS,
  GET_SEARCH_ALL_BILL_ITEMS,
  GET_ALL_BILL_ITEMS,
} from 'toktokbills/graphql/model';
// import {usePrompt} from 'src/hooks';
import {useDebounce} from 'toktokwallet/hooks';

//FONTS & COLORS
// import CONSTANTS from 'common/res/constants';
// const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW} = CONSTANTS;

export const ToktokBiller = ({navigation, route}) => {
  const {billType} = route.params;
  // const prompt = usePrompt();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={billType.name} isRightIcon />,
  });

  const [search, setSearch] = useState('');
  const [allFilteredData, setAllFilteredData] = useState('');
  const [allBillItems, setAllBillItems] = useState([]);
  const [allPageInfo, setAllPageInfo] = useState({});
  const [filteredData, setFilteredData] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [
    getBillItemsPaginate,
    {loading: billItemsLoading, error: billItemsError, fetchMore: fetchMoreBillItemsPaginate},
  ] = useLazyQuery(GET_BILL_ITEMS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
    },
    onCompleted: ({getBillItemsPaginate}) => {
      setBillItems(getBillItemsPaginate.edges);
      setPageInfo(getBillItemsPaginate.pageInfo);
      setRefreshing(false);
    },
  });

  const [getAllBillItems, {loading: allBillItemsLoading, error: allBillItemsError, fetchMore: fetchMoreAllBillItems}] =
    useLazyQuery(GET_ALL_BILL_ITEMS, {
      fetchPolicy: 'network-only',
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
      },
      onCompleted: ({getAllBillItems}) => {
        setAllBillItems(getAllBillItems.edges);
        setAllPageInfo(getAllBillItems.pageInfo);
        setRefreshing(false);
      },
    });

  const [getSearchBillItemsPaginate, {error: searchError, fetchMore: fetchMoreSearchBillItemsPaginate}] = useLazyQuery(
    GET_SEARCH_BILL_ITEMS,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
        setSearchLoading(false);
      },
      onCompleted: ({getSearchBillItemsPaginate}) => {
        setFilteredData(getSearchBillItemsPaginate.edges);
        setPageInfo(getSearchBillItemsPaginate.pageInfo);
        setRefreshing(false);
        setSearchLoading(false);
      },
    },
  );

  const [getSearchAllBillItems, {error: searchAllError, fetchMore: fetchMoreAllSearchBillItems}] = useLazyQuery(
    GET_SEARCH_ALL_BILL_ITEMS,
    {
      fetchPolicy: 'network-only',
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
        setSearchLoading(false);
      },
      onCompleted: ({getSearchAllBillItems}) => {
        setAllFilteredData(getSearchAllBillItems.edges);
        setAllPageInfo(getSearchAllBillItems.pageInfo);
        setRefreshing(false);
        setSearchLoading(false);
      },
    },
  );

  useEffect(() => {
    handleGetBillItems();
    setIsMounted(true);
  }, [handleGetBillItems]);

  const handleGetBillItems = useCallback(() => {
    if (billType.name !== 'Billers') {
      return getBillItemsPaginate({
        variables: {
          input: {
            billTypeId: billType.id,
            afterCursorId: null,
            afterCursorName: null,
          },
        },
      });
    } else {
      return getAllBillItems({
        variables: {
          input: {
            afterCursorId: null,
            afterCursorName: null,
          },
        },
      });
    }
  }, [billType, getBillItemsPaginate, getAllBillItems]);

  useEffect(() => {
    if (!search) {
      handleGetBillItems();
    }
  }, [search, handleGetBillItems]);

  const getData = () => {
    if (search) {
      return filteredData.length > 0 ? filteredData : [];
    }
    return billItems;
  };
  // FOR ALL TYPES OF BILLERS
  const getAllData = () => {
    if (search) {
      return allFilteredData.length > 0 ? allFilteredData : [];
    }
    return allBillItems;
  };

  const onRefresh = () => {
    setRefreshing(true);
    search ? processSearch(search) : handleGetBillItems();
  };

  const fetchMoreData = async () => {
    if (pageInfo.hasNextPage) {
      if (search) {
        await fetchMoreSearchBillItemsPaginate({
          variables: {
            input: {
              search,
              afterCursorId: pageInfo.endCursorId,
              afterCursorName: pageInfo.endCursorName,
              billTypeId: billType.id,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            fetchMoreResult.getSearchBillItemsPaginate.edges = [
              ...previousResult.getSearchBillItemsPaginate.edges,
              ...fetchMoreResult.getSearchBillItemsPaginate.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getSearchBillItemsPaginate.pageInfo);
          setFilteredData(data.getSearchBillItemsPaginate.edges);
        });
      } else {
        await fetchMoreBillItemsPaginate({
          variables: {
            input: {
              billTypeId: billType.id,
              afterCursorId: pageInfo.endCursorId,
              afterCursorName: pageInfo.endCursorName,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            fetchMoreResult.getBillItemsPaginate.edges = [
              ...previousResult.getBillItemsPaginate.edges,
              ...fetchMoreResult.getBillItemsPaginate.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setPageInfo(data.getBillItemsPaginate.pageInfo);
          setBillItems(data.getBillItemsPaginate.edges);
        });
      }
    }
  };
  // FOR ALL TYPES OF BILLERS
  const fetchAllMoreData = async () => {
    if (allPageInfo.hasNextPage) {
      if (search) {
        await fetchMoreAllSearchBillItems({
          variables: {
            input: {
              search,
              afterCursorId: allPageInfo.endCursorId,
              afterCursorName: allPageInfo.endCursorName,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            fetchMoreResult.getSearchAllBillItems.edges = [
              ...previousResult.getSearchAllBillItems.edges,
              ...fetchMoreResult.getSearchAllBillItems.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setAllPageInfo(data.getSearchAllBillItems.pageInfo);
          setAllFilteredData(data.getSearchAllBillItems.edges);
        });
      } else {
        await fetchMoreAllBillItems({
          variables: {
            input: {
              afterCursorId: allPageInfo.endCursorId,
              afterCursorName: allPageInfo.endCursorName,
            },
          },
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            fetchMoreResult.getAllBillItems.edges = [
              ...previousResult.getAllBillItems.edges,
              ...fetchMoreResult.getAllBillItems.edges,
            ];
            return fetchMoreResult;
          },
        }).then(({data}) => {
          setAllPageInfo(data.getAllBillItems.pageInfo);
          setAllBillItems(data.getAllBillItems.edges);
        });
      }
    }
  };

  const onSearchChange = value => {
    billType.name !== 'Billers' ? setFilteredData([]) : setAllFilteredData([]);
    setSearchLoading(value.length > 0);
    setSearch(value);
    debounceProcessSearch(value);
  };

  const debounceProcessSearch = useDebounce(value => processSearch(value), 1000);

  const processSearch = value => {
    if (billType.name !== 'Billers') {
      getSearchBillItemsPaginate({
        variables: {
          input: {
            billTypeId: billType.id,
            afterCursorId: null,
            afterCursorName: null,
            search: value,
          },
        },
      });
    } else {
      getSearchAllBillItems({
        variables: {
          input: {
            afterCursorId: null,
            afterCursorName: null,
            search: value,
          },
        },
      });
    }
  };

  const ListFooterComponent = () => {
    return (
      <View style={{marginTop: moderateScale(15)}}>
        <LoadingIndicator
          isLoading={billType.name !== 'Billers' ? pageInfo.hasNextPage : allPageInfo.hasNextPage}
          size="small"
        />
      </View>
    );
  };

  const ListEmptyComponent = () => {
    const emptyImage = search ? empty_search : empty_list;
    const emptyText = search ? 'Try to search something similar.' : 'There is no assigned biller at the moment.';
    const emptyLabel = search ? 'No Results Found' : 'No Biller Found';

    return <EmptyList imageSrc={emptyImage} label={emptyLabel} message={emptyText} />;
  };

  if (billItemsError || searchError || allBillItemsError || searchAllError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong
          onRefetch={onRefresh}
          error={billItemsError ?? searchError ?? allBillItemsError ?? searchAllError}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          {isMounted && (allBillItems.length !== 0 || billItems.length !== 0) && (
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
        {(searchLoading && filteredData.length === 0) ||
        (billItemsLoading && billItems.length === 0 && !refreshing) ||
        (allBillItemsLoading && allBillItems.length === 0 && !refreshing) ? (
          <LoadingIndicator isLoading={true} isFlex />
        ) : (
          <FlatList
            data={billType.name !== 'Billers' ? getData() : getAllData()}
            renderItem={({item, index}) => <Biller item={item} index={index} />}
            contentContainerStyle={getData().length === 0 && getAllData().length === 0 && styles.contentStyle}
            style={styles.billers}
            keyExtractor={(item, index) => index.toString()}
            extraData={billType.name !== 'Billers' ? {filteredData, billItems} : {allFilteredData, allBillItems}}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            onEndReachedThreshold={0.02}
            onEndReached={billType.name !== 'Billers' ? fetchMoreData : fetchAllMoreData}
            ListFooterComponent={ListFooterComponent}
            getItemLayout={(data, index) => ({
              length: data.length,
              offset: data.length * index,
              index,
            })}
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
  billers: {
    flex: 1,
  },
  contentStyle: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(-50),
  },
});
