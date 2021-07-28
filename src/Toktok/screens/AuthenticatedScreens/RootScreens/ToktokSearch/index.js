import React, {useState} from 'react';
import {View, Text} from 'react-native';
import uuid from 'react-native-uuid';

import {AutocompleteResult, Header, SearchLoadingIndicator} from './components';

const INITIAL_RESULT = {
  payload: {
    success: null, // Means no result yet. Show Loading
  },
  predictions: [],
};

export const ToktokSearch = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState(INITIAL_RESULT);
  const [sessionToken, setSessionToken] = useState(uuid.v4());
  const [searchLoading, setSearchLoading] = useState(false);

  const onLocationSelect = (selectedData) => {
    console.log(JSON.stringify({selectedData}, null, 4));

    const formattedAddress = {...selectedData, ...selectedData.location};
    delete formattedAddress.route;
    delete formattedAddress.location;
    delete formattedAddress.__typename;

    navigation.pop();
    navigation.push(selectedData.route, {setUserLocation: () => {}, formattedAddressFromSearch: formattedAddress});
  };

  return (
    <View style={{flex: 1}}>
      <Header
        setSearchText={setSearchText}
        setSearchResult={setSearchResult}
        setSearchLoading={setSearchLoading}
        searchText={searchText}
      />
      <View style={{backgroundColor: 'white', flex: 1}}>
        {/* <SearchLoadingIndicator />
         */}
        {/* <Text>{JSON.stringify(searchResult.predictions, null, 4)}</Text> */}
        {!searchLoading && searchText.length >= 3 && searchResult.predictions.length > 0 && (
          <AutocompleteResult
            searchResult={searchResult}
            sessionToken={sessionToken}
            setSessionToken={setSessionToken}
            onLocationSelect={onLocationSelect}
            setSearchText={setSearchText}
          />
        )}
        {searchLoading && searchText !== '' && <SearchLoadingIndicator />}
      </View>
    </View>
  );
};
