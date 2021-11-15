import React, {useState, useContext, useEffect} from "react";
import {View, Text, StyleSheet, FlatList} from "react-native";

//UTILS
import { moderateScale, globeLoads, tmLoads, smartLoads, favoriteList } from "toktokload/helper";

//COMPONENTS
import { FavoriteDetails } from "../components";
import { VerifyContext } from "./VerifyContextProvider";
import { OrangeButton } from "src/ToktokLoad/components";

export const FavoriteList = ({ network, navigation, mobileNo }) => {
  const { selectedLoad, setSelectedLoad, favorites, setFavorites, loads, setLoads } = useContext(VerifyContext);

  const onPressNext = () => {
    if(selectedLoad && Object.keys(selectedLoad).length > 0){
      navigation.navigate("ToktokLoadSummary", { loads: selectedLoad, mobileNo })
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        extraData={{loads, selectedLoad}}
        data={favoriteList}
        renderItem={({ item, index }) => (
          <FavoriteDetails
            item={item}
            network={network}
            onPressFavorite={() => onPressFavorite(item, index)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ padding: moderateScale(16) }}>
        <OrangeButton
          disabled={!(selectedLoad && Object.keys(selectedLoad).length > 0)}
          label='Next'
          onPress={onPressNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
})
