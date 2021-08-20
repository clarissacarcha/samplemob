import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, StyleSheet, TextInput, Image, Text, Platform} from 'react-native';

import {searchIcon} from '../assets/images';
import {FONT, FONT_SIZE, COLOR} from '../../res/variables';

// State must be global to share with other components
const HeaderSearchBox = (props) => {
  const {onSearch} = props;

  const routes = useRoute();
  const navigation = useNavigation();

  const [foodQuery, setFoodQuery] = useState('');

  // The navigation must not trigger on ToktokFood search page.
  const isForSearchPage = () => typeof routes.params?.isSearchPage !== 'undefined';

  const showSearchPage = () => {
    navigation.navigate('ToktokFoodSearch', {isSearchPage: true});
  };

  const PlaceHolderSearchBox = () => {
    return (
      <View onTouchStart={() => showSearchPage()} style={styles.searchBoxContainer}>
        <View style={[styles.textInputWrapper, styles.searchBoxShadow]}>
          <Image style={styles.searchBoxIcon} source={searchIcon} />
          <View style={[styles.searchBox, styles.textInputFontStyles]}>
            <Text style={styles.placeholderText}>What would you like to eat?</Text>
          </View>
        </View>
      </View>
    );
  };

  const SearchBox = () => {
    return (
      <View style={styles.searchBoxContainer}>
        <View style={[styles.textInputWrapper, styles.searchBoxShadow]}>
          <Image style={styles.searchBoxIcon} source={searchIcon} />
          <TextInput
            value={foodQuery}
            multiline={false}
            autoFocus={true}
            placeholder="What would you like to eat?"
            onChangeText={(text) => {
              onSearch(text);
              setFoodQuery(text); // array of food object
            }}
            style={[styles.searchBox, styles.textInputFontStyles]}
          />
        </View>
      </View>
    );
  };

  return <>{isForSearchPage() ? <SearchBox /> : <PlaceHolderSearchBox />}</>;
};

export default HeaderSearchBox;

const styles = StyleSheet.create({
  searchBoxContainer: {
    left: 0,
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
  },
  searchBox: {
    height: 49,
    width: '100%',
    paddingEnd: 10,
    borderRadius: 13,
    paddingStart: 42,
    backgroundColor: '#FFF',
  },
  searchBoxShadow: {
    shadowColor: '#949494',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInputFontStyles: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
  },
  textInputWrapper: {
    height: 50,
    width: '93%',
    display: 'flex',
    borderRadius: 13,
    position: 'relative',
    flexDirection: 'row',
  },
  searchBoxIcon: {
    left: 13,
    width: 20,
    height: 20,
    zIndex: 99,
    alignSelf: 'center',
    position: 'absolute',
  },
  placeholderText: {
    color: COLOR.DARK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    marginTop: Platform.OS === 'ios' ? 15 : 13,
  },
});
