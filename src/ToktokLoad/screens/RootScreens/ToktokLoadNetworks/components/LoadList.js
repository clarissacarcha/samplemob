import React, {useState, useContext, useEffect} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from "react-native";

//UTILS
import { moderateScale, globeLoads, tmLoads, smartLoads } from "toktokload/helper";

//COMPONENTS
import { LoadDetails } from "./LoadDetails";
import { VerifyContext } from "./VerifyContextProvider";
import { OrangeButton, LoadingIndicator } from "src/ToktokLoad/components";
import { SomethingWentWrong } from "src/components";

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_LOAD_ITEMS, POST_FAVORITE_LOAD, PATCH_REMOVE_FAVORITE_LOAD } from 'toktokload/graphql/model';
import { useAlert } from 'src/hooks';
import { onErrorAlert } from 'src/util/ErrorUtility';

export const LoadList = ({ networkId, navigation, mobileNumber }) => {

  const alert = useAlert();
  const { selectedLoad, setSelectedLoad, favorites, setFavorites, loads, setLoads } = useContext(VerifyContext);
  const [refreshing, setRefreshing] = useState(false);
  
  const [getLoadItems, {loading: getLoadItemsLoading, error: getLoadItemsError}] = useLazyQuery(GET_LOAD_ITEMS, {
    fetchPolicy: "network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    
    onCompleted:({ getLoadItems })=> {
      setLoads(prev => ({ ...prev, [networkId]: getLoadItems }));
    }
  });

  const [postFavoriteLoad, {loading: postFavoriteLoading, error: postFavoriteError}] = useMutation(POST_FAVORITE_LOAD, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      onErrorAlert({alert,error});
      processFavoriteLoad();
    },
    onCompleted:({ postFavoriteLoad })=> {
      console.log(postFavoriteLoad, "ADD")
    }
  });

  const [patchRemoveFavoriteLoad, {loading: patchFavoriteLoading, error: patchFavoriteError}] = useMutation(PATCH_REMOVE_FAVORITE_LOAD, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      onErrorAlert({alert,error});
    },
    onCompleted:({ patchRemoveFavoriteLoad })=> {
      console.log(patchRemoveFavoriteLoad, "REMOVE")
    }
  });

  useEffect(() => {
    processGetLoadItems();
  }, [])

  const processGetLoadItems = () => {
    getLoadItems({
      variables: {
        input: {
          networkId,
          mobileNumber
        }
      }
    })
  }

  const onPressFavorite = (item, index) => {
    let data = [...loads[networkId]];
    let favData = {
      loadItemId: item.id,
      mobileNumber
    }

    item.favorite ? processPatchFavoriteLoad(favData) : processPostFavoriteLoad(favData); // ADD OR REMOVE
    data[index].favorite = item.favorite ? null : favData
    setLoads(prev => ({ ...prev, [networkId]: data  }));
  }

  const processPostFavoriteLoad = (favData) => {
    postFavoriteLoad({
      variables: {
        input: favData
      }
    });
  }

  const processPatchFavoriteLoad = (favData) => {
    patchRemoveFavoriteLoad({
      variables: {
        input: favData
      }
    });
  }

  const processFavoriteLoad = () => {

  }

  const onPressNext = () => {
    if(selectedLoad[networkId]){
      navigation.navigate("ToktokLoadSummary", { loads: selectedLoad[networkId], mobileNumber })
    }
  }

  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text>Empty List</Text>
      </View>
    )
  }

  if(getLoadItemsLoading){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(getLoadItemsError){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={processGetLoadItems} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList
        extraData={{loads, selectedLoad}}
        data={loads[networkId]}
        renderItem={({ item, index }) => (
          <LoadDetails
            item={item}
            networkId={networkId}
            onPressFavorite={() => onPressFavorite(item, index)}
            patchFavoriteLoading={patchFavoriteLoading}
            postFavoriteLoading={postFavoriteLoading}
          />
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={processGetLoadItems}
          />
        }
      />
      {(loads[networkId] && loads[networkId].length > 0) && (
        <View style={{ padding: moderateScale(16) }}>
          <OrangeButton
            disabled={!selectedLoad[networkId]}
            label='Next'
            onPress={onPressNext}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
