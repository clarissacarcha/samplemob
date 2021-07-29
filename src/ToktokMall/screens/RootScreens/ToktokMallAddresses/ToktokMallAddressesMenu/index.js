import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker} from 'react-native';
import {connect} from 'react-redux'
import { COLOR, FONT } from '../../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../../Components';
import Address from './components/Adress'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]

export const ToktokMallAddressesMenu = ({route, navigation, }) => {

  const [data, setData] = useState([])
  const [defaultId, setDefaultID] = useState(0)
  const [sample, setSample] = useState('[]');
  const [addressLengthChanged, setAddressLengthChanged] = useState(data.length)


  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Address', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  // let params = route.params.navigated

  const refresh = async () => {

  } 
  
  const changeDefault = (id) => {
    route.params.setDefaultAddress(id)
    setDefaultID(id)
  }

  // useEffect(() => {
  //   // alert(JSON.stringify(route))
  //   // if(route.params)defaultAddress
  //   setData(route.params.addressData)
  //   setDefaultID(route.params.defaultAddress)
  // }, []);

  useEffect(() => {
    // alert(JSON.stringify(route.params.screens))
    if(route.params.screen == 'checkout'){
      
      route.params.setAddressData(route.params.addressData)
      
    }
    setDefaultID(route.params.defaultAddress)
    setData(route.params.addressData)
    // setData(data)
    // if()
    // setData(testData)
    // refresh()
  }, [data.length]);

  const renderAddresses = () => {
    return data.map((item, i) => {
      return(
        <TouchableOpacity style={styles.addressContainer} onLongPress={() => {
          navigation.navigate("ToktokMallAddressesForm", {item, update: true})
        }} onPress = {() => {changeDefault(item.id)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.addressfullName}>{item.full_name} {item.id}</Text>
            { item.id == defaultId  ? 
              // item.default == 1  ? 
              ( <Text style={styles.addressdefaultText}>Default</Text> ) : (<></>)
            }
          </View>
          <Text style={styles.addresscontact_number}>{item.contact_number}</Text>
          <Text style={styles.addressText}>{item.address}</Text>
        </TouchableOpacity>
      ) 
    })
  }

  return (
    <>
      <ScrollView>
      <View style = {styles.body}>
        <View style= {styles.container}> 
          {renderAddresses()}
          <TouchableOpacity style={styles.button}  onPress ={() => {
            navigation.navigate('ToktokMallAddressesForm', { addressData: route.params.addressData, defaultAddress: route.params.defaultAddress, addressList: data,
              setDefaultID: setDefaultID, setAddressLengthChanged:setAddressLengthChanged
            })
            // onPress()
          }}>
            <Text>Add new address</Text>
            <AntDesign name = {'plus'} color = {'#F6841F'}  size = {20} />
            {/* <View style = {{height: 20, width: 20, backgroundColor: '#F6841F'}} /> */}
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </>
  );
};


const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#F7F7FA', },
  container: {padding: 15, backgroundColor: 'white', marginTop: 8,  flex: 1},
  addressContainer: {borderRadius: 5, backgroundColor: '#F8F8F8', padding: 10, marginTop: 10, marginBottom: 10},
  defaultText: {color: '#F6841F'},
  fullName: {},
  contact_number: {color: '#9E9E9E'},
  address: {marginTop: 10, fontWeight: 'bold'},
  button: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, height: 50, 
  borderRadius: 5,  paddingLeft: 10, paddingRight: 10,
    elevation: 0.0001, 
    // shadowOffset: {width: 1, height: 1}, shadowColor: '#FFFFFF',
    // shadowOpacity: 0.3,
    // shadowRadius: 1
    borderWidth: 0.2,
    borderColor: "#F8F8F8"
  },
  addressContainer: {borderRadius: 5, backgroundColor: '#F8F8F8', padding: 10, marginTop: 10, marginBottom: 10},
  addressdefaultText: {color: '#F6841F'},
  addressfullName: {},
  addresscontact_number: {color: '#9E9E9E'},
  addressText: {marginTop: 10, fontWeight: 'bold'},
})