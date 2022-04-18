import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

//HOOKS & HELPER
import { useThrottle } from 'src/hooks';
import { moderateScale, numberFormat, currencyCode } from 'toktokbills/helper';

//COMPONENTS
import { TransactionModal } from 'toktokbills/components';

// FONTS & IMAGE
import { failed_ic } from 'toktokbills/assets/icons';
import CONSTANTS from 'common/res/constants';
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW} = CONSTANTS;

const {width,height} = Dimensions.get("window");

export const Details = ({ item, visible, setVisible })=> {

  const totalAmount = `${currencyCode} ${numberFormat(parseFloat(item.amount) + parseFloat(item.convenienceFee))}`;

  return (
    <TransactionModal visible={visible} setVisible={setVisible}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.labelText}>Status: </Text>
          <Image source={failed_ic} style={styles.icon} />
          <Text style={styles.failedText}> Failed</Text>
        </View>
        <Text style={styles.labelText}>Biller: {item.billerDetails.descriptions}</Text>
        <Text style={styles.labelText}>{item.billerDetails.firstFieldName}: {item.destinationNumber}</Text>
        <Text style={styles.labelText}>{item.billerDetails.secondFieldName}: {item.destinationIdentifier}</Text>
        <Text style={styles.labelText}>Amount: {totalAmount}</Text>
        <Text style={styles.labelText}>Amount Paid: {totalAmount}</Text>
        <Text style={styles.labelText}>Reference No.: {item.referenceNumber}</Text>
        <Text style={styles.labelText}>Date and Time: {moment(item.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A')}</Text>
      </View>
    </TransactionModal>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    borderBottomColor: "#F6841F",
    borderBottomWidth: 0.5,
    paddingHorizontal: moderateScale(15)
  },
  item: {
    // alignItems: "center",
    margin: 5,
    borderRadius: 5,
    padding: moderateScale(10)
  },
  itemLogo: {
    height: moderateScale(50),
    width: moderateScale(50)
  },
  itemName: {
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
    color: "#F6841F"
  },
  dateTime: {
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
    color: "#929191"
  },
  amount: {
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
    color: "#F6841F"
  },
  name: {
    fontSize: moderateScale(FONT_SIZE.M),
    marginTop: moderateScale(5),
  },
  icon: {
    width: moderateScale(15),
    height: moderateScale(15),
    resizeMode: "contain"
  },
  failedText: {
    color: "#ED3A19",
    fontSize: FONT_SIZE.M
  },
  labelText :{
    fontSize: FONT_SIZE.M
  }
})