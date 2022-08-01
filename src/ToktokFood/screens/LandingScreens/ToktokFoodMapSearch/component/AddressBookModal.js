import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Appearance,
  SafeAreaView,
  TextInput,
} from 'react-native';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

// Fonts & Colors
import {COLORS, FONTS, FONT_SIZE, NUMBERS, BUTTON_HEIGHT} from 'res/constants';
import {verticalScale} from 'toktokfood/helper/scale';

import Contacts from 'react-native-contacts';
import _ from 'lodash';

import FIcon from 'react-native-vector-icons/Feather';

const AddressBookModal = props => {
  const {visibility, onClose, onSelected} = props;

  const [contacts, setContacts] = useState([]);
  const [searchString, setSearchString] = useState('');

  const goToContacts = async () => {
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

    if (result) {
      getContactList();
    } else {
      Alert.alert('', 'Access to contacts is unavailable.', [{text: 'OK', onPress: () => onClose()}]);
    }
  };

  const getContactList = () => {
    try {
      Contacts.getAllWithoutPhotos((err, list) => {
        const mappedContacts = list
          .filter(contact => {
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
          .map(contact => {
            return {
              name: `${contact.givenName} ${contact.familyName}`,
              number: contact.phoneNumbers[0].number,
            };
          });

        const sortedContacts = _.sortBy(mappedContacts, contact => contact.name);
        setContacts(sortedContacts);
      });
    } catch {
      Alert.alert('', 'Access to contacts is unavailable.', [{text: 'OK', onPress: () => onClose()}]);
    }
  };

  const onSelectContact = ({name, number}) => {
    let mobileNumber = number.replace(/\s/g, '').replace(/[()]/g, '');
    // For 11 digit number starting with 0
    if (mobileNumber.length === 11 && mobileNumber[0] === '0') {
      mobileNumber = mobileNumber.slice(1, 11);
    }

    if (mobileNumber.length === 13 && mobileNumber.slice(0, 3) === '+63') {
      mobileNumber = mobileNumber.slice(3, 13);
    }

    if (mobileNumber.length !== 10) {
      Alert.alert('', 'Invalid mobile number format.');
      return;
    }

    onSelected({
      name: name.replace(/[^a-z0-9 ]/gi, ''),
      number: mobileNumber,
    });
    onClose();
    setSearchString('');
  };

  const ContactItem = ({item}) => (
    <TouchableOpacity style={styles.contactItem} onPress={() => onSelectContact(item)}>
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactNumber}>{item.number}</Text>
    </TouchableOpacity>
  );

  const onSearchChange = value => {
    setSearchString(value);
    if (value !== '') {
      const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(value.toLowerCase()));
      setContacts(filteredContacts);
    } else {
      goToContacts();
    }
  };

  useEffect(() => {
    goToContacts();
    setSearchString('');
  }, []);

  return (
    <>
      <Modal
        onShow={() => goToContacts()}
        animationType="slide"
        visible={visibility}
        onRequestClose={() => onClose()}
        style={styles.modal}>
        <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
          <View style={styles.contactWrapper}>
            <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}>
              <FIcon name="chevron-down" size={30} color={Appearance.getColorScheme() === 'dark' ? '#000' : '#000'} />
            </TouchableOpacity>
            <View style={styles.header}>
              <Text style={styles.headerLabel}>Contact List</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={searchString}
                onChangeText={search => onSearchChange(search)}
                style={styles.input}
                placeholder="Search Address Book"
                placeholderTextColor="#D3D3D3"
                returnKeyType="done"
              />
            </View>

            {contacts.length === 0 && (
              <View style={styles.noMatchingWrapper}>
                <Text style={styles.noMatchingText}>No matching contact found.</Text>
              </View>
            )}
            <ScrollView style={{flex: 1}}>
              {contacts.map(v => (
                <ContactItem item={v} />
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  contactWrapper: {
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: verticalScale(45),
    borderBottomColor: COLORS.TRANSPARENT_GRAY,
  },
  headerLabel: {
    color: COLORS.DARK,
    textAlign: 'center',
    fontFamily: FONTS.BOLD,
    fontSize: FONT_SIZE.XL,
  },
  contactItem: {
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    paddingHorizontal: 14,
    borderBottomColor: COLORS.LIGHT,
  },
  contactName: {
    fontSize: 16,
    marginBottom: 2,
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
  },
  contactNumber: {
    fontSize: 13,
    marginBottom: 2,
    color: COLORS.MEDIUM,
    fontFamily: FONTS.BOLD,
  },
  inputWrapper: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    borderRadius: 5,
    paddingLeft: 16,
    color: '#222222',
    backgroundColor: '#F7F7FA',
  },
  closeButton: {
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMatchingWrapper: {
    height: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMatchingText: {
    color: '#222222',
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
  },
});

export default AddressBookModal;
