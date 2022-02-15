import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Platform} from "react-native";
import { useSelector } from 'react-redux';

//components
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator } from "src/ToktokLoad/components";
import { BuyLoad, Favorites } from "./TabScreens";

export const ToktokLoadHome = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} isRightIcon/>,
  });

  const { user } = useSelector((state) => state.session);
  const formattedMobile = user?.username.replace("+63", "0");
  const [mobileNumber, setMobileNumber] = useState(formattedMobile);
  const [activeTab, setActiveTab] = useState(1);
  const TABS = [
    { id: 1, name: "Buy Load" },
    { id: 2, name: "Favorites"}
  ];

  useEffect(() => {
    if(route.params?.tabId){
      setActiveTab(route.params.tabId)
    }
    return () => { setActiveTab(1) }
  }, [route])

  const displayComponent = () => {
    if(activeTab == 1){
      return <BuyLoad navigation={navigation} setMobileNumber={setMobileNumber} mobileNumber={mobileNumber} />
    } else {
      return <Favorites navigation={navigation} mobileNumber={mobileNumber} />
    }
  }

  return (
    <View style={styles.container}>
      <HeaderTabs
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {displayComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
})


