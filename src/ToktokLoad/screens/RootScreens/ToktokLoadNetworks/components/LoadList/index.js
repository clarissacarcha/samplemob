import React, {useState, useContext, useEffect} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from "react-native";

//UTILS
import { moderateScale, globeLoads, tmLoads, smartLoads } from "toktokload/helper";

//COMPONENTS
import { LoadDetails } from "../LoadDetails";
import { VerifyContext } from "../VerifyContextProvider";
import { OrangeButton, LoadingIndicator } from "src/ToktokLoad/components";
import { SomethingWentWrong } from "src/components";

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_LOAD_ITEMS, POST_FAVORITE_LOAD, PATCH_REMOVE_FAVORITE_LOAD } from 'toktokload/graphql/model';
import { useAlert } from 'src/hooks';
import { onErrorAlert } from 'src/util/ErrorUtility';

export const LoadList = ({ networkId, navigation, mobileNumber }) => {

  const alert = useAlert();
  const { selectedLoad, setSelectedLoad, favorites, setFavorites, loads, setLoads } = useContext(VerifyContext);
  const [loadFavorite, setLoadFavorite] = useState(null);
  
  const {loading: getLoadItemsLoading, error: getLoadItemsError, refetch} = useQuery(GET_LOAD_ITEMS, {
    fetchPolicy: "cache-and-network",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    variables: {
      input: {
        networkId
      }
    },
    onCompleted: ({ getLoadItems }) => {
      setLoads(prev => ({ ...prev, [networkId]: getLoadItems }));
    }
  });

  const [postFavoriteLoad, {loading: postFavoriteLoading, error: postFavoriteError}] = useMutation(POST_FAVORITE_LOAD, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: (error) => {
      onErrorAlert({alert,error});
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

  const processGetLoadItems = () => {
    refetch();
  }

  const onPressFavorite = (item, index) => {
    setLoadFavorite(item.id);
    let data = [...loads[networkId]];
    let favData = {
      variables: {
        input: {
          loadItemId: item.id,
        }
      }
    }

    // ADD OR REMOVE FAVORITE
    if(item.favorite){
      patchRemoveFavoriteLoad(favData).then((res) => {
        if(res !== undefined){
          data[index].favorite = null
          setLoads(prev => ({ ...prev, [networkId]: data  }));
        }
      });
    } else {
      postFavoriteLoad(favData).then((res) => {
        if(res !== undefined){
          data[index].favorite = favData
          setLoads(prev => ({ ...prev, [networkId]: data  }));
        }
      });
    }
  }

  const onPressNext = () => {
    if(selectedLoad[networkId]){
      navigation.navigate("ToktokLoadSummary", { loads: selectedLoad[networkId], mobileNumber })
    }
  }

  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        {!getLoadItemsLoading && (
          <Text>No load item available</Text>
        )}
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
        data={loads ? loads[networkId] : []}
        renderItem={({ item, index }) => (
          <LoadDetails
            item={item}
            networkId={networkId}
            onPressFavorite={() => onPressFavorite(item, index)}
            patchFavoriteLoading={patchFavoriteLoading}
            postFavoriteLoading={postFavoriteLoading}
            loadFavorite={loadFavorite}
          />
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={getLoadItemsLoading}
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
    alignItems: "center",
    backgroundColor: "white"
  }
})
