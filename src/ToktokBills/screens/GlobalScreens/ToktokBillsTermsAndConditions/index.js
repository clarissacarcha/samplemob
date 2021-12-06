import React from "react";
import FIcon5 from "react-native-vector-icons/FontAwesome5";
import {Platform, StyleSheet, View, Text, TouchableOpacity, ScrollView} from "react-native";

// Components
import { HeaderBack, HeaderTitle, Separator } from "toktokbills/components";

// Helpers
import {moderateScale, verticalScale} from "toktokbills/helper/scale";

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from "res/variables";

export const ToktokBillsTermsAndConditions = ({ navigation, route }) => {
 
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"Terms and Conditions"} />,
    headerStyle: { height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80) }
  });

  const { termsAndConditions } = route.params;

  return (
    <View style={styles.container}>
      <View style={[styles.shadow]}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            <Text style={styles.tnc}>{termsAndConditions}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  shadow: {
    margin: 16,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1
  },
  boxContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    textAlign: "center",
    color: "#F6841F",
    fontFamily: FONT.BOLD,
    fontSize: 20,
    paddingVertical: 10,
  },
  contentWrapper: {
    flex: 1,
    margin: 6,
    paddingBottom: verticalScale(10),
  },
  tnc: {
    textAlign: "center",
    fontSize: FONT_SIZE.M
  }
});
