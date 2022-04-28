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
import { HeaderBack, HeaderTitle, OrangeButton, SearchInput, LoadingIndicator, EmptyList } from 'src/ToktokLoad/components';
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

  const [data, setData] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [selectedContact, setSelectedContact] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { contacts } = useContacts();

  useEffect(() => {
    if(contacts){
      setData(contacts);
      setFilteredData(contacts);
      setTimeout(() => { setIsLoading(false) }, 500)
    }
  }, [contacts])

  const onSearchChange = (value) => {
    setSearchString(value)
    const filteredContacts = data.filter((contact) => contact.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filteredContacts);
    setSelectedContact("");
  };

  const onSelectedContact = (item) => {
    let mobileNumber = item.number.replace(/\s/g, '').replace(/[()]/g, '').replace(/[$-/:-?{-~!"#^_`\[\]]/g, '');
    let numLength = mobileNumber.length;

    if(mobileNumber.substring(0, 2) == "+63"){
      return mobileNumber.replace("+63", "0");
    } else if(mobileNumber.substring(0, 2) == "63"){
      return mobileNumber.replace("63", "0");
    } else if(mobileNumber.substring(0, 2) == "09"){
      return mobileNumber
    } else if(numLength > 9) {
      let number = mobileNumber.slice(0, -(numLength - 9))
      return `09${number}`
    } else {
      return `09${mobileNumber}`;
    }
  };

  const setRecipient = () => {
    route.params.onSelectContact(onSelectedContact(selectedContact.item))
    return navigation.pop()
  }

  const ListEmptyComponent = () => {
    return (
      <View style={styles.screen}>
        <EmptyList
          imageSrc={empty_search}
          label="No Results Found"
          message="Try to search something similar."
        />
      </View>
      
      // <View style={styles.center}>
      //   <Image source={empty_search} style={styles.emptySearchIcon} />
      //   <Text style={styles.emptyText}>We can't find any contact matching your search</Text>
      // </View>
    )
  }

  if(isLoading){
    return(
      <View style={styles.center}>
        <LoadingIndicator isLoading={true} isFlex />
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

  if (data.length === 0 && searchString === '') {
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
          search={searchString}
          onChangeText={onSearchChange}
          value={searchString}
          placeholder="Search contacts"
          onClear={() => {
            setSearchString("");
            setSelectedContact("");
          }}
        />
      </View>
      <FlatList
        data={searchString ? filteredData : data}
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
      {(filteredData.length > 0 || !searchString) && (
        <View style={{ padding: 16 }}>
          <OrangeButton
            onPress={setRecipient}
            disabled={Object.keys(selectedContact).length === 0}
            label="Next"
          />
        </View>
      )}
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
