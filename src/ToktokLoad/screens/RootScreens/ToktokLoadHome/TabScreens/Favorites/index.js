import React, {useContext} from "react";
import {View, Text, StyleSheet} from "react-native";

//util
import { moderateScale } from "toktokload/helper";

export const Favorites = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Favorites</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
})


