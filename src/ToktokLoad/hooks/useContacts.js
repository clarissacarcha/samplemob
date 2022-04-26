import React , {useState,useEffect} from 'react'
import { Alert  , Platform} from 'react-native';
import {sortBy} from 'lodash';
import {check,request,PERMISSIONS,RESULTS} from 'react-native-permissions';
import { useDispatch , useSelector } from 'react-redux'
import Contacts from 'react-native-contacts'

export const useContacts = ()=> {

  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [filteredData, setFilteredData] = useState(null);
  const [searchString,setSearchString] = useState("");
  const dispatch = useDispatch();
  const contacts = useSelector(state=>state.toktokWallet.contacts) 

  const getContacts = async ()=>{
    try {
      Contacts.getAllWithoutPhotos((error, contacts) => {
       
        if (error) {
          setFetchError(true);
        }

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
            let number = contact.phoneNumbers[0].number
            number = number.replace("+63","0")
            number = number.replace(" ", "")
            return {
              name: `${contact.givenName} ${contact.familyName}`,
              number
              // image: contact.thumbnailPath
            };
          });

        const sortedContacts = sortBy(mappedContacts, (contact) => contact.name);

        dispatch({
          type: "SET_CONTACTS",
          payload: sortedContacts
        })
      });
    } catch (error) {
      console.log(error);
    }
  }


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
    if(result){ getContacts() }
  }

  useEffect(()=>{
    goToContacts()
  },[])

  return {
    contacts,
  }
}