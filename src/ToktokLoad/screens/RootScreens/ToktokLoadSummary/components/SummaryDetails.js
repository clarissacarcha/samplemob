import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLazyQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

//UTIL
import { moderateScale, numberFormat } from "toktokload/helper";

//COMPONENTS
import { OrangeButton, HeaderBack, HeaderTitle, HeaderTabs } from "src/ToktokLoad/components";

//FONTS & COLORS & IMAGES
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";
import { wallet_icon } from "src/ToktokLoad/assets/icons";

//GRAPHQL
import {GET_MY_ACCOUNT} from 'toktokwallet/graphql';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';

export const SummaryDetails = ({ amount, mobileNo }) => {

  return (
    <>
      <View style={{ paddingHorizontal: moderateScale(30), marginTop: moderateScale(15) }}>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Mobile Number</Text>
          <Text style={styles.description}>{mobileNo}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Load Amount</Text>
          <Text style={styles.description}>PHP {amount.toFixed(2)}</Text>
        </View>
        <View style={[ styles.bodyContainer, styles.marginBottom15 ]}>
          <Text style={styles.title}>Discount</Text>
          <Text style={styles.description}>PHP 00.00</Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={{ paddingHorizontal: moderateScale(30), paddingVertical: moderateScale(20) }}>
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>Total Amount</Text>
          <Text style={styles.description}>PHP {amount.toFixed(2)}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#F6841F",
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M
  },
  description: {
    color: "#707070",
    fontSize: FONT_SIZE.M,
  },
  bodyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  marginBottom15: {
    marginBottom: moderateScale(15)
  },
  line: {
    height: 1,
    backgroundColor: "#DDDDDD"
  },
})
