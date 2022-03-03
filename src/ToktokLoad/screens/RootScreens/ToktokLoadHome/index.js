import React, {useContext, useEffect, useMemo, useState} from "react";
import {View, Text, StyleSheet, Platform} from "react-native";
import { useSelector } from 'react-redux';
import { blank } from 'toktokload/assets/ads'

//components
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator } from "src/ToktokLoad/components";
import { BuyLoad, Favorites, VerifyContextProvider, VerifyContext, Advertisement } from "./components";

const MainComponent = ({ navigation, route }) => {

  const {activeTab, setActiveTab, mobileNumber, tabList } = useContext(VerifyContext);

  useEffect(() => {
    if(route.params?.tabId){
      setActiveTab(route.params.tabId)
    }
    return () => { setActiveTab(1) }
  }, [route])

  const DisplayComponent = useMemo(() => {
    if(activeTab == 1){
      return <BuyLoad navigation={navigation} /> 
    } else {
      return <Favorites navigation={navigation} />
    }
  })

  const ads = [{ id: 1, image: blank },{ id: 2, image: blank },{ id: 3, image: blank }]

  return (
    <View style={styles.container}>
      <Advertisement autoplay ads={ads}/>
      <HeaderTabs
        tabs={tabList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {DisplayComponent}
    </View>
  );
};

export const ToktokLoadHome = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} />,
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
  }
})


