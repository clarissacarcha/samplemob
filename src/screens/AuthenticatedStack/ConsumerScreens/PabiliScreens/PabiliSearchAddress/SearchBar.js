import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import {debounce} from 'lodash';

import axios from 'axios';

import {LIGHT, PROTOCOL, HOST_PORT, FONT_REGULAR} from '../../../../../res/constants';
import {HeaderBack} from '../../../../../components';
import {COLOR, FONT} from '../../../../../res/variables';

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
    console.log({searchString});

    try {
      const apiResult = await axios({
        url: `${PROTOCOL}://${HOST_PORT}/graphql`,
        method: 'post',
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
      //   setResult(apiResult.data.data.getGooglePlaceAutocomplete);
      onSearchResultChange(apiResult.data.data.getGooglePlaceAutocomplete);
      console.log({result: apiResult.data.data.getGooglePlaceAutocomplete});
    } catch (error) {
      onSearchResultChange(ERROR_RESULT);
    }
  };

  const debouncedGetGooglePlaceAutocomplete = useDebounce(
    (value) => getGooglePlaceAutocomplete({searchString: value}),
    1000,
  );

  const onChangeText = async (value) => {
    // setText(value);
    onSearchTextChange(value);
    if (value.length >= 3) {
      debouncedGetGooglePlaceAutocomplete(value);
    }
  };

  // if (!searchEnabled) return <HeaderBack />;

  return (
    <>
      <HeaderBack />
      {searchEnabled && (
        <SearchBarInput searchText={searchText} placeholder={placeholder} onChangeText={onChangeText} />
      )}
    </>
  );
};

export default SearchBar;
