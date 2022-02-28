import React, {useState, useContext, useEffect, memo, useCallback, useMemo} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from "react-native";

//UTILS
import { moderateScale, globeLoads, tmLoads, smartLoads } from "toktokload/helper";
import { ErrorUtility } from 'toktokload/util';

//COMPONENTS
import { LoadDetails } from "./LoadDetails";
import { VerifyContext } from "../VerifyContextProvider";
import { EmptyList, OrangeButton, LoadingIndicator, SearchInput } from "src/ToktokLoad/components";
import { SomethingWentWrong } from "toktokload/components";

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_LOAD_ITEMS, GET_SEARCH_LOAD_ITEMS, POST_FAVORITE_LOAD, PATCH_REMOVE_FAVORITE_LOAD } from 'toktokload/graphql/model';
import { usePrompt } from 'src/hooks';
import { stubTrue } from "lodash";

//IMAGES
import { empty_load_item, empty_search } from "toktokload/assets/images";

export const LoadList = memo(({ loadVariantId, navigation, mobileNumber, networkId, processSearch, getSearchLoading }) => {

  const prompt = usePrompt();
  const {
    selectedLoad,
    setSelectedLoad,
    loads,
    setLoads,
    loadFavorite,
    setLoadFavorite,
    search,
    setSearch,
    hasSearch,
    setHasSearch
  } = useContext(VerifyContext);
  const [isMounted, setIsMounted] = useState(true);
  
  const [getLoadItems, {loading: getLoadItemsLoading, error: getLoadItemsError}]  = useLazyQuery(GET_LOAD_ITEMS, {
    fetchPolicy: "cache-and-network",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      setIsMounted(false);
    },
    onCompleted: ({ getLoadItems }) => {
      setLoadFavorite(null);
      setIsMounted(false);
      setLoads(getLoadItems);
    }
  });

  const [postFavoriteLoad, {loading: postFavoriteLoading, error: postFavoriteError}] = useMutation(POST_FAVORITE_LOAD, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: ""
      });
    },
    onCompleted:({ postFavoriteLoad })=> {
      if(search){
        processSearch();
      } else {
        processGetLoadItems();
      }
      console.log(postFavoriteLoad, "ADD")
    }
  });

  const [patchRemoveFavoriteLoad, {loading: patchFavoriteLoading, error: patchFavoriteError}] = useMutation(PATCH_REMOVE_FAVORITE_LOAD, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: ""
      });
    },
    onCompleted:({ patchRemoveFavoriteLoad })=> {
      if(search){
        processSearch();
      } else {
        processGetLoadItems();
      }
      console.log(patchRemoveFavoriteLoad, "REMOVE")
    }
  });

  useEffect(() => {
    if(search == ""){
      clearStates();
      processGetLoadItems();
    }
  }, [loadVariantId])

  useEffect(() => {
    if(search == "" && hasSearch){
      clearStates();
      processGetLoadItems();
    }
  }, [search, hasSearch])

  const clearStates = () => {
    setHasSearch(false);
    setIsMounted(true);
    setLoads([]);
    setSearch("");
    setSelectedLoad({});
  }

  const processGetLoadItems = () => {
    getLoadItems({
      variables: {
        input: {
          loadVariantId
        }
      },
    });
  };

  const onPressFavorite = (item, index) => {
    setLoadFavorite(item.id);
    let data = [...loads];
    let favData = {
      variables: {
        input: {
          loadItemId: item.id,
        }
      }
    }

    // ADD OR REMOVE FAVORITE
    if(item.favorite){
      patchRemoveFavoriteLoad(favData)
    } else {
      postFavoriteLoad(favData)
    }
  }

  const onPressNext = () => {
    if(Object.keys(selectedLoad).length > 0){
      navigation.navigate("ToktokLoadSummary", { loads: selectedLoad, mobileNumber })
    }
  }

  const ListEmptyComponent = useMemo(() => {
    if(isMounted || getLoadItemsLoading) return null

    const imageSrc = search ? empty_search : empty_load_item;
    const label = search ? "No Results Found" : "No Load Item";
    const message = search ? "Try to search something similar" : "No load item available as of the moment.";
    return (
      <View style={styles.emptyContainer}>
        <EmptyList imageSrc={imageSrc} label={label} message={message} />
      </View>
    )
  });

  if((getLoadItemsLoading && !loadFavorite && loads.length == 0) || (getSearchLoading && !loadFavorite)){
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(getLoadItemsError){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={() => processGetLoadItems()} error={getLoadItemsError} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={loads}
        renderItem={({ item, index }) => (
          <LoadDetails
            index={index}
            item={item}
            onPressFavorite={() => onPressFavorite(item, index)}
            patchFavoriteLoading={patchFavoriteLoading}
            postFavoriteLoading={postFavoriteLoading}
            loadFavorite={loadFavorite}
            getLoadItemsLoading={getLoadItemsLoading}
          />
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={(getLoadItemsLoading || getSearchLoading) && !loadFavorite}
            onRefresh={() => {
              setSelectedLoad({});
              search ? processSearch() : processGetLoadItems();
            }}
          />
        }
      />
      {(loads && loads.length > 0) && (
        <View style={{ padding: moderateScale(16) }}>
          <OrangeButton
            disabled={Object.keys(selectedLoad).length == 0}
            label='Next'
            onPress={() => onPressNext()}
          />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  }
})
