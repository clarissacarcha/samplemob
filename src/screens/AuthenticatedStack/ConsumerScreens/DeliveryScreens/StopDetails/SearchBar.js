import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import {throttle, debounce} from 'lodash';
import {useLazyQuery} from '@apollo/react-hooks';
import uuid from 'react-native-uuid';
import axios from 'axios';
import {GET_GOOGLE_PLACE_DETAILS} from '../../../../../graphql';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {WhiteButton, TouchableIcon} from '../../../../../revamp';
import {LIGHT, PROTOCOL, HOST_PORT} from '../../../../../res/constants';

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

const SearchBar = ({sessionToken, searchText, onSearchTextChange, onSearchResultChange, searchEnabled}) => {
  const [text, setText] = useState(searchText);
  //   const [result, setResult] = useState(INITIAL_RESULT)

  const searchRef = useRef(null);

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

  useEffect(() => {
    searchRef.current.focus();
  }, []);

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

  return (
    <View style={{flexDirection: 'row'}}>
      {searchEnabled && (
        <>
          <TextInput
            ref={searchRef}
            value={searchText}
            placeholder="Enter pick up location"
            onChangeText={onChangeText}
            style={{flex: 1, marginRight: 0}}
          />
          <TouchableIcon iconSet="MaterialCommunity" iconName="close" onPress={() => {}} />
        </>
      )}
    </View>
  );
};

export default SearchBar;
