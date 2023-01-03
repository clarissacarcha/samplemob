import React, {useRef, useEffect, useCallback} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native';
import {debounce} from 'lodash';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import ENVIRONMENTS from '../../../../../common/res/environments';
import {HeaderBack} from '../../../../../components';
import {COLOR} from '../../../../../res/variables';
import {VectorIcon, ICON_SET} from '../../../../../revamp';
import {ThrottledOpacity} from '../../../../../components_section';
import BackIcon from '../../../../../assets/icons/arrow-left-icon.png';
import SearchIcon from '../../../../../assets/icons/Search_White.png';

const INITIAL_RESULT = {
  payload: {
    success: null, // Means no result yet. Show Loading
  },
  predictions: [],
};

const ERROR_RESULT = {
  payload: {
    success: false, // False means error
  },
  predictions: [],
};

const SearchBarInput = ({searchText, placeholder, onChangeText, onClearSearch, executeGetGooglePlaceAutocomplete}) => {
  const searchRef = useRef(null);

  const focusInput = () => {
    setTimeout(() => {
      if (searchRef) {
        searchRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    focusInput();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textFieldContainer}>
        <TextInput
          ref={searchRef}
          value={searchText}
          placeholder={placeholder}
          onChangeText={onChangeText}
          placeholderTextColor={COLOR.MEDIUM}
          style={{flex: 1, marginLeft: 16}}
        />
        {searchText !== '' && (
          <TouchableOpacity onPress={onClearSearch} style={styles.clearIcon}>
            <VectorIcon name="close-circle" iconSet={ICON_SET.MaterialCommunity} color={COLOR.MEDIUM} />
          </TouchableOpacity>
        )}
      </View>
      {searchText !== '' && (
        <View style={styles.searchContainer}>
          <ThrottledOpacity onPress={() => executeGetGooglePlaceAutocomplete(searchText)}>
            <Image source={SearchIcon} style={{width: 15, height: 15}} resizeMode={'contain'} />
          </ThrottledOpacity>
        </View>
      )}
    </View>
  );
};

const SearchBar = ({
  placeholder,
  sessionToken,
  searchText,
  onSearchTextChange,
  onSearchResultChange,
  searchEnabled,
  onSearchLoadingChange,
  navigation,
  onClearSearchBar,
}) => {
  const getGooglePlaceAutocomplete = async ({searchString}) => {
    try {
      onSearchLoadingChange(true);

      const accessToken = await AsyncStorage.getItem('accessToken');
      const authorizationHeader = `Bearer ${accessToken}`;

      const apiResult = await axios({
        url: `${ENVIRONMENTS.TOKTOK_SERVER}/graphql`,
        method: 'post',
        headers: {
          Authorization: authorizationHeader,
        },
        data: {
          query: `
                query {
                  getGooglePlaceAutocomplete(input:{
                    searchString: "${searchString}"
                    sessionToken:"${sessionToken}"
                  }) {
                    payload
                    predictions {
                      formattedAddress
                      placeId
                    }
                  }
                }
                `,
        },
      });

      if (apiResult.data.data.getGooglePlaceAutocomplete) {
        onSearchResultChange(apiResult.data.data.getGooglePlaceAutocomplete);
      }
      onSearchLoadingChange(false);
    } catch (error) {
      console.log({error});
      onSearchResultChange(ERROR_RESULT);
      onSearchLoadingChange(false);
    }
  };

  const onClearSearch = () => {
    onSearchTextChange('');
    onClearSearchBar();
  };

  return (
    <>
      <ThrottledOpacity
        style={{alignSelf: 'center', paddingHorizontal: 16}}
        onPress={() => navigation.pop()}
        delay={4000}>
        <Image source={BackIcon} resizeMode={'contain'} style={{width: 15, height: 15}} />
      </ThrottledOpacity>
      {searchEnabled && (
        <SearchBarInput
          searchText={searchText}
          placeholder={placeholder}
          onChangeText={value => onSearchTextChange(value)}
          onClearSearch={onClearSearch}
          executeGetGooglePlaceAutocomplete={value => getGooglePlaceAutocomplete({searchString: value})}
        />
      )}
    </>
  );
};

export default SearchBar;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textFieldContainer: {
    flex: 1,
    marginRight: 16,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    flexDirection: 'row',
  },
  searchContainer: {
    marginRight: 16,
    backgroundColor: COLOR.ORANGE,
    width: 50,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
