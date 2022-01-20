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
import { moderateScale, numberFormat, getStatusbarHeight } from "toktokbills/helper";
const {width,height} = Dimensions.get("window");

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, LoadingIndicator, HeaderDownloadReceipt } from "toktokbills/components";
import { SomethingWentWrong } from 'toktokbills/components'
import { Header, ReceiptDetails } from "./components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

const MainComponent = ({ navigation, route, viewRef, onCapturingScreen }) => {
  return (
    <View style={{ paddingTop: onCapturingScreen ? moderateScale(50) : moderateScale(20) }}>
      <Header />
      <ReceiptDetails route={route} />
      { !onCapturingScreen && (
        <View style={styles.buttonContainer}>
          <Text style={styles.emailText}>A copy of this receipt will be delivered on the email provided.</Text>
          <OrangeButton label="OK" onPress={() => navigation.navigate("ToktokBillsHome")} />
        </View>
      )}
    </View>
  );
};

export const ToktokBillsReceipt = ({ navigation, route }) => {

  const [onCapturingScreen, setOnCapturingScreen] = useState(false);
  const viewshotRef = useRef();
  const headerHeight = useHeaderHeight();
  const imageHeight = height - headerHeight - ( Platform.OS == 'ios' ? getStatusbarHeight : 0);
  
  navigation.setOptions({
    headerLeft: () => null,
    headerTitle: () => <HeaderTitle label={"toktokbills Receipt"} />,
    headerRight: () =>
      <HeaderDownloadReceipt
        viewshotRef={viewshotRef}
        refNo={route.params.receipt.referenceNumber}
        onPressDownloadReceipt={(val) => { setOnCapturingScreen(val) }}
      />,
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
      <ScrollView style={styles.container}>
        <ViewShot 
          style={styles.container} 
          ref={viewshotRef}
          options={{ format: "jpg", quality: 0.9, result: 'tmpfile' }}
        >
          <MainComponent navigation={navigation} route={route} onCapturingScreen={onCapturingScreen} />
        </ViewShot>
      </ScrollView>
    </>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    paddingTop: moderateScale(30),
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
  emailText: {
    textAlign: "center",
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(30),
    marginTop: moderateScale(10)
  }
})
