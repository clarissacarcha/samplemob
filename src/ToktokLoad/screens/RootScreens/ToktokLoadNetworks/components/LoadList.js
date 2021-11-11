import React, {useState, useContext, useEffect} from "react";
import {View, Text, StyleSheet, FlatList} from "react-native";

//UTILS
import { moderateScale, globeLoads, tmLoads, smartLoads } from "toktokload/helper";

//COMPONENTS
import { LoadDetails } from "./LoadDetails";
import { VerifyContext } from "./VerifyContextProvider";
import { OrangeButton } from "src/ToktokLoad/components";

export const LoadList = ({ network, navigation, mobileNo }) => {
  const { selectedLoad, setSelectedLoad, favorites, setFavorites, loads, setLoads } = useContext(VerifyContext);
  
  useEffect(() => {
    let data = getData(network);
    setLoads(prev => ({ ...prev, [network]: data }));
  }, [])

  const getData = (network) => {
    switch(network){
      case 'Globe':
        return globeLoads;
      case 'TM':
        return tmLoads;
      case 'Smart':
        return smartLoads;
      
      default:
        return []
    }
  }

  const onPressFavorite = (item, index) => {
    let data = [...loads[network]]
    data[index].isFavorite = !item.isFavorite
    setLoads(prev => ({ ...prev, [network]: data  }))
  }

  const onPressNext = () => {
    if(selectedLoad[network]){
      navigation.navigate("ToktokLoadSummary", { loads: selectedLoad[network], mobileNo })
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        extraData={{loads, selectedLoad}}
        data={loads[network]}
        renderItem={({ item, index }) => (
          <LoadDetails
            item={item}
            network={network}
            onPressFavorite={() => onPressFavorite(item, index)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ padding: moderateScale(16) }}>
        <OrangeButton
          disabled={!selectedLoad[network]}
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
