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
  Image
} from 'react-native';
import Contacts from 'react-native-contacts';
import _ from 'lodash';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { useContacts } from 'toktokload/hooks'

//COMPONENTS
import { HeaderBack, HeaderTitle, OrangeButton, SearchInput } from 'src/ToktokLoad/components';
import { ContactInformation } from "./components";
import { empty_search } from 'toktokload/assets/images';
import { search_icon } from 'toktokload/assets/icons';

//UTIL / FONTS / COLOR
import { moderateScale } from "toktokload/helper";
import {DARK, LIGHT, MEDIUM} from 'src/res/constants';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

export const ToktokLoadContacts = ({navigation, route}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'All Contacts'} />,
  });

  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [filteredData, setFilteredData] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [selectedContact, setSelectedContact] = useState("");
  const { contacts } = useContacts();

  useEffect(() => {
    if(contacts){
      setData(contacts);
      setFilteredData(contacts)
    }
  }, [contacts])

  const onSearchChange = (value) => {
    setSearchString(value);
    const filteredContacts = data.filter((contact) => contact.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filteredContacts);
  };

  const onSelectContact = (item) => {
    let mobileNumber = item.number.replace(/\s/g, '').replace(/[()]/g, '');
    return mobileNumber.replace("+63", "0");
  };

  const setRecipient = () => {
    route.params.setMobileNumber(onSelectContact(selectedContact.item))
    return navigation.pop()
  }

  const ListEmptyComponent = () => {
    return (
      <View style={styles.center}>
        <Image source={empty_search} style={styles.emptySearchIcon} />
        <Text style={styles.emptyText}>We can't find any contact matching your search</Text>
      </View>
    )
  }

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

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16 }}>
        <SearchInput
          onChangeText={onSearchChange}
          value={searchString}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        extraData={{selectedContact, filteredData}}
        keyExtractor={(item, index) => index}
        renderItem={({item, index}) => {
          return (
            <ContactInformation
              item={item}
              index={index}
              setSearchString={setSearchString}
              setSelectedContact={setSelectedContact}
              selectedContact={selectedContact}
            />
          )
        }}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <View style={{ padding: 16 }}>
        <OrangeButton
          onPress={setRecipient}
          disabled={Object.keys(selectedContact).length === 0}
          label="Next"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: moderateScale(16)
  },
  screen: {
    flex: 1,
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
    backgroundColor: "#F8F8F8",
    borderRadius: 5,
    height: 50,
    color: COLOR.BLACK,
    margin: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  emptySearchIcon: {
    width: moderateScale(200),
    height: moderateScale(200),
    resizeMode: "contain"
  },
  emptyText: {
    color: "#9E9E9E",
    fontSize: FONT_SIZE.L
  },
  searchIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "contain",
    tintColor: "#F6841F",
    marginRight: moderateScale(10)
  },
});
