import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Contacts from 'react-native-contacts';
import _ from 'lodash';

import {HeaderBack, HeaderTitle} from '../../../../components';
import {COLOR, DARK, LIGHT, MEDIUM} from '../../../../res/constants';

const SearchContact = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Search', 'Contact']} />,
  });

  const {onContactSelectCallback} = route.params;

  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [filteredData, setFilteredData] = useState(null);
  const [searchString, setSearchString] = useState('');

  const getContacts = async () => {
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

        const sortedContacts = _.sortBy(mappedContacts, (contact) => contact.name);

        setData(sortedContacts);
        setFilteredData(sortedContacts);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchChange = (value) => {
    setSearchString(value);
    const filteredContacts = data.filter((contact) => contact.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filteredContacts);
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

    onContactSelectCallback({
      name: name,
      number: mobileNumber,
    });
    navigation.pop();
  };

  useEffect(() => {
    getContacts();
  }, []);

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

  if (filteredData.length === 0 && searchString !== '') {
    return (
      <View style={styles.screen}>
        <TextInput
          value={searchString}
          onChangeText={onSearchChange}
          style={styles.input}
          placeholder="Search Contact"
          placeholderTextColor={LIGHT}
          returnKeyType="done"
        />
        <View style={styles.center}>
          <Text>No matching contact found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TextInput
        value={searchString}
        onChangeText={onSearchChange}
        style={styles.input}
        placeholder="Search Contact"
        placeholderTextColor={LIGHT}
        returnKeyType="done"
      />
      <FlatList
        showsVerticalScrollIndicator={true}
        data={filteredData}
        keyExtractor={(item, index) => index}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}>
              <TouchableOpacity onPress={() => onSelectContact(item)}>
                <View style={styles.contact}>
                  <Text>{item.name}</Text>
                  <Text style={{color: MEDIUM}}>{item.number}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default SearchContact;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    padding: 20,
    flex: 1,
    paddingBottom: 0,
  },
  contact: {
    paddingLeft: 20,
    paddingVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    height: 50,
    color: DARK,
  },
});
