import React, {useRef, useEffect, useCallback} from 'react';
import {TextInput, TouchableOpacity} from 'react-native';
import {debounce} from 'lodash';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import ENVIRONMENTS from '../../../../../common/res/environments';
import {LIGHT, PROTOCOL, HOST_PORT, FONT_REGULAR} from '../../../../../res/constants';
import {HeaderBack} from '../../../../../components';
import {COLOR} from '../../../../../res/variables';
import {VectorIcon, ICON_SET} from '../../../../../revamp';

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

const SearchBarInput = ({searchText, placeholder, onChangeText}) => {
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
    <TextInput
      ref={searchRef}
      value={searchText}
      placeholder={placeholder}
      onChangeText={onChangeText}
      placeholderTextColor={COLOR.MEDIUM}
      style={{flex: 1, marginRight: 16}}
    />
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
}) => {
  const useIsMounted = () => {
    const isMountedRef = useRef(true);
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    return () => isMountedRef.current;
  };

  const useDebounce = (cb, delay) => {
    const options = {
      leading: false,
      trailing: true,
    };
    const inputsRef = useRef(cb);
    const isMounted = useIsMounted();
    useEffect(() => {
      inputsRef.current = {cb, delay};
    });

    return useCallback(
      debounce(
        (...args) => {
          // Don't execute callback, if (1) component in the meanwhile
          // has been unmounted or (2) delay has changed
          if (inputsRef.current.delay === delay && isMounted()) inputsRef.current.cb(...args);
        },
        delay,
        options,
      ),
      [delay, debounce],
    );
  };

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
      onSearchResultChange(ERROR_RESULT);
      onSearchLoadingChange(false);
    }
  };

  const debouncedGetGooglePlaceAutocomplete = useDebounce(
    value => getGooglePlaceAutocomplete({searchString: value}),
    1000,
  );

  const onChangeText = async value => {
    console.log({value});

    onSearchTextChange(value);

    if (value.length < 3) {
      onSearchResultChange({
        payload: {
          success: null, // Means no result yet. Show Loading
        },
        predictions: [],
      });

      return;
    }

    if (value.length >= 3) {
      debouncedGetGooglePlaceAutocomplete(value);
    }
  };

  const onClearSearch = () => {
    onSearchTextChange('');
  };

  // if (!searchEnabled) return <HeaderBack />;

  return (
    <>
      <HeaderBack />
      {searchEnabled && (
        <>
          <SearchBarInput searchText={searchText} placeholder={placeholder} onChangeText={onChangeText} />
          {searchText !== '' && (
            <TouchableOpacity
              onPress={onClearSearch}
              style={{height: 50, width: 50, justifyContent: 'center', alignItems: 'center'}}>
              <VectorIcon name="close-circle" iconSet={ICON_SET.MaterialCommunity} color={COLOR.MEDIUM} />
            </TouchableOpacity>
          )}
        </>
      )}
    </>
  );
};

export default SearchBar;
