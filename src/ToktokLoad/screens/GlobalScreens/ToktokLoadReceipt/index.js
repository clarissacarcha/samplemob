import React, {useContext, useEffect, useState, useRef} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  BackHandler
} from "react-native";
import {useLazyQuery} from '@apollo/react-hooks';
import {useSelector} from 'react-redux';
import ViewShot , {captureScreen,releaseCapture} from "react-native-view-shot";
import { useHeaderHeight } from '@react-navigation/stack';

//UTIL
import { moderateScale, numberFormat, getStatusbarHeight } from "toktokload/helper";
const {width,height} = Dimensions.get("window");

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, LoadingIndicator, HeaderDownloadReceipt } from "src/ToktokLoad/components";
import { SomethingWentWrong } from 'src/components'
import { Header, ReceiptDetails } from "./components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

const MainComponent = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Header />
      <ReceiptDetails />
      <View style={styles.buttonContainer}>
        <OrangeButton label="Ok" onPress={() => navigation.navigate("ToktokLoadHome")} />
      </View>
    </View>
  );
};

export const ToktokLoadReceipt = ({ navigation, route }) => {
  const viewshotRef = useRef();
  const headerHeight = useHeaderHeight();
  const imageHeight = height - headerHeight - ( Platform.OS == 'ios' ? getStatusbarHeight : 0);

  navigation.setOptions({
    headerLeft: () => null,
    headerTitle: () => <HeaderTitle label={"toktokload Receipt"} />,
    headerRight: () => <HeaderDownloadReceipt viewshotRef={viewshotRef} refNo={"10292"} />,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ViewShot 
        style={styles.container} 
        ref={viewshotRef}
        options={{ format: "jpg", quality: 0.9, result: 'tmpfile' }}
      >
        <MainComponent navigation={navigation} route={route} />
      </ViewShot>
    </>
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
    color: "#F6841F",
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD
  },
  separator: {
    height: moderateScale(30),
    backgroundColor: "#F7F7FA"
  },
  buttonContainer: {
    justifyContent: "flex-end",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20),
    flex: 1
  },
})
