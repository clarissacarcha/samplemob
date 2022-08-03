import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Platform, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker, } from 'react-native';
import { FONT } from '../../../../../res/variables';
import CustomIcon from '../../../../Components/Icons';
import Spinner from 'react-native-spinkit';

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_APPLY_VOUCHER } from '../../../../../graphql/toktokmall/model';

const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]

export const Vouchers = ({ navigation, items, vouchers, setVouchers, setVoucher}) => {

  const [isValid, setIsValid] = useState(0)
  const [vcode, setvCode] = useState("")

  useEffect(() => {
    console.log(items)
  }, [items])

  const [applyVoucher, {error, loading}] = useLazyQuery(GET_APPLY_VOUCHER, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      console.log("Response", response)
      if(response.applyVoucher){

        //Check store id if exist on item list
        let index = items.findIndex(x => x.store_id == response.applyVoucher.shopid)
        if(index > -1){
          //if exist, voucher is valid
          setIsValid(2)
          setVoucher(response.applyVoucher)
        }else{
          setIsValid(-1)
          setVoucher(null)
        }
        
      }else{
        setIsValid(-1)
        setVoucher(null)
      }
    },
    onError: (err) => {
      console.log(err)
      setIsValid(-1)
    }
  })

  const renderVouchers = () => {
    // if (vouchers.length > 0){
      return vouchers.map((data, i) => {
        return(
          <>
            <View style={styles.divider1} />  
            <View style={styles.voucherContainer}>
              <View style={styles.typeContainer}>
                <View style={styles.typeSubContainer}>
                  <Text style={styles.typeText}>{data.type}</Text> 
                </View>
              </View>
              <View style={styles.labelContainer}>
                <Text>{data.label}</Text>
                <Text style={styles.labelDescriptionText}>{data.description}</Text>
              </View>
              
            </View>
          </>
        )
      })
    // }
  }
    
  return (
    <>
      <View style = {styles.container2}>
        <TouchableOpacity activeOpacity={1} style = {styles.container} onPress = {() => {
          // navigation.navigate("ToktokMallVouchersClaim", {tab: 1, vouchers: vouchers, setVouchers: setVouchers})
        }}>
        {/* <TouchableOpacity style = {styles.container} onPress = {() => {navigation.navigate("ToktokMallMyVouchersClaim", {tab: 1})}}> */}
            <Text style={styles.voucherTitle}>Voucher</Text>
            {/* <TouchableOpacity onPress = {() => {alert(JSON.stringify(vouchers))}}>
              <CustomIcon.FA5Icon name="chevron-right" size={11} color="#F6841F" />
            </TouchableOpacity> */}
        </TouchableOpacity>
        <View style={styles.divider2} />
        {/* {renderVouchers()} */}
    
        {!loading && isValid == -1 && 
        <View style={styles.inValidContainer}>
          <Text style={styles.inValidText}>*Invalid voucher code. Please check your voucher code.</Text>
        </View>}
    
        <View style={styles.inputVoucherContainer}>
          <View style={styles.inputVoucherSubContainer}>
            <TextInput
              value={vcode}
              style={styles.inputVoucher}
              placeholder="Input voucher (optional)"
              autoCapitalize="characters"
              onChangeText={(val) => {
                setvCode(val)
                setIsValid(0)
              }}
            />
            <View style={styles.spinnerContainer}>
              <View style={styles.spinnerSubContainer}>
                {loading && <Spinner 
                  isVisible={loading}
                  // isVisible={true}
                  type={"FadingCircleAlt"}
                  color={"#F6841F"}
                  size={15}
                />}
                {!loading && isValid == 2 && <CustomIcon.FeIcon name="check-circle" size={15} color="#06A44E" />}
                {!loading && isValid == -1 && <CustomIcon.FA5Icon name="times-circle" size={15} color="#F6841F" />}
              </View>              
            </View>
            <TouchableOpacity 
              disabled={vcode == ""}
              onPress={() => {
                if(vcode == "") return 
                applyVoucher({variables: {
                  input: {
                    vcode: vcode
                  }
                }})
              }}
              style={styles.applyButton}
            >
              <Text style={styles.applyText(vcode)}>Apply</Text>
            </TouchableOpacity>
          </View>          
        </View>
      </View>
        
    </>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1, 
    backgroundColor: '#F7F7FA'
  },
  container: {
    padding: 15, 
    backgroundColor: 'white', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  container2: { 
    backgroundColor: 'white', 
    marginTop: 8 
  },
  divider1: {
    flex: 0.5, 
    height: 2, 
    backgroundColor: '#F7F7FA'
  },
  voucherContainer: {
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    flexDirection: 'row'
  },
  typeContainer: {
    flex: 2, 
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
    flex: 10, 
    justifyContent: 'center'
  },
  labelDescriptionText: {
    color: "#9E9E9E", 
    fontSize: 11
  },
  voucherTitle: {
    fontSize: 14, 
    fontFamily: FONT.BOLD
  },
  divider2: { 
    height: 2, 
    backgroundColor: '#F7F7FA' 
  },
  inValidContainer: {
    backgroundColor: '#FFFCF4', 
    padding:10
  },
  inValidText: {
    color: '#F6841F', 
    fontSize: 12, 
    textAlign: 'center'
  },
  inputVoucherContainer: {
    flexDirection: 'row', 
    paddingVertical: 15, 
    paddingHorizontal: 15
  },
  inputVoucherSubContainer: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: '#F8F8F8',
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'flex-start',
    flexDirection: 'row'            
  },
  inputVoucher: {
    marginLeft: 10, 
    flex: 1
  },
  spinnerContainer: {
    flex: 0.2, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  spinnerSubContainer: {
    flex: 1, 
    justifyContent: 'center'
  },
  applyButton: {
    flex: 0, 
    paddingVertical: 15, 
    paddingHorizontal: 15,
    backgroundColor: 'white',
    alignItems: 'flex-end'
  },
  applyText: (vcode) => {
    return {
      color: vcode == "" ? "#9E9E9E" : "#F6841F", 
      textAlign: 'right'
    }
  }
})