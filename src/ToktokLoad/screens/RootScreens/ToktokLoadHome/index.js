import React, {useEffect} from "react";
import {View, Text, StyleSheet, Platform} from "react-native";

//components
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator } from "src/ToktokLoad/components";
import { BuyLoad, Favorites } from "./TabScreens";

export const ToktokLoadHome = ({ navigation }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} isRightIcon/>,
  });

  const TABS = [
    {
      name: "Buy Load",
      screen: <BuyLoad navigation={navigation} />
    },
    {
      name: "Favorites",
      screen: <Favorites navigation={navigation} />
    }
  ]

  return (
    <View style={styles.container}>
      <HeaderTabs tabs={TABS} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
})


