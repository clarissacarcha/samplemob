import React, {useEffect} from "react";
import {View, Text, StyleSheet, Platform} from "react-native";

//components
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator } from "src/ToktokLoad/components";
import { BuyLoad, Favorites } from "./TabScreens";
import { SomethingWentWrong } from "src/components";

//util
import { moderateScale } from "toktokload/helper";

//hooks
import { useAccount } from 'toktokwallet/hooks';

export const ToktokLoadHome = ({ navigation }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} isRightIcon/>,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });
  const { tokwaAccount, getMyAccount, getMyAccountLoading, getMyAccountError } = useAccount(true);

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

  useEffect(()=> {
    onLoad();
  }, []);

  const onLoad = () => {
    getMyAccount();
  }

  if(getMyAccountLoading){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  if(getMyAccountError){
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onLoad} />
      </View>
    )
  }
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


