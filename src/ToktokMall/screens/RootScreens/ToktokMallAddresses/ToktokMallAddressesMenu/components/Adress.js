import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, FlatList, ScrollView, TextInput, Picker} from 'react-native';
// import { COLOR, FONT } from '../../../../../../res/variables';
// import {LandingHeader, AdsCarousel} from '../../../../../Components';
// import { ScrollView } from 'react-native-gesture-handler';
// import CustomIcon from '../../../../../Components/Icons';
// import {watch, electronics, mensfashion, furniture, petcare} from '../../../../../assets'

const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]

const AddressMenu = ({item, screen}) => {

    return(
        <View  style={styles.addressContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.addressfullName}>{item.full_name} {item.id}</Text>
            {item.default == 1 && screen != 'checkout' ? 
              ( <Text style={styles.addressdefaultText}>Default</Text> ) : (<></>)
            }
          </View>
          <Text style={styles.addresscontact_number}>{item.contact_number}</Text>
          <Text style={styles.addressText}>{item.address}</Text>
        </View>
      ) 
}

const styles = StyleSheet.create({
  addressContainer: {borderRadius: 5, backgroundColor: '#F8F8F8', padding: 10, marginTop: 10, marginBottom: 10},
  addressdefaultText: {color: '#F6841F'},
  addressfullName: {},
  addresscontact_number: {color: '#9E9E9E'},
  addressText: {marginTop: 10, fontWeight: 'bold'},
  button: {}
})

export default AddressMenu