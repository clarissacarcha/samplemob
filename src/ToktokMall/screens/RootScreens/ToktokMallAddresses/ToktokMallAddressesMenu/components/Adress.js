import React from 'react';
import {StyleSheet, View, Text, } from 'react-native';


const AddressMenu = ({item, screen}) => {

    return(
        <View  style={styles.addressContainer}>

          <View style={styles.nameContainer}>
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
  addressContainer: {
    borderRadius: 5, 
    backgroundColor: '#F8F8F8', 
    padding: 10, 
    marginTop: 10, 
    marginBottom: 10
  },
  addressdefaultText: {
    color: '#F6841F'
  },
  addressfullName: {

  },
  addresscontact_number: {
    color: '#9E9E9E'
  },
  addressText: {
    marginTop: 10, 
    fontWeight: 'bold'
  },
  button: {
    
  },
  nameContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  }
})

export default AddressMenu