import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Platform,
} from 'react-native';
import Contacts from 'react-native-contacts';
import _ from 'lodash';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { useContacts } from 'toktokload/hooks'

//COMPONENTS
import { HeaderBack, HeaderTitle } from 'src/ToktokLoad/components';
import { ContactInfoRender } from "./components";

//UTIL / FONTS / COLOR
import { moderateScale } from "toktokload/helper";
import {DARK, LIGHT, MEDIUM} from 'src/res/constants';
import {COLOR, FONT} from 'src/res/variables';

export const ToktokLoadContacts = ({navigation, route}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'Search Contacts'} />,
    headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
  });

  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [filteredData, setFilteredData] = useState(null);
  const [searchString, setSearchString] = useState('');
  const { contacts } = useContacts();

  useEffect(() => {
    if(contacts && contacts.length > 0){
      setData(contacts);
      setFilteredData(contacts)
    }
  }, [contacts])

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
   
    setRecipient(mobileNumber);
  };

  const setRecipient = (recipient) => {
    route.params.setMobileNumber(recipient.replace("+63", "0"))
    return navigation.pop()
  }

  // useEffect(()=>{
  //   goToContacts();
  // },[])

  if (!filteredData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={24} color={COLOR.YELLOW} />
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
          placeholder="Address Book"
          placeholderTextColor={COLOR.MEDIUM}
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
        placeholder="Search Contacts"
        placeholderTextColor={COLOR.MEDIUM}
        returnKeyType="done"
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{borderBottomWidth: 1, borderBottomColor: COLOR.LIGHT}} />}
        data={filteredData}
        keyExtractor={(item, index) => index}
        renderItem={({item, index}) => {
          return <ContactInfoRender item={item} index={index} setSearchString={setSearchString} checkAccount={setRecipient}/>
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  screen: {
    padding: 16,
    flex: 1,
    paddingBottom: 0,
    backgroundColor: 'white',
  },
  contact: {
    paddingLeft: 16,
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  input: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingLeft: 16,
    height: 50,
    color: COLOR.BLACK,
  },
});
