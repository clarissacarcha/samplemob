import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, Platform, FlatList, Dimensions, Image, TouchableHighlight, RefreshControl} from "react-native";

//COMPONENTS
import { HeaderBack, HeaderTitle, Separator, SearchInput, LoadingIndicator } from "toktokbills/components";
import { SomethingWentWrong } from "src/components";
import { Biller } from "./Components";

//IMAGES
import { pldt_img, bayan_img } from "toktokbills/assets/images";

//HELPER
import { moderateScale } from "toktokbills/helper";

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from "src/graphql";
import { GET_BILL_ITEMS, GET_SEARCH_BILL_ITEMS } from "toktokbills/graphql/model";
import { usePrompt, useThrottle } from "src/hooks";

export const ToktokBiller = ({navigation, route})=> {
  const { biller } = route.params
  const prompt = usePrompt()

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={biller.name} isRightIcon/>,
    headerStyle: { height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80) }
  });

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [getBillItems, {loading: billItemsLoading, error: billItemsError, refetch: billItemsRefetch}] = useLazyQuery(
    GET_BILL_ITEMS,
    {
      variables: {
        input: {
          billTypeId: biller.id
        }
      },
      fetchPolicy: "cache-and-network",
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
      },
      onCompleted: ({ getBillItems }) => {
        setBillItems(getBillItems);
      }
    }
  );

  const [getSearchBillItems, { loading: searchLoading, error: searchError, refetch: searchRefetch }] = useLazyQuery(
    GET_SEARCH_BILL_ITEMS,
    {
      fetchPolicy: "cache-and-network",
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: () => {
        setRefreshing(false);
      },
      onCompleted: ({ getSearchBillItems }) => {
        setFilteredData(getSearchBillItems);
      }
    }
  )

  useEffect(() => {
    getBillItems();
  }, [])

  useEffect(() => {
    if(search){
      getSearchBillItems({
        variables: {
          input: {
            billTypeId: biller.id,
            searchKey: search
          }
        },
      });
    } else {
      setFilteredData([]);
    }
  }, [search]);

  const getData = () => {
    if(search){
      return filteredData.length > 0 ? filteredData : []
    }
    return billItems
  }
 
  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text>No results found.</Text>
      </View>
    )
  }

  const onRefresh = () => {
    search ? searchRefetch() : billItemsRefetch();
  }

  if(billItemsLoading && billItems.length === 0){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(billItemsError || searchError){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} />
      </View>
    )
  }

  return (
    <>
    <Separator/>
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput search={search} setSearch={setSearch} />
      </View>
      {( searchLoading && filteredData.length === 0) ? (
        <LoadingIndicator isLoading={true} isFlex />
      ) : (
        <FlatList
          data={getData()}
          renderItem={({item,index})=><Biller item={item} index={index}/>}
          contentContainerStyle={styles.listContainer}
          keyExtractor={(item, index) => index.toString()}
          extraData={{filteredData, billItems}}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor:"white",
  },
  searchContainer: {
    padding: moderateScale(16),
  },
  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(16),
    flexGrow: 1
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
