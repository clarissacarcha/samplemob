import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import { COLOR, FONT } from '../../../../../../res/variables';
import { useNavigation } from '@react-navigation/core';
import CustomIcon from '../../../../../Components/Icons';

const testdata = [{
  type: "FREE SHIPPING",
  label: "Free Shipping Voucher",
  description: "Valid until: 5.14.2021"
}, {
  type: "20% OFF",
  label: "20% Off on all items",
  description: "Valid until: 5.25.2021"
}, {
  type: "40% OFF",
  label: "40% Off in Copper Mask Store",
  description: "Valid until: 5.25.2021"
}]


const Item = ({data}) => {
    return (
        <>
          <View style={styles.itemMargin} />  
          <View style={styles.itemContainer}>
            <View style={styles.itemDataContainer}>
              <View style={styles.itemDataSubContainer}>
               <Text style={styles.itemDataText}>{data.type}</Text> 
              </View>
            </View>
            <View style={styles.itemLabelContainer}>
              <Text>{data.label}</Text>
              <Text style={styles.itemDescriptionText}>{data.description}</Text>
            </View>
          </View>
        </>
    )
}

export const Vouchers = () => {

  const navigation = useNavigation();

    return (
        <>
          <View style={styles.voucherMargin1}>
          <View style={styles.voucherContainer}>
            <View style={styles.voucherHeader}>
              <ImageBackground 
                source={require("../../../../../assets/images/voucher-fill.png")} 
                style={styles.voucherHeaderImage} 
                imageStyle={styles.voucherImageStyle}
              >
                <Text style={styles.voucherHeaderText}>Vouchers</Text>
              </ImageBackground>
            </View>
            <View style={styles.voucherMargin2}></View>
            <TouchableOpacity onPress={() => {
              navigation.navigate("ToktokMallVouchersClaim")
            }} style={styles.voucherClaimContainer}>
              <Text style={styles.voucherSeeAllText}>See all </Text>
            </TouchableOpacity>
            <View style={styles.rightContainer}>
              <CustomIcon.EIcon name="chevron-right" color="#F6841F" size={16} />
            </View>
          </View>
        </View>
        <View>
          {testdata && testdata.map((item, i) => <Item key={i} data={item} />)}
        </View>
        <View style={styles.voucherMargin3} />
        <View style={styles.voucherMargin4}></View>
        <View style={styles.voucherMargin5} />
        </>
    )
}

const styles = StyleSheet.create({
  itemMargin: {
    flex: 0.5, 
    height: 2, 
    backgroundColor: '#F7F7FA'
  },
  itemContainer: {
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    flexDirection: 'row'
  },
  itemDataContainer: {
    flex: 2, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemDataSubContainer: {
    height: 50, 
    width: 50, 
    backgroundColor: '#FCC442', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 5, 
    paddingHorizontal: 5
  },
  itemDataText: {
    textAlign: 'center', 
    fontSize: 9, 
    fontWeight: '600', 
    color: "#fff", 
    textTransform: 'uppercase'
  },
  itemLabelContainer: {
    flex: 8, 
    justifyContent: 'center'
  },
  itemDescriptionText: {
    color: "#9E9E9E", 
    fontSize: 11
  },
  voucherMargin1: {
    flex: 1, 
    paddingHorizontal: 15, 
    paddingVertical: 0
  },
  voucherContainer: {
    paddingVertical: 20, 
    flexDirection: 'row'
  },
  voucherHeader: {
    flex: 3
  },
  voucherHeaderImage: {
    width: "100%", 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  voucherImageStyle: {
    resizeMode: 'cover'
  },
  voucherHeaderText: {
    color: "#fff", 
    fontSize: 14
  },
  voucherMargin2: {
    flex: 6
  },
  voucherClaimContainer: {
    flex: 2, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  voucherSeeAllText: {
    fontSize: 12, 
    color: "#F6841F"
  },
  rightContainer: {
    flex: 0, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  voucherMargin3: {
    flex: 0.5, 
    height: 2, 
    backgroundColor: '#F7F7FA'
  },
  voucherMargin4: {
    height: 15
  },
  voucherMargin5: {
    flex: 0.5, 
    height: 8, 
    backgroundColor: '#F7F7FA'
  }
})