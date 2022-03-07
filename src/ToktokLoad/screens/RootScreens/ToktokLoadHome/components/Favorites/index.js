import React, { useCallback, useContext, useEffect, useState, memo } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import _ from 'lodash';

//UTIL
import { moderateScale } from "toktokload/helper";
import { ErrorUtility } from 'toktokload/util';

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator, EmptyList, SearchInput } from "src/ToktokLoad/components";
import { FavoriteDetails } from "./components";
import { VerifyContext } from "../VerifyContextProvider";
import { SomethingWentWrong } from "toktokload/components";
import { AlertOverlay } from 'src/components';

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { empty_favorite, empty_search } from 'toktokload/assets/images';

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_CHECK_FAVORITE_LOAD, GET_FAVORITE_LOADS, PATCH_REMOVE_FAVORITE_LOAD } from 'toktokload/graphql/model';
import { usePrompt } from 'src/hooks';

export const Favorites = memo(({ navigation, route }) => {

  const { mobileErrorMessage, mobileNumber } = useContext(VerifyContext);
  const prompt = usePrompt();
  const isFocused = useIsFocused();
  const [checkFavoriteLoadPrompt, setCheckFavoriteLoadPrompt] = useState({ title: "", message: "", show: false });
  const [favorites, setFavorites] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState({});
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState("");

  const [getFavoriteLoads, {loading, error}] = useLazyQuery(GET_FAVORITE_LOADS, {
    fetchPolicy: "network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setFavorites([]);
    },
    onCompleted:({ getFavoriteLoads })=> {
      setIsMounted(false);
      setFavorites(getFavoriteLoads);
    }
  });

  const [getCheckFavoriteLoad, {loading: checkLoading, error: checkError}] = useLazyQuery(GET_CHECK_FAVORITE_LOAD, {
    fetchPolicy: "cache-and-network",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt
      });
    },
    onCompleted:({ getCheckFavoriteLoad })=> {
      let { title, message } = getCheckFavoriteLoad;
      if(title && message){
        prompt({
          type: "error",
          title: title,
          message: message,
          event: "TOKTOKBILLSLOAD",
          onPress: () => onPressOkPrompt()
        });
      } else {
        navigation.navigate("ToktokLoadSummary", { loads: selectedLoad, mobileNumber });
      }
    }
  });

  const [patchRemoveFavoriteLoad, {loading: patchFavoriteLoading, error: patchFavoriteError}] = useMutation(PATCH_REMOVE_FAVORITE_LOAD, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt
      });
    },
    onCompleted:({ patchRemoveFavoriteLoad })=> {
      const data = _.remove(favorites, function(item) {
        return item.loadItemId == selectedLoad.loadItemId 
      });
      setSelectedLoad({});
      console.log(patchRemoveFavoriteLoad, "REMOVE")
    }
  });

  useEffect(() => {
    if(isFocused){
      processGetFavoriteLoads();
    }
  }, [isFocused])


  const onPressNext = () => {
    if(selectedLoad && Object.keys(selectedLoad).length > 0){
      getCheckFavoriteLoad({ variables: { input: { loadItemId: selectedLoad.loadItemId } } });
    }
  }

  const clearStates = () => {
    setSelectedLoad({});
  }

  const processGetFavoriteLoads = useCallback((action) => {
    if(action == 'refresh'){
      clearStates();
    }
    getFavoriteLoads();
  })

  const onPressOkPrompt = () => {
    patchRemoveFavoriteLoad({ variables: { input: { loadItemId: selectedLoad.loadItemId } } });
  }

  const getData = () => {
    if(search){
      return searchData.length > 0 ? searchData : []
    }
    return favorites
  }

  const onSearch = (value) => {
    setSelectedLoad({});
    setSearch(value);
    if(value){
      const filteredContacts = favorites.filter((item) => {
        let { loadDetails } = item;
        let searchKey = value.toLowerCase();
        
        return loadDetails.name.toLowerCase().includes(searchKey) || loadDetails.amount.toString().includes(searchKey)
          || loadDetails.descriptions.toLowerCase().includes(searchKey) || loadDetails.networkDetails.name.toLowerCase().includes(searchKey)
      });
      setSearchData(filteredContacts)
    } else {
      setSearchData([]);
    }
  }

  const ListEmptyComponent = () => {
    if(isMounted) return null

    const imageSrc = search ? empty_search : empty_favorite;
    const label = search ? "No Results Found" : "You don’t have favorites yet";
    const message = search ? "Try to search something similar" : "Check our products and add them to your favorites!";
    return (
      <View style={styles.container}>
        <EmptyList imageSrc={imageSrc} label={label} message={message} />
      </View>
    )
  }


  if(error){
    return (
      <View style={styles.container}>
        <SomethingWentWrong error={error} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AlertOverlay visible={checkLoading || patchFavoriteLoading}/>
      <SearchInput
        search={search}
        onChangeText={onSearch}
        placeholder="Search Favorites"
        containerStyle={{ padding: moderateScale(16) }}
      />
      <FlatList
        extraData={{favorites, selectedLoad}}
        data={getData()}
        renderItem={({ item, index }) => (
          <FavoriteDetails
            item={item}
            index={index}
            setSelectedLoad={setSelectedLoad}
            selectedLoad={selectedLoad}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => processGetFavoriteLoads('refresh')}
          />
        }
      />
      {/* {(favorites && favorites.length > 0) && ( */}
        <View style={{ padding: moderateScale(16) }}>
          <OrangeButton
            disabled={!(selectedLoad && Object.keys(selectedLoad).length > 0) || !mobileNumber || mobileErrorMessage}
            label='Next'
            onPress={onPressNext}
          />
        </View>
      {/* )} */}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    alignItems: "center",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10)
  },
  headerText: {
    color: "#707070",
    fontSize: FONT_SIZE.M
  },
  mobileNo: {
    fontSize: 20
  },
})


