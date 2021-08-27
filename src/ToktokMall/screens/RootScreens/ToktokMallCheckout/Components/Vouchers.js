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

export const Vouchers = ({ navigation, vouchers, setVouchers, setVoucher}) => {

  const [isValid, setIsValid] = useState(0)
  const [vcode, setvCode] = useState("")

  const [applyVoucher, {error, loading}] = useLazyQuery(GET_APPLY_VOUCHER, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      console.log("Response", response)
      if(response.applyVoucher){
        setIsValid(2)
        setVoucher(response.applyVoucher)
      }else{
        setIsValid(-1)
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
            <View style={{flex: 0.5, height: 2, backgroundColor: '#F7F7FA'}} />  
            <View style={{paddingVertical: 15, paddingHorizontal: 15, flexDirection: 'row'}}>
              <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{height: 50, width: 50, backgroundColor: '#FCC442', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 5}}>
                <Text style={{textAlign: 'center', fontSize: 9, fontWeight: '600', color: "#fff", textTransform: 'uppercase'}}>{data.type}</Text> 
                </View>
              </View>
              <View style={{flex: 10, justifyContent: 'center'}}>
                <Text>{data.label}</Text>
                <Text style={{color: "#9E9E9E", fontSize: 11}}>{data.description}</Text>
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
            <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Voucher</Text>
            {/* <TouchableOpacity onPress = {() => {alert(JSON.stringify(vouchers))}}>
              <CustomIcon.FA5Icon name="chevron-right" size={11} color="#F6841F" />
            </TouchableOpacity> */}
        </TouchableOpacity>
        <View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
        {/* {renderVouchers()} */}
    
        {!loading && isValid == -1 && 
        <View style={{backgroundColor: '#FFFCF4', padding:10}}>
          <Text style={{color: '#F6841F', fontSize: 12, textAlign: 'center'}}>*Invalid voucher code. Please check your voucher code.</Text>
        </View>}
    
        <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
          <View style={{
            flex: 1,
            padding: Platform.OS === 'ios' ? 10 : 0,
            backgroundColor: '#F8F8F8',
            marginTop: 10,
            borderRadius: 5,
            alignItems: 'flex-start',
            flexDirection: 'row'            
          }}>
            <TextInput
              value={vcode}
              style={{marginLeft: 10, flex: 1}}
              placeholder="Input voucher (optional)"
              autoCapitalize="characters"
              onChangeText={(val) => {
                setvCode(val)
                setIsValid(0)
              }}
            />
            <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
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
              onPress={() => {
                if(vcode == "") return 
                applyVoucher({variables: {
                  input: {
                    vcode: vcode
                  }
                }})
              }}
              style={{
                flex: 0, 
                paddingVertical: 15, 
                paddingLeft: 15,
                backgroundColor: 'white',
                alignItems: 'flex-end'
              }}
            >
              <Text style={{color: "#F6841F", textAlign: 'right'}}>Apply</Text>
            </TouchableOpacity>
          </View>          
        </View>
      </View>
        
    </>
  )
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 15, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'  },
  container2: { backgroundColor: 'white', marginTop: 8,  }

})