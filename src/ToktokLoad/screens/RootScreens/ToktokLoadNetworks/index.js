import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";

//UTIL
import { moderateScale } from "toktokload/helper";

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs} from "src/ToktokLoad/components";
import { LoadList, VerifyContextProvider, VerifyContext } from "./components";

//FONTS & COLORS
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

const MainComponent = ({ navigation, route }) => {
 
  const { selectedLoad, setSelectedLoad, loads, setLoads } = useContext(VerifyContext);
  const [tabs, setTabs]= useState([]);

  useEffect(() => {
    setTabs([
      {
        name: "Globe",
        screen: <LoadList navigation={navigation} network="Globe" />
      },
      {
        name: "TM",
        screen: <LoadList navigation={navigation} network="TM" />
      },
      {
        name: "Smart",
        screen: <LoadList navigation={navigation} network="Smart" />
      }
    ])
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Buy Load For</Text>
        <Text style={styles.mobileNo}>{route.params?.mobileNumber}</Text>
      </View>
      { tabs.length > 0 && <HeaderTabs tabs={tabs} /> }
    </View>
  );
};

export const ToktokLoadNetworks = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} />,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });

  return (
    <VerifyContextProvider>
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
  }
})


