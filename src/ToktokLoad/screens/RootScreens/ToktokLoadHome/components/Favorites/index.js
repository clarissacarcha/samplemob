import React, { useCallback, useContext, useEffect, useState, memo } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import _ from 'lodash';

//UTIL
import { moderateScale } from "toktokload/helper";
import { ErrorUtility } from 'toktokload/util';

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator, EmptyList } from "src/ToktokLoad/components";
import { FavoriteDetails } from "./components";
import { VerifyContext } from "../VerifyContextProvider";
import { SomethingWentWrong } from "toktokload/components";
import { AlertOverlay } from 'src/components';

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { empty_favorite } from 'toktokload/assets/images';

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_CHECK_FAVORITE_LOAD, GET_FAVORITE_LOADS, PATCH_REMOVE_FAVORITE_LOAD } from 'toktokload/graphql/model';
import { usePrompt } from 'src/hooks';

export const Favorites = memo(({ navigation, route }) => {

  const { mobileErrorMessage, mobileNumber, subContainerStyle, setSubContainerStyle } = useContext(VerifyContext);
  const prompt = usePrompt();
  const isFocused = useIsFocused();
  const [checkFavoriteLoadPrompt, setCheckFavoriteLoadPrompt] = useState({ title: "", message: "", show: false });
  const [favorites, setFavorites] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState({});
  
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

  const ListEmptyComponent = () => {
    if(isMounted) return null
    return (
      <EmptyList
        imageSrc={empty_favorite}
        label={"You don’t have favorites yet"}
        message={"Check our products and add them to your favorites!"}
      />
    )
  }

  const processGetFavoriteLoads = useCallback((action) => {
    if(action == 'refresh'){
      setSelectedLoad({});
      setSubContainerStyle({});
    }
    getFavoriteLoads();
  })

  const handleScroll = useCallback((event) => {
    if(event.nativeEvent.contentOffset.y == 0 && subContainerStyle?.index == 0 && Object.keys(selectedLoad).length > 0){
      let index = subContainerStyle?.index;
      setSubContainerStyle({ backgroundColor: "rgba(246,132,31,0.8)", index });
    } else {
      if(subContainerStyle?.backgroundColor != "#fff"){
        let index = subContainerStyle?.index;
        setSubContainerStyle({ backgroundColor: "#fff", index });
      }
    }
  }, [subContainerStyle])

  const onPressOkPrompt = () => {
    patchRemoveFavoriteLoad({ variables: { input: { loadItemId: selectedLoad.loadItemId } } });
  }

  if(error){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={error} />
      </View>
    )
  }
  console.log(!mobileNumber)
  return (
    <View style={styles.container}>
      <AlertOverlay visible={checkLoading || patchFavoriteLoading}/>
      <FlatList
        extraData={{favorites, selectedLoad}}
        data={favorites}
        renderItem={({ item, index }) => (
          <FavoriteDetails
            item={item}
            index={index}
            setSelectedLoad={setSelectedLoad}
            selectedLoad={selectedLoad}
            setSubContainerStyle={setSubContainerStyle}
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
        onScroll={handleScroll}
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
  }
})


