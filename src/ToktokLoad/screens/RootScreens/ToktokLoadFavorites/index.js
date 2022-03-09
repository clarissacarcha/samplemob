import React, { useCallback, useContext, useEffect, useState, memo } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import _ from 'lodash';

//UTIL
import { moderateScale } from "toktokload/helper";
import { ErrorUtility } from 'toktokload/util';

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator, EmptyList, SearchInput, ToastModal } from "src/ToktokLoad/components";
import { FavoriteDetails } from "./components";
import { SomethingWentWrong } from "toktokload/components";
import { AlertOverlay } from 'src/components';
import { VerifyContextProvider, VerifyContext } from "./components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { empty_favorite, empty_search } from 'toktokload/assets/images';

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_CHECK_FAVORITE_LOAD, GET_FAVORITE_LOADS, PATCH_REMOVE_FAVORITE_LOAD, POST_FAVORITE_LOAD } from 'toktokload/graphql/model';
import { usePrompt } from 'src/hooks';

const MainComponent = ({navigation,route})=> {

  const { mobileErrorMessage, mobileNumber, loadVariantId, processGetLoadItems } = route.params

  const prompt = usePrompt();
  const isFocused = useIsFocused();
  const {
    selectedLoad,
    setSelectedLoad,
    search,
    setSearch,
    loadFavorite,
    setLoadFavorite,
    hasSearch,
    setHasSearch,
  } = useContext(VerifyContext);
  const [checkFavoriteLoadPrompt, setCheckFavoriteLoadPrompt] = useState({ title: "", message: "", show: false });
  const [favorites, setFavorites] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteModal, setFavoriteModal] = useState({ show: false, message: "" });

  const [getFavoriteLoads, {loading: getFavoritesLoading, error: getFavoritesError}] = useLazyQuery(GET_FAVORITE_LOADS, {
    fetchPolicy: "network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    variables: {
      input: {
        loadVariantId
      }
    },
    onError: () => {
      setFavorites([]);
    },
    onCompleted:({ getFavoriteLoads })=> {
      setLoadFavorite(null);
      setIsMounted(false);
      setFavorites(getFavoriteLoads);
      setHasSearch(false);
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
      processGetLoadItems();
      processGetFavoriteLoads("refresh");
      setFavoriteModal({ show: true, message: "Removed from your Favorites" });
      console.log(patchRemoveFavoriteLoad, "REMOVE");
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
      processGetLoadItems();
      processGetFavoriteLoads("refresh");
      setFavoriteModal({ show: true, message: "Added to your Favorites" });
      console.log(postFavoriteLoad, "ADD");
    }
  });

  useEffect(() => {
    if(isFocused){
      processGetFavoriteLoads();
    }
  }, [isFocused])

  useEffect(() => {
    if(search == "" && hasSearch){
      processGetFavoriteLoads();
    }
  }, [search, hasSearch])

  const onPressNext = () => {
    if(selectedLoad && Object.keys(selectedLoad).length > 0){
      navigation.navigate("ToktokLoadSummary", { loads: selectedLoad, mobileNumber });
      // getCheckFavoriteLoad({ variables: { input: { loadItemId: selectedLoad.loadItemId } } });
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
    
  const processSearch = () => {
    setSelectedLoad({});
    if(search){
      const filteredContacts = favorites.filter((item) => {
        let searchKey = search.toLowerCase();
        
        return item.name.toLowerCase().includes(searchKey) || item.amount.toString().includes(searchKey)
          || item.descriptions.toLowerCase().includes(searchKey) || item.networkDetails.name.toLowerCase().includes(searchKey)
      });
      setHasSearch(true);
      setFavorites(filteredContacts)
    }
  }

  const onPressFavorite = (item, index) => {
    setLoadFavorite(item.id);
    let data = [...favorites];
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


  const ListEmptyComponent = () => {
    if(isMounted) return null

    const imageSrc = hasSearch ? empty_search : empty_favorite;
    const label = hasSearch ? "No Results Found" : "You don’t have favorites yet";
    const message = hasSearch ? "Try to search something similar" : "Check our products and add them to your favorites!";
    return (
      <View style={styles.container}>
        <EmptyList imageSrc={imageSrc} label={label} message={message} />
      </View>
    )
  }
    
  if(getFavoritesError){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={() => processGetFavoriteLoads('refresh')} error={getFavoritesError} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* <AlertOverlay visible={checkLoading || patchFavoriteLoading}/> */}
      <ToastModal visible={favoriteModal.show} setVisible={setFavoriteModal} title={favoriteModal.message} />
      <SearchInput
        search={search}
        onChangeText={(value) => { setSearch(value) }}
        placeholder="Search Favorites"
        containerStyle={{ padding: moderateScale(16) }}
        onSubmitEditing={processSearch}
      />
      <FlatList
        extraData={{favorites, selectedLoad}}
        data={favorites}
        renderItem={({ item, index }) => (
          <FavoriteDetails
            item={item}
            index={index}
            onPressFavorite={() => onPressFavorite(item, index)}
            patchFavoriteLoading={patchFavoriteLoading}
            postFavoriteLoading={postFavoriteLoading}
            loadFavorite={loadFavorite}
            getLoadItemsLoading={getFavoritesLoading}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={getFavoritesLoading && !loadFavorite}
            onRefresh={() => processGetFavoriteLoads('refresh')}
          />
        }
      />
      <View style={{ padding: moderateScale(16) }}>
        <OrangeButton
          disabled={!(selectedLoad && Object.keys(selectedLoad).length > 0) || !mobileNumber || mobileErrorMessage}
          label='Next'
          onPress={onPressNext}
        />
      </View>
    </View>
  );
}
export const ToktokLoadFavorites = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"Favorites"} />,
  });

  return (
    <VerifyContextProvider navigation={navigation}>
      <MainComponent navigation={navigation} route={route} />
    </VerifyContextProvider>
  );
};

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
  