import React from 'react';
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native';
import { HeaderBack, HeaderTitle, HeaderRight, Voucher } from '../../../Components';
import { useNavigation } from '@react-navigation/core';
import { COLOR, FONT, FONT_SIZE } from '../../../../res/variables';
import CustomIcon from '../../../Components/Icons';

const testdata = [{
  type: "FREE SHIPPING",
  label: "Free Shipping Voucher",
  description: "Valid until: 5.14.2021",
  status: 0,
}, {
  type: "FREE SHIPPING",
  label: "Free Shipping Voucher",
  description: "Valid until: 5.14.2021",
  status: 0
}, {
  type: "FREE SHIPPING",
  label: "Free Shipping Voucher",
  description: "Valid until: 5.14.2021",
  status: 1
}]


const onPress = (params, data, navigation) => {
  let sampleArr = []
  sampleArr = params.vouchers
  sampleArr.push(data)
  // let newAddressData =  sampleArr.push(data)
  // alert(JSON.stringify(sampleArr))
  params.setVouchers(sampleArr)
  // alert(JSON.stringify(sampleArr))
  navigation.navigate('ToktokMallCheckout', {vouchers: sampleArr} )
}

const Item = ({data, params, navigation}) => {
  return (
      <>
        <View style={styles.container} />  
        <TouchableOpacity style={styles.button} onPress = {() => { data.status == 1 ? null : onPress(params, data, navigation)  }}>
          <View style={styles.typeContainer}>
            <View style={styles.typeSubContainer}>
             <Text style={styles.typeText}>{data.type}</Text> 
            </View>
          </View>
          <View style={styles.labelContainer}>
            <Text>{data.label}</Text>
            <Text style={styles.descriptionText}>{data.description}</Text>
          </View>
          <View style={styles.claimContainer}>
            <View style={styles.claimSubContainer(data)}>
              <Text style={styles.claimText(data)}>{data.status == 1 ? "Claimed" : "Claim"}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
  )
}


export const ToktokMallVouchersClaim = ({route, navigation}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Vouchers', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  return (
    <View style={styles.voucherContainer}>
      
      <FlatList 
        data={testdata}
        renderItem={({item}) => <Item data={item} params = {route.params} navigation = {navigation} />}
      />
      <View style={styles.margin1} />
      <View style={styles.margin2} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5, 
    height: 2, 
    backgroundColor: '#F7F7FA'
  },
  button: {
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    flexDirection: 'row'
  },
  typeContainer: {
    flex: 3, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  typeSubContainer: {
    height: 50, 
    width: 50, 
    backgroundColor: '#FCC442', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 5, 
    paddingHorizontal: 5
  },
  typeText: {
    textAlign: 'center', 
    fontSize: 9, 
    fontWeight: '600', 
    color: "#fff", 
    textTransform: 'uppercase'
  },
  labelContainer: {
    flex: 9, 
    justifyContent: 'center'
  },
  descriptionText: {
    color: "#9E9E9E", 
    fontSize: 11
  },
  claimContainer: {
    flex: 3, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  claimSubContainer: (data) => {
    return {
      backgroundColor: data.status == 1 ? "#FFFCF4" : '#F6841F', 
      borderRadius: 5, 
      paddingVertical: 2, 
      paddingHorizontal: 10
    }
  },
  claimText: (data) => {
    return {
      fontSize: 12, 
      color: data.status == 1 ? "#F6841F" : "#FFF"
    }
  },
  voucherContainer: {
    flex: 1, 
    backgroundColor: '#fff'
  },
  margin1: {
    height: 2, 
    backgroundColor: '#F7F7FA'
  },
  margin2: {
    height: 15
  }
})