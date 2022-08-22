import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Picker,
  Platform
} from 'react-native';
import {Price, FormatToText} from '../../../../helpers/formats';
// import { COLOR, FONT } from '../../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'
import Entypo from 'react-native-vector-icons/dist/Entypo';
import {useNavigation} from '@react-navigation/core';
import {FONT} from '../../../../../res/variables';
import { useDispatch, useSelector } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import AIcons from 'react-native-vector-icons/dist/AntDesign';

const walletIcon = require('../../../../assets/icons/wallet1.png')

const testData = [
  {
    id: 1,
    full_name: 'Cloud Panda',
    contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City',
    default: 1,
  },
  {
    id: 2,
    full_name: 'Rick Sanchez',
    contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City',
    default: 0,
  },
];

const RenderToktokWalletStatus = ({status}) => {

  const navigation = useNavigation()

    return (
      <>
        <View style={styles.container}>
          <Text style={styles.paymentMethodText}>Payment Method</Text>
          <View style={styles.margin1} />
          <View style={styles.sorryContainer}>
            {status == null && 
            <Text style={styles.sorryText}>
              Sorry! It seems that you don`t have a toktokwallet account yet. Please submit verification requirements to
              proceed placing an order. Once you get approved, you will be able to enjoy full benefits of shopping from
              your favorite shops online using toktokmall.
            </Text>}
            {status == 0 && 
            <Text style={styles.sorryText}>
              Sorry! It seems that you don’t have a toktokwallet account yet. Please submit verification requirements to proceed placing an order. 
              Once you get approved, you will be able to enjoy full benefits of shopping  from your favorite shops online using toktokmall.
            </Text>}
            {status == 2 && 
            <Text style={styles.sorryText}>
              Sorry! It seems that you have a pending toktokwallet account. Please patiently wait to be verified to proceed placing an order. 
              Once you get approved, you will be able to enjoy full benefits of shopping  from your favorite shops online using toktokmall.
            </Text>}
          </View>
          <View style={styles.margin2} />
          <View style={styles.gotoButtonContainer}>
            <TouchableOpacity onPress={() => {
              navigation.push('ToktokWalletLoginPage');
            }}>
              <Text style={styles.gotoButtonText}>{status == 2 ? "Go to toktokwallet" : "Create my toktokwallet account"}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.item, styles.tokwalletCotainer]}>
            <View style={styles.tokwalletInfoContainer}>
              <Image
                source={walletIcon}
                style={styles.walletIcon1}
              />
              <View>
                <Text style={styles.tokwalletInfoTitle1()}>totok
                <Text style={styles.tokwalletInfoTitle2()}>wallet</Text></Text>                                           
                {status == 0 && <Text style={styles.declinedText}>Declined</Text>}
                {status == 2 && <Text style={styles.pendingText}>Pending</Text>}
              </View>
            </View>
            <View
              style={styles.balanceContainer(status)}>
              <Text style={styles.balanceText1}>
              (Balance {FormatToText.currency(0)})
              </Text>          
            </View>
          </View>
          
        </View>
      </>
    )

}

export const Payment = ({list, payment, total, setPaymentMethod, currentBalance, setCurrenctBalance, status}) => {
  const navigation = useNavigation();
  const toktokMall = useSelector(state=> state.toktokMall)
  const dispatch = useDispatch()
  // const [currentBalance, setCurrenctBalance] = useState(0)
  console.log("status ssss", status)

  if(status != 1){
    return <RenderToktokWalletStatus status={status} />
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.paymentMethodText}>Payment Method</Text>
        {/* <View style={{paddingTop: 15}} /> */}
        
        {/* <View style={{height: 8}} /> */}
        <TouchableOpacity
          // style ={{...styles.item, backgroundColor: payment == 'toktokwallet' ? '#FFEBBC' : 'white' }}
          style={[styles.item, styles.tokwalletButtonContainer]}
          onPress={() => {
            setPaymentMethod('toktokwallet');
          }}>
          <View style={styles.tokwalletButtonSubContainer}>
            {/* <View style ={{height: 18, width: 18, backgroundColor: '#F6841F', }} /> */}
            <Image
              source={walletIcon}
              style={styles.walletIcon2}
            />
            <View>
              <Text style={styles.tokwalletInfoTitle1(16)}>toktok
              <Text style={styles.tokwalletInfoTitle2(16)}>wallet</Text></Text>              
              <Text style={styles.balanceText2}>
                Balance: {FormatToText.currency(toktokMall.toktokWalletBalance || 0)}
              </Text>
            </View>
          </View>
          <View
            style={styles.gotoPaymentContainer}>
            {/* <Text style={{marginLeft: 15, fontWeight: 'normal', color: '#929191', fontSize: 13}}>
              (Balance {FormatToText.currency(toktokMall.toktokWalletBalance || 0)})
            </Text> */}
            <TouchableOpacity
              style={styles.cashinButton}
              onPress={() => {
                navigation.navigate('ToktokWalletPaymentOptions', {
                  amount: 0,
                  onCashIn: ({balance}) => {
                      setTimeout(() => {
                        EventRegister.emit("ToktokMallWalletRefreshAccountBalance")
                        EventRegister.emit("ToktokMallWalletRefreshAccountStatus")
                      }, 700);
          // dispatch({ type: "TOKTOK_MALL_SET_TOKTOK_WALLET_BALANCE", payload: balance})
                  },
                });
              }}>
              <Text style={styles.cashinText}>Cash In</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        
        {parseFloat(currentBalance) < parseFloat(total) ? (
            <View style={styles.insufficientContainer}>
              <AIcons name={'exclamationcircle'} size={13} color={'#ED3A19'}/>
              <Text style={styles.insufficientText}>
                Insufficient balance
              </Text>
            </View>
          ) : (
            <></>
          )}

        {/* <TouchableOpacity 
          style ={{...styles.item, backgroundColor: payment == 'paypanda' ? '#FFEBBC' : 'white' }}
          onPress = {() => {setPaymentMethod("paypanda")}}
        >
          <View style ={{height: 20, width: 20, backgroundColor: '#F9B71A', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require("../../../../assets/icons/cod.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
          </View>
          <Text style = {{marginLeft: 10, fontWeight: 'bold', color: '#F6841F'}}>Paypanda</Text>
        </TouchableOpacity> */}

        {/* {list && list.length > 0 && list.map((item, i) => {
          return (
            <>
              <TouchableOpacity 
                style ={{...styles.item, backgroundColor: payment == item?.paycode ? '#FFEBBC' : 'white' }}
                onPress = {() => {setPaymentMethod(item?.paycode)}}
              >
                <View style ={{height: 20, width: 20, backgroundColor: '#F9B71A', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={require("../../../../assets/icons/cod.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} /> 
                </View>
                <Text style = {{marginLeft: 10, fontWeight: 'bold', color: '#F6841F'}}>{item?.description}</Text>
              </TouchableOpacity>
            </>
          )
        })} */}

        {/* <View style={{height: 30}} /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1, 
    backgroundColor: '#F7F7FA'
  },
  container: {
    padding: 0, 
    backgroundColor: 'white', 
    marginTop: 8,
    paddingBottom:8
  },
  itemContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-start'
  },
  itemImage: {
    flex: 0.3, 
    height: 100, 
    width: 100
  },
  itemprice: {
    color: '#F6841F', 
    marginRight: 10
  },
  itemSaleOff: {
    textDecorationLine: 'line-through', 
    color: '#9E9E9E'
  },
  deliveryfeeContainer: {
    borderWidth: 1,
    borderColor: '#FDDC8C',
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    borderRadius: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    // padding: 15,
    paddingHorizontal:16,
    paddingBottom:8,
    borderBottomColor: '#F7F7FA',
  },
  paymentMethodText: {
    marginLeft: 15, 
    marginTop: 15, 
    marginBottom: 5,
    fontSize: 13, 
  },
  margin1: {
    paddingTop: 15
  },
  sorryContainer: {
    backgroundColor: '#FFFCF4', 
    padding: 8
  },
  sorryText: {
    color: '#FFA700', 
    fontSize: 12, 
    textAlign: 'center', 
    paddingHorizontal: 5
  },
  margin2: {
    height: 8
  },
  gotoButtonContainer: {
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 8},
    gotoButtonText: {color: "#FFA700", 
    fontSize: 14, 
    fontFamily: FONT.BOLD, 
    textDecorationLine: 'underline'
  },
  tokwalletCotainer: {
    backgroundColor: 'white',
  },
  tokwalletInfoContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1
  },
  walletIcon1: {
    width: 25, 
    height: 25, 
    resizeMode: 'stretch'
  },
  tokwalletInfoTitle1: (size)  => {
    return {
      marginLeft: 8, 
      fontSize: size ? size : 15, 
      color: '#FFA700'
    }
  },
  tokwalletInfoTitle2: (size)  => {
    return {
      fontSize: size ? size : 15, 
      color: "#F6841F"
    }
  },
  declinedText: {
    fontSize: 12, 
    marginLeft: 8, 
    color: "#ED3A19"
  },
  pendingText: {
    fontSize: 12, 
    marginLeft: 8, 
    color: "#F6841F"
  },
  balanceContainer: (status) => {
    return {
      marginLeft: Platform.OS == "ios" ? 0 : 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'flex-start',
      flex: 2,
      marginTop: status == null ? 0 : -15
    }
  },
  balanceText1: {
    marginLeft: 5, 
    fontWeight: 'bold', 
    color: '#929191', 
    fontSize: 10
  },
  tokwalletButtonContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 0
  },
  tokwalletButtonSubContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    lex: 2
  },
  walletIcon2: {
    width: 32, 
    height: 28, 
    resizeMode: 'stretch'
  },
  balanceText2: {
    marginLeft: 10, 
    fontWeight: 'normal', 
    color: '#929191', 
    fontSize: 11
  },
  gotoPaymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
  },
  cashinButton: {
    flex: 1
  },
  cashinText: {
    alignSelf: 'flex-end', 
    fontSize: 11, 
    fontFamily: FONT.BOLD, 
    color: '#F6841F', 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: '#F6841F'
  },
  insufficientContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    alignContent:'center', 
    paddingHorizontal:16, 
    paddingBottom:10
  },
  insufficientText: {
    color: '#ED3A19', 
    fontSize: 11, 
    textAlign: 'center', 
    marginLeft:8
  }
});
