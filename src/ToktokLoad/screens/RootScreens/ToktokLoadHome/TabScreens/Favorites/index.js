import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useIsFocused } from '@react-navigation/native';

//UTIL
import { moderateScale } from "toktokload/helper";

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator, EmptyList } from "src/ToktokLoad/components";
import { FavoriteDetails } from "./components";
import { SomethingWentWrong } from "toktokload/components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { empty_favorite } from 'toktokload/assets/images';

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_FAVORITE_LOADS } from 'toktokload/graphql/model';

export const Favorites = ({ navigation, route, mobileNumber }) => {

  const isFocused = useIsFocused();
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState({});
  
  const {loading, error, refetch} = useQuery(GET_FAVORITE_LOADS, {
    fetchPolicy: "cache-and-network",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setFavorites([]);
    },
    onCompleted:({ getFavoriteLoads })=> {
      setFavorites(getFavoriteLoads)
    }
  })

  useEffect(() => {
    if(isFocused){
      setSelectedLoad({});
      onRefresh();
    }
  }, [isFocused])

  const onPressNext = () => {
    if(selectedLoad && Object.keys(selectedLoad).length > 0){
      navigation.navigate("ToktokLoadSummary", { loads: selectedLoad, mobileNumber })
    }
  }

  const ListEmptyComponent = () => {
    return (
      <EmptyList
        imageSrc={empty_favorite}
        label={"You don’t have favorites yet"}
        message={"Check our products and add them to your favorites!"}
      />
    )
  }

  const onRefresh = () => {
    refetch();
  }

  if(error){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={error} />
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
       <FlatList
        extraData={selectedLoad}
        data={favorites}
        renderItem={({ item, index }) => (
          <FavoriteDetails
            item={item}
            onPressFavorite={() => onPressFavorite(item, index)}
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
            onRefresh={onRefresh}
          />
        }
      />
      {/* {(favorites && favorites.length > 0) && ( */}
        <View style={{ padding: moderateScale(16) }}>
          <OrangeButton
            disabled={!(selectedLoad && Object.keys(selectedLoad).length > 0)}
            label='Next'
            onPress={onPressNext}
          />
        </View>
      {/* )} */}
    </View>
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
  }
})


