import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import {StyleSheet, View, Text, TextInput, ActivityIndicator, TouchableOpacity} from 'react-native';
import {throttle, debounce} from 'lodash';
import {MEDIUM, HOST_PORT, PROTOCOL, LIGHT, COLOR} from '../../../../../res/constants';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';

const Suggestions = ({text, result, onLocationSelect}) => {
  if (text.length === 0) {
    return null;
  }

  if ([1, 2].includes(text.length)) {
    return (
      <View style={styles.suggestionsBox}>
        <View style={{height: 50, justifyContent: 'center'}}>
          <Text style={{color: MEDIUM}}>Address should be at least 3 letters long.</Text>
        </View>
      </View>
    );
  }

  if (!result.payload.result) {
    return (
      <View style={styles.suggestionsBox}>
        <View style={{height: 50, justifyContent: 'center'}}>
          <Text style={{color: MEDIUM}}>No result.</Text>
        </View>
      </View>
    );
  }

  if (result.suggestions.length >= 1) {
    const mappedSuggestion = result.suggestions.map((suggestion) => {
      return (
        <TouchableOpacity
          style={styles.suggestion}
          onPress={() => {
            const dataDetails = {
              ...suggestion,
              description: suggestion.formattedAddress,
            };

            onLocationSelect(dataDetails, dataDetails);
          }}>
          <FA5Icon name="map-marker-alt" color={MEDIUM} size={16} />
          <View style={{width: 10}} />
          <Text numberOfLines={1} style={{color: MEDIUM, flex: 1}}>
            {suggestion.formattedAddress}
          </Text>
        </TouchableOpacity>
      );
    });

    return <View style={styles.suggestionsBox}>{mappedSuggestion}</View>;
  }

  return (
    <View style={styles.suggestionsBox}>
      <View style={{height: 50, justifyContent: 'center'}}>
        <ActivityIndicator size={16} color={COLOR} />
      </View>
    </View>
  );
};

const INITIAL_SUGGESTIONS = {
  payload: {
    success: true,
    result: false,
  },
  suggestions: [],
};

export default ({onLocationSelect}) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(INITIAL_SUGGESTIONS);

  const getMapboxAutocomplete = async ({searchString}) => {
    try {
      const result = await axios({
        url: `${PROTOCOL}://${HOST_PORT}/graphql`,
        method: 'post',
        data: {
          query: `
                query {
                    getMapboxAutocomplete(input: {
                            searchString: "${searchString}"
                        }) {
                        payload 
                        suggestions {
                            formattedAddress
                            geometry {
                                location {
                                    lat
                                    lng
                                }
                            }
                        }
                    }
                }
            `,
        },
      });

      setResult(result.data.data.getMapboxAutocomplete);
    } catch (error) {
      console.log(error);
    }
  };

  function useDebounce(cb, delay) {
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
  }

  function useIsMounted() {
    const isMountedRef = useRef(true);
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    return () => isMountedRef.current;
  }

  useEffect(() => {
    if (text.length === 3) {
      setResult(INITIAL_SUGGESTIONS);
    }
  }, [text]);

  const debouncedRequest = useDebounce(() => getMapboxAutocomplete({searchString: text}), 1000);

  const onChangeText = async (value) => {
    setText(value);
    if (value.length >= 3) {
      debouncedRequest();
    }
  };

  return (
    <View style={styles.autocompleteBox}>
      <View style={text.length === 0 ? styles.input : styles.inputWithSuggestions}>
        <TextInput
          value={text}
          placeholder="Where to?"
          onChangeText={onChangeText}
          style={text.length === 0 ? {} : {borderBottomWidth: 1, borderColor: LIGHT}}
        />
      </View>
      <Suggestions result={result} text={text} onLocationSelect={onLocationSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  autocompleteBox: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MEDIUM,
    paddingHorizontal: 10,
  },
  inputWithSuggestions: {
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: MEDIUM,
    paddingHorizontal: 10,
  },
  suggestionsBox: {
    borderColor: MEDIUM,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
  },
  suggestion: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
