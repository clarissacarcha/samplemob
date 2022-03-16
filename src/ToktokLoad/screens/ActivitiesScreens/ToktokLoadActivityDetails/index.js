import React, { useState } from "react";
import FIcon5 from "react-native-vector-icons/FontAwesome5";
import {Platform, StyleSheet, View, Text, TouchableOpacity, ScrollView, Image} from "react-native";
import moment from "moment";

// Components
import { HeaderBack, HeaderTitle, Separator } from "toktokbills/components";
import {VectorIcon, ICON_SET} from 'src/revamp';

// Helpers
import {moderateScale, verticalScale, numberFormat} from "toktokload/helper";

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from "res/variables";
import { toktokwallet_logo } from "toktokload/assets/images";
import { check_fill_icon } from "toktokload/assets/icons";

const getStatus = (status) => {
  //	1 = successful; 2 = pending; 3 = failed
  switch(status){
    case 1:
      return { text: "Success", color: "#198754", iconName: "checkmark-circle" }
    case 3:
      return { text: "Failed", color: "#ED3A19", iconName: "close-circle" }
    
    default: 
      return { text: "Pending", color: "#FDBA1C", iconName: "remove-circle" }
  }
}

export const ToktokLoadActivityDetails = ({ navigation, route }) => {
 
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"Load Details"} />,
  });

  const [showBreakdown, setShowBreakdown] = useState(false);
  const { amount, convenienceFee, createdAt, destinationNumber, loadDetails, referenceNumber, status, toktokwalletReturnRefNo } = route.params?.activityDetails;
  const transactionDateTime = moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
  const totalAmount = `₱${numberFormat(parseFloat(amount) + parseFloat(convenienceFee))}`;
  const statusData = getStatus(status);

  return (
    <View style={styles.container}>
      <View style={styles.srnContainer}>
        <Text style={styles.srnLabel}>Service Reference Number</Text>
        <Text style={styles.srnValue}>{referenceNumber}</Text>
      </View>
      <View style={styles.loadInfoContainer}>
        <View>
          <Text style={styles.fontSmallBold}>Load Information</Text>
          <Text style={styles.transactionDateTime}>{transactionDateTime}</Text>
          <View style={styles.rowAlignItemsCenter}>
            <VectorIcon size={moderateScale(20)} iconSet={ICON_SET.Ionicon} color={statusData.color} name={statusData.iconName}/>
            <Text style={[styles.statusText, { color: statusData.color }]}>{statusData.text} {toktokwalletReturnRefNo && "- Refunded"}</Text>
          </View>
        </View>
        <Image source={toktokwallet_logo} style={styles.walletLogo} />
      </View>
      <View style={styles.separator} />
      <View style={styles.networkDetails}>
        <View style={styles.networkContainer}>
          <Image source={{ uri: loadDetails?.networkDetails.iconUrl }} style={styles.networkIcon} />
          <View style={{ paddingLeft: moderateScale(10), flexShrink: 1 }}>
            <Text style={styles.network}>{loadDetails?.networkDetails.name}</Text>
            <Text style={styles.mobileNumber}>{destinationNumber}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.mediumBoldOrange}>₱{numberFormat(amount)}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={{ paddingVertical: moderateScale(16) }}>
        { showBreakdown && (
          <View style={{ marginBottom: moderateScale(10) }}>
            <View style={styles.breakdownContainer}>
              <Text>Load Amount</Text>
              <Text>₱{numberFormat(amount)}</Text>
            </View>
            <View style={styles.breakdownContainer}>
              <Text>Service Fee</Text>
              <Text>₱{numberFormat(convenienceFee)}</Text>
            </View>
          </View>
        )}
        <TouchableOpacity onPress={() => { setShowBreakdown(prev => !prev) }}>
          <View style={styles.breakdownContainer}>
            <Text style={styles.mediumBoldOrange}>Total</Text>
            <View style={styles.rowAlignItemsCenter}>
              <Text style={[styles.mediumBoldOrange, { marginRight: moderateScale(5) }]}>{totalAmount}</Text>
              <VectorIcon size={moderateScale(20)} iconSet={ICON_SET.Entypo} color="#F6841F" name={showBreakdown ? "chevron-up" : "chevron-down"}/>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: moderateScale(16)
  },
  statusIcon: {
    width: moderateScale(15),
    height: moderateScale(15),
    tintColor: "#198754"
  },
  statusText: {
    color: "#198754",
    paddingLeft: moderateScale(5)
  },
  separator: {
    backgroundColor: "#F8F8F8",
    height: 2
  },
  mobileNumber: {
    fontSize: FONT_SIZE.S,
    color: "#525252"
  },
  srnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
    padding: moderateScale(16),
    borderRadius: moderateScale(5)
  },
  srnLabel: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M
  },
  srnValue: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: "#FDBA1C"
  },
  loadInfoContainer: {
    paddingVertical: moderateScale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  fontSmallBold: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.S
  },
  transactionDateTime: {
    fontSize: FONT_SIZE.S,
    color: "#525252",
    marginVertical: moderateScale(5)
  },
  rowAlignItemsCenter: {
    flexDirection: "row",
    alignItems: "center"
  },
  walletLogo: {
    width: moderateScale(110),
    height: moderateScale(40),
    resizeMode: "contain"
  },
  networkDetails: {
    paddingVertical: moderateScale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  mediumBoldOrange: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    color: "#F6841F"
  },
  breakdownContainer: {
    marginBottom: moderateScale(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  network: {
    fontSize: FONT_SIZE.M,
  },
  networkIcon: {
    width: moderateScale(40),
    height: moderateScale(20),
    resizeMode: "contain"
  },
  networkContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  }
});
