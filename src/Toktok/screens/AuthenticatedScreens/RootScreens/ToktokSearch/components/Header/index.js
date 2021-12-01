import React, {useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TextInput, StatusBar, ImageBackground, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {LIGHT, PROTOCOL, HOST_PORT, FONT_REGULAR} from '../../../../../../../res/constants';
import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../../res/variables';
import {debounce} from 'lodash';
import axios from 'axios';
import HeaderImage from 'src/assets/toktok/images/HeaderBackground.png';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

const INITIAL_RESULT = {
  payload: {
    success: null, // Means no result yet. Show Loading
  },
  predictions: [],
};

const SearchInput = ({onChangeText}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  }, []);

  return (
    <View
      style={{
        ...styles.inputBox,
        borderRadius: 5,
        bottom: -10,
        marginHorizontal: SIZE.MARGIN,
        borderWidth: 1,
        borderColor: COLOR.LIGHT,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={{flex: 1}}
          placeholder="Search the toktok app!"
          placeholderTextColor={COLOR.MEDIUM}
          ref={inputRef}
          onChangeText={onChangeText}
        />
        <FeatherIcon name="search" size={25} color={COLOR.DARK} />
      </View>
    </View>
  );
};

export const Header = ({setSearchResult, setSearchLoading, setSearchText, searchText}) => {
  const session = useSelector(state => state.session);
  const sessionToken = 'ABC123123';

  const navigation = useNavigation();

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
    if (searchText.length >= 3) {
      try {
        setSearchLoading(true);
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

        console.log('SEARCH RESULT-------------------------');

        setSearchResult(apiResult.data.data.getGooglePlaceAutocomplete);
        setSearchLoading(false);
      } catch (error) {
        setSearchLoading(false);
        // onSearchResultChange(ERROR_RESULT);
      }
    }
  };

  const debouncedGetGooglePlaceAutocomplete = useDebounce(
    value => getGooglePlaceAutocomplete({searchString: value}),
    1000,
  );

  const onChangeText = async value => {
    setSearchText(value);
    if (value.length >= 3) {
      debouncedGetGooglePlaceAutocomplete(value);
    } else {
      setSearchResult(INITIAL_RESULT);
    }
  };

  return (
    <View style={{height: 160, backgroundColor: 'white'}}>
      <ImageBackground style={{height: 130}} source={HeaderImage} resizeMode="cover">
        <TouchableOpacity style={styles.greetingBox} onPress={() => navigation.pop()}>
          <FIcon5 name="chevron-left" color={'black'} size={13} style={{marginLeft: 2}} />
        </TouchableOpacity>
        <SearchInput onChangeText={onChangeText} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  greetingBox: {
    height: 50,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
    paddingHorizontal: SIZE.MARGIN,
    width: 50,
  },
  greetingText: {
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
  },
});
