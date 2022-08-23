import React from 'react';
import {
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { destination} from './../../../../assets';
import { FONT } from '../../../../../res/variables';
import AIcons from 'react-native-vector-icons/dist/AntDesign';

export const AddressForm = ({data, onEdit}) => {
  console.log("address", data)
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <TouchableOpacity onPress={onEdit}>
        <View style={styles.address}>
          <Image style={styles.image} source={destination} />
          <View style={styles.infoContainer}>
            {data.receiverName ? (
              <>
                <Text style={styles.infoTitle}>{data?.receiverName}</Text>
                <Text style={styles.addressText}>{data?.fullAddress || data?.address}</Text>
                <Text style={styles.addresscontact_number}>{data?.receiverContact || ''}</Text>
              </>
            ) : (
              <Text style={{color: '#ED3A19'}}>Please set your default address</Text>
            )}
          </View>
          <AIcons name={'right'} size={15} color={'#F6841F'} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 0
  },
  divider: {
    height: 3, 
    backgroundColor: '#F7F7FA'
  },
  address:{
    flexDirection: 'row', 
    alignItems: 'flex-start',
    justifyContent: "center",
    paddingVertical:16, 
    paddingHorizontal: 16
  },
  image:{
    height: 15, 
    width: 13, 
    resizeMode: 'contain',
  },
  infoContainer: {
    flex:10, 
    paddingHorizontal:13
  },
  infoTitle: {
    fontSize: 13, 
    fontFamily: FONT.BOLD
  },
  addresscontact_number: {
    color: '#525252',
    marginTop: 3,
    fontSize: 11,
  },
  addressText: {
    marginTop: 3, 
    fontSize: 11, 
    textTransform: 'capitalize',
    color: '#525252'
  }
})
