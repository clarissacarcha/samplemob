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
  SomethingWentWrong,
  EmptyList,
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

  const [getBillItems, {loading: billItemsLoading, error: billItemsError, refetch: billItemsRefetch}] = useLazyQuery(
    GET_BILL_ITEMS,
    {
      variables: {
        input: {
          billTypeId: billType.id,
        },
      },
      fetchPolicy: 'cache-and-network',
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
        setBillItems([]);
      },
      onCompleted: ({getBillItems}) => {
        console.log(getBillItems);
        setBillItems(getBillItems);
      },
    },
  );

  const [getSearchBillItems, {loading: searchLoading, error: searchError, refetch: searchRefetch}] = useLazyQuery(
    GET_SEARCH_BILL_ITEMS,
    {
      fetchPolicy: 'cache-and-network',
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
      },
      onCompleted: ({getSearchBillItems}) => {
        setTimeout(() => setFilteredData(getSearchBillItems), 0);
      },
    },
  );

  useEffect(() => {
    getBillItems();
  }, []);

  useEffect(() => {
    if (search) {
      getSearchBillItems({
        variables: {
          input: {
            billTypeId: billType.id,
            searchKey: search,
          },
        },
      });
    } else {
      setFilteredData([]);
      getBillItems();
    }
  }, [search]);

  const getData = () => {
    if (search) {
      return filteredData.length > 0 ? filteredData : [];
    }
    return billItems;
  };

  const ListEmptyComponent = () => {
    const emptyImage = search ? empty_search : empty_list;
    const emptyText = search
      ? "We can't find any biller matching your search"
      : 'There is no assigned biller at the moment.';
    const emptyLabel = search ? 'No Results Found' : 'No Biller Found';

    return <EmptyList imageSrc={emptyImage} label={emptyLabel} message={emptyText} />;
  };

  const onRefresh = () => {
    search ? searchRefetch() : billItemsRefetch();
  };

  if (billItemsLoading && billItems.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
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
        {billItems != 0 && search == '' && (
          <View style={styles.searchContainer}>
            <SearchInput search={search} setSearch={setSearch} placeholder="Look for your biller here" />
          </View>
        )}

        {searchLoading && filteredData.length === 0 ? (
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
