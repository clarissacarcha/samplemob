import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker} from 'react-native';
import { COLOR, FONT } from '../../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../../Components';
import Fontisto from 'react-native-vector-icons/dist/Fontisto'

export const ToktokMallAddressesForm = ({navigation, route}) => {

  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [landmark, setlandmark] = useState('');
  const [defaultId, setDefaultId] = useState(0);
  const [previousdefaultId, setPreviousDefaultId] = useState(0);
  const [clicked, setClicked] = useState(false)

  let previousArr = []

  useEffect(() => {
    // findDefaultAddress();
    previousArr = route.params.addressList
    // setAddressData(testDataAddress);
    // setPreviousDefaultId(route.params.defaultAddress)
  },[])

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['New Address', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  const setNewDefault = () => {
    setClicked(!clicked)
    // setPreviousDefaultId(route.params.defaultAddress)
    if (clicked){
      setPreviousDefaultId(route.params.defaultAddress)
      setDefaultId(route.params.addressList.length + 1)
    } else {
      setPreviousDefaultId(0)
      setDefaultId(0)
    }
    // setDefaultId(route.params.addressList.length + 1)
  }

  const onPress = () => {
    
    let addressForm = {id: route.params.addressList.length + 1, full_name: fullName, contact_number: contact,
      address: address, default: 0
    }
    let newAddressData =  previousArr.push(addressForm)
    if(clicked){
      route.params.setDefaultID(defaultId)
    }
    // alert(JSON.stringify(previousArr))
    // route.params.setSample(fullName)
    // route.params.setAddressLengthChanged(route.params.addressList.length)
    navigation.navigate('ToktokMallAddressesMenu', {addressData: previousArr, defaultAddress: clicked ? newAddressData : route.params.defaultAddress})
  }

  return (
    <>
      <View style = {styles.container}>
        <View style= {styles.partition1}> 
          
          <View style = {styles.textinputContainer}>
            <TextInput style = {styles.textinput}   placeholder = {'Full Name'} 
            onChangeText ={(text) => {setFullName(text)}} 
            />
          </View>
          <View style = {styles.textinputContainer}>
            <TextInput style = {styles.textinput}  placeholder = {'Contact Number'} 
            onChangeText ={(text) => {setContact(text)}}  
            />
          </View>
          <View style = {styles.textinputContainer}>
            <TextInput  style = {styles.textinput}  placeholder = {'Address(House #, Street, Village)'} 
            onChangeText ={(text) => {setAddress(text)}} 
            />
          </View>
          <View style = {styles.textinputContainer}>
            <TextInput style = {styles.textinput}   placeholder = {'Select City'} 
            onChangeText ={(text) => {setCity(text)}} 
            />
          </View>
          <View style = {styles.textinputContainer}>
            <TextInput style = {styles.textinput} placeholder = {'Postal code (optional)'} 
            onChangeText ={(text) => {setPostalCode(text)}} 
            />
          </View>
          <View style = {styles.textinputLastContainer}>
            <TextInput style = {styles.textinput}  placeholder = {'Landmarks/Exact Address/ Note to rider (optional)'} 
            onChangeText ={(text) => {setlandmark(text)}}  
            />
          </View>
        </View>
        <View style={styles.partition2}>
          <Text>Set as default address</Text>
          <TouchableOpacity  onPress = {() => {setNewDefault()}}>
            {clicked ? 
              <Fontisto 
                name = {'radio-btn-active'}
                size = {20}
                color = {'#F6841F'}
              /> : 
              <Fontisto 
              name = {'radio-btn-passive'}
              size = {20}
              color = {'#F6841F'}
              /> 
            }
          </TouchableOpacity>
        </View>
        <View style={styles.partition3}>
          <TouchableOpacity style={styles.button} onPress = {() => {onPress()}} >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F7F7FA', },
  partition1: {padding: 15, backgroundColor: 'white', marginTop: 15,  flex: 1.5},
  partition2: {padding: 15, backgroundColor: 'white', marginTop: 4,  flex: 0.08, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  partition3: {padding: 15, backgroundColor: 'white', marginTop: 4, flex: .3, justifyContent: 'center', alignItems: 'center'},
  textinputContainer: {backgroundColor: '#F8F8F8', marginTop: 10,  borderRadius: 5, alignItems: 'flex-start'},
  textinput: {marginLeft: 10},
  textinputLastContainer :{backgroundColor: '#F8F8F8', marginTop: 10,  borderRadius: 5, alignItems: 'flex-start', height: 130},
  button: {alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6841F', width: 136, height: 42, borderRadius: 5},
  buttonText: {color: 'white'}
})