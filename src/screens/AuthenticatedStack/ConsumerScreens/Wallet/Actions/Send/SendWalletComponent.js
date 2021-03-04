import React, { useEffect , useState } from 'react'
import {View,Text,StyleSheet,Platform,Alert,TextInput,FlatList,ActivityIndicator} from 'react-native'
import {check,request,PERMISSIONS,RESULTS} from 'react-native-permissions'
import Contacts from 'react-native-contacts';
import {sortBy} from 'lodash'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM} from '../../../../../../res/constants'

const SendWalletComponent = ()=> {

    const [data, setData] = useState(null);
    const [fetchError, setFetchError] = useState(false);
    const [filteredData, setFilteredData] = useState(null);
    const [searchString, setSearchString] = useState('');

    const goToContacts = async ()=> {
        const checkAndRequest = Platform.select({
            android: async () => {
              const checkResult = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
      
              if (checkResult === RESULTS.GRANTED) {
                return true;
              }
      
              if (checkResult === RESULTS.BLOCKED) {
                Alert.alert(
                  '',
                  "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
                );
                return false;
              }
      
              if (checkResult === RESULTS.UNAVAILABLE) {
                Alert.alert('', 'Access to contacts is unavailable.');
                return false;
              }
      
              if (checkResult === RESULTS.DENIED) {
                const requestResult = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
      
                if (requestResult === RESULTS.GRANTED) {
                  return true;
                }
      
                if (requestResult === RESULTS.BLOCKED) {
                  Alert.alert(
                    '',
                    "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
                  );
                  return false;
                }
      
                if (requestResult === RESULTS.DENIED) {
                  Alert.alert('', "Sorry, we can't access your contacts without sufficient permission.");
                  return false;
                }
              }
            },
            ios: async () => {
              const checkResult = await check(PERMISSIONS.IOS.CONTACTS);
      
              if (checkResult === RESULTS.GRANTED) {
                return true;
              }
      
              if (checkResult === RESULTS.BLOCKED) {
                Alert.alert(
                  '',
                  "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
                );
                return false;
              }
      
              if (checkResult === RESULTS.UNAVAILABLE) {
                Alert.alert('', 'Access to contacts is unavailable.');
                return false;
              }
      
              if (checkResult === RESULTS.DENIED) {
                const requestResult = await request(PERMISSIONS.IOS.CONTACTS);
                if (requestResult === RESULTS.GRANTED) {
                  return true;
                }
      
                if (requestResult === RESULTS.BLOCKED) {
                  Alert.alert(
                    '',
                    "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
                  );
                  return false;
                }
              }
            },
          });
      
          const result = await checkAndRequest();
          if(result) getContacts()
    }

    const getContacts = async ()=>{
        try {
            Contacts.getAllWithoutPhotos((error, contacts) => {
              if (error) {
                setFetchError(true);
              }
      
              // console.log(JSON.stringify(contacts, null, 4));
      
              const mappedContacts = contacts
                .filter((contact) => {
                  if (Platform.OS === 'android') {
                    if (contact.phoneNumbers.length === 0 || !contact.displayName) {
                      return false;
                    }
                    return true;
                  }
      
                  if (Platform.OS === 'ios') {
                    if (contact.phoneNumbers.length === 0 || !contact.givenName) {
                      return false;
                    }
                    return true;
                  }
                })
                .map((contact) => {
                  return {
                    name: `${contact.givenName} ${contact.familyName}`,
                    number: contact.phoneNumbers[0].number,
                  };
                });
      
              const sortedContacts = sortBy(mappedContacts, (contact) => contact.name);
      
              setData(sortedContacts);
              setFilteredData(sortedContacts);
            });
          } catch (error) {
            console.log(error);
          }
    }


    useEffect(()=>{
        goToContacts()
    },[])

    if (!filteredData) {
        return (
          <View style={styles.center}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
      }
    
      if (fetchError) {
        return (
          <View style={styles.center}>
            <Text>Sorry, we cannot obtain your contacts' information.</Text>
          </View>
        );
      }
    
      if (filteredData.length === 0 && searchString === '') {
        return (
          <View style={styles.center}>
            <Text>No contact information found.</Text>
          </View>
        );
      }

    return (
       <View style={styles.container}>
           <View style={styles.searchField}>
                <TextInput 
                    style={styles.input} 
                    placeholder="Search Contact"
                />
           </View>

           <View style={styles.contactlist}>
                <Text>{JSON.stringify(data)}</Text>
                <Text>{JSON.stringify(filteredData)}</Text>
           </View>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    searchField: {
        borderBottomColor: "silver",
        borderBottomWidth: 0.5,
        padding: 20,
    },
    contactlist: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "silver",
        borderRadius: 10,
        paddingLeft: 20,
        height: 50,
        color: "black",
      },
})

export default SendWalletComponent