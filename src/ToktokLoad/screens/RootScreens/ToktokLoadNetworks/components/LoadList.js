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
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_LOAD_ITEMS, GET_NETWORKS } from 'toktokload/graphql/model'

export const LoadList = ({ networkId, navigation, mobileNumber }) => {
  const { selectedLoad, setSelectedLoad, favorites, setFavorites, loads, setLoads } = useContext(VerifyContext);
  const [refreshing, setRefreshing] = useState(false);
  
  const [getLoadItems, {loading, error}] = useLazyQuery(GET_LOAD_ITEMS, {
    fetchPolicy: "network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    
    onCompleted:({ getLoadItems })=> {
      setLoads(prev => ({ ...prev, [networkId]: getLoadItems }));
    }
  })

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
    let data = [...loads[networkId]]
    data[index].isFavorite = !item.isFavorite
    setLoads(prev => ({ ...prev, [networkId]: data  }))
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

  if(loading){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(error){
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
