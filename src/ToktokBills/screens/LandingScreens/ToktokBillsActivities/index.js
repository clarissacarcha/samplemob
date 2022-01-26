import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Platform} from "react-native";
import { useSelector } from 'react-redux';

//components
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator, Header } from "toktokbills/components";
import { FailedActivities, SuccessActivities } from "./TabScreens";

export const ToktokBillsActivities= ({ navigation }) => {

  const TABS = [
    {
      name: "Success",
      screen: <SuccessActivities navigation={navigation} />
    },
    {
      name: "Failed",
      screen: <FailedActivities navigation={navigation} />
    }
  ]

  return (
    <View style={styles.container}>
      <Header label="Activities" elevation={1.5} />
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


