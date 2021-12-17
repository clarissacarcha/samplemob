import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Platform} from "react-native";
import { useSelector } from 'react-redux';

//components
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator } from "src/ToktokLoad/components";
import { BuyLoad, Favorites } from "./TabScreens";

export const ToktokLoadHome = ({ navigation }) => {

  const { user } = useSelector((state) => state.session);
  const formattedMobile = user?.username.replace("+63", "0");
  const [mobileNumber, setMobileNumber] = useState(formattedMobile);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} isRightIcon/>,
  });

  const TABS = [
    {
      name: "Buy Load",
      screen: <BuyLoad navigation={navigation} setMobileNumber={setMobileNumber} mobileNumber={mobileNumber} />
    },
    {
      name: "Favorites",
      screen: <Favorites navigation={navigation} mobileNumber={mobileNumber} />
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


