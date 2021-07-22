import React, {useState, useEffect, useRef, useCallback} from 'react';
import {StyleSheet, View, Text, TextInput, ActivityIndicator, TouchableOpacity, FlatList} from 'react-native';
import {throttle, debounce} from 'lodash';
import {useLazyQuery} from '@apollo/react-hooks';
import uuid from 'react-native-uuid';
import axios from 'axios';

import {MEDIUM, HOST_PORT, PROTOCOL, LIGHT, COLOR, ORANGE, DARK} from '../../../../../res/constants';
import {GET_GOOGLE_PLACE_DETAILS} from '../../../../../graphql';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const INITIAL_RESULT = {
  payload: {
    success: null, // Means no result yet. Show Loading
  },
  predictions: [],
};

const Predictions = ({predictions, onPredictionSelect}) => {
  const mappedPredictions = predictions.map((prediction) => {
    return (
      <TouchableOpacity
        style={styles.suggestion}
        onPress={() => {
          onPredictionSelect(prediction);
        }}>
        <FA5Icon name="map-marker-alt" color={MEDIUM} size={16} />
        <View style={{width: 10}} />
        <Text numberOfLines={1} style={{color: MEDIUM, flex: 1}}>
          {prediction.formattedAddress}
        </Text>
      </TouchableOpacity>
    );
  });

  return mappedPredictions;
};

const SavedLocations = ({predictions, onSavedLocationSelect}) => {
  // const mappedPredictions = predictions.map((prediction) => {
  //   return (
  //     <TouchableOpacity
  //       style={styles.suggestion}
  //       onPress={() => {
  //         onSavedLocationSelect(prediction);
  //       }}>
  //       <FAIcon name="bookmark" color={MEDIUM} size={16} />
  //       <View style={{width: 10}} />
  //       <Text numberOfLines={1} style={{color: MEDIUM, flex: 1}}>
  //         {prediction.description}
  //       </Text>
  //     </TouchableOpacity>
  //   );

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.suggestion}
      onPress={() => {
        onSavedLocationSelect(item);
      }}>
      <FAIcon name="bookmark" color={MEDIUM} size={16} />
      <View style={{width: 10}} />
      <Text numberOfLines={1} style={{color: MEDIUM, flex: 1}}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const ItemSeparator = () => <View style={{height: 1, borderTopWidth: 1, borderColor: LIGHT}} />;

  return (
    <View style={{borderTopWidth: 1, borderColor: LIGHT}}>
      <FlatList
        data={predictions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={ItemSeparator}
        keyboardShouldPersistTaps={'handled'}
        style={{maxHeight: 204}}
      />
    </View>
  );
};

const LengthPrompt = () => {
  return (
    <View style={{height: 50, justifyContent: 'center'}}>
      <Text style={{color: 'red'}}>Address should be at least 3 letters long.</Text>
    </View>
  );
};

const LoadingPrompt = () => {
  return (
    <View style={{height: 50, justifyContent: 'center'}}>
      <ActivityIndicator size={16} color={COLOR} />
    </View>
  );
};

const ErrorPrompt = () => {
  return (
    <View style={{height: 50, justifyContent: 'center'}}>
      <Text style={{color: 'red'}}>Oops, something went wrong. Please try again.</Text>
    </View>
  );
};

const NoResultPrompt = () => {
  return (
    <View style={{height: 50, justifyContent: 'center'}}>
      <Text style={{color: 'red'}}>No result. Make sure your search is spelled correctly.</Text>
    </View>
  );
};

export default ({savedLocations, onLocationSelect}) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(INITIAL_RESULT);
  const [sessionToken, setSessionToken] = useState(uuid.v4());
  const inputRef = useRef();

  const [getGooglePlaceDetails, {loading}] = useLazyQuery(GET_GOOGLE_PLACE_DETAILS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setSessionToken(uuid.v4()); // Use new sessionToken after Place Details Request
      onLocationSelect({
        location: data.getGooglePlaceDetails.location,
        formattedAddress: text,
        addressBreakdownHash: data.getGooglePlaceDetails.addressBreakdownHash,
      });
    },
  });

  const getGooglePlaceAutocomplete = async ({searchString}) => {
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

      setResult(apiResult.data.data.getGooglePlaceAutocomplete);
    } catch (error) {
      console.log({error});
      setResult({
        payload: {
          success: false, // False means error
        },
        predictions: [],
      });
    }
  };

  const onPredictionSelect = async (prediction) => {
    console.log({prediction});
    setText(prediction.formattedAddress);
    setResult(INITIAL_RESULT);
    getGooglePlaceDetails({
      variables: {
        input: {
          placeId: prediction.placeId,
          sessionToken: sessionToken,
        },
      },
    });
  };

  const onSavedLocationSelect = async (prediction) => {
    console.log({prediction});
    onLocationSelect({
      location: prediction.geometry.location,
      formattedAddress: prediction.formattedAddress,
    });
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
    // Resets result upon text length = 2
    if (text.length === 2) {
      setResult(INITIAL_RESULT);
    }
  }, [text]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const debouncedRequest = useDebounce((value) => getGooglePlaceAutocomplete({searchString: value}), 1000);

  const onChangeText = async (value) => {
    setText(value);
    if (value.length >= 3) {
      debouncedRequest(value);
    }
  };

  const renderResult = () => {
    if (loading) {
      return <LoadingPrompt />;
    }

    if (text.length === 0) {
      return <SavedLocations predictions={savedLocations} onSavedLocationSelect={onSavedLocationSelect} />;
    }

    if ([1, 2].includes(text.length)) {
      return <LengthPrompt />;
    }

    if (result.payload.success === null) {
      return <LoadingPrompt />;
    }

    if (!result.payload.success) {
      return <ErrorPrompt />;
    }

    if (result.payload.success && result.predictions.length === 0) {
      return <NoResultPrompt />;
    }

    if (result.payload.success && result.predictions.length > 0) {
      return <Predictions predictions={result.predictions} onPredictionSelect={onPredictionSelect} />;
    }
  };

  return (
    <View style={styles.autocompleteBox}>
      <View style={styles.input}>
        <TextInput
          ref={inputRef}
          value={text}
          placeholder="Where to?"
          onChangeText={onChangeText}
          editable={!loading}
          style={
            text.length === 0
              ? {height: 50, color: DARK}
              : {height: 50, color: DARK, borderBottomWidth: 1, borderColor: LIGHT}
          }
          placeholderTextColor={MEDIUM}
        />
        {renderResult()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  autocompleteBox: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  input: {
    minHeight: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MEDIUM,
    paddingHorizontal: 10,
  },
  suggestion: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
