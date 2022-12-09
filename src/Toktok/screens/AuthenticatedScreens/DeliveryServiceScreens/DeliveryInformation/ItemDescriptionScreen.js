import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Image, StatusBar, FlatList, Dimensions} from 'react-native';

// helper
import {ThrottledOpacity} from '../../../../../components_section';
import CONSTANTS from '../../../../../common/res/constants';
import {connect} from 'react-redux';

// assets
import BackIcon from '../../../../../assets/icons/arrow-left-icon.png';
import SearchIcon from '../../../../../assets/images/SearchIcon.png';
import ClearTextIcon from '../../../../../assets/icons/EraseTextInput.png';
import EmptyDataImg from '../../../../../assets/images/empty-search.png';

const graphicWidth = Dimensions.get('window').width * 0.5;
const {COLOR, FONT_SIZE, FONT_FAMILY} = CONSTANTS;

const ItemDescriptionScreen = ({route, navigation}) => {
  const {setItemDescription, topThree, setTopThree, arrCopy, setArrCopy} = route.params;
  const [searchedValue, setSearchedValue] = useState('');
  const [data, setData] = useState(arrCopy);

  const onItemPress = item => {
    if (!topThree.includes(item)) {
      topThree.unshift(item);
      topThree.pop();
    }

    const itemsToDeleteSet = new Set(topThree);
    const newArr = arrCopy.filter(item => {
      return !itemsToDeleteSet.has(item);
    });

    const newItemsList = topThree.concat(newArr.sort());
    setTopThree(topThree);
    setArrCopy(newItemsList);
    setItemDescription(item);
    navigation.pop();
  };

  const handleSearch = input => {
    setSearchedValue(input);
    const filteredData = arrCopy.filter(el => el.toLowerCase().includes(input.toLowerCase()));
    setData(filteredData);
  };

  const clearSearchField = () => {
    setSearchedValue('');
    setData(arrCopy);
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <ThrottledOpacity onPress={() => navigation.pop()}>
          <Image source={BackIcon} resizeMode={'contain'} style={styles.backIcon} />
        </ThrottledOpacity>
        <View style={styles.headerContainer}>
          <Image source={SearchIcon} resizeMode={'contain'} style={styles.searchIcon} />
          <TextInput
            value={searchedValue}
            onChangeText={input => handleSearch(input)}
            style={{flex: 0.9}}
            placeholder="Search"
            placeholderTextColor="gray"
          />
          <ThrottledOpacity onPress={clearSearchField}>
            <Image source={ClearTextIcon} resizeMode={'contain'} style={styles.searchIcon} />
          </ThrottledOpacity>
        </View>
      </View>

      {data.length == 0 && (
        <View style={styles.noFoundContainer}>
          <Image source={EmptyDataImg} resizeMode={'contain'} style={styles.noFoundImage} />
          <Text style={styles.noFoundText}>No results found</Text>
          <Text>Try to search something similar.</Text>
        </View>
      )}
      {data.length > 0 && (
        <FlatList
          style={{backgroundColor: 'white', padding: 16}}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={item => item}
          renderItem={({item, index}) => {
            const lastItem = index == data.length - 1 ? true : false;
            return (
              <ThrottledOpacity onPress={() => onItemPress(item)}>
                <Text style={{padding: 16}}>{item}</Text>
                {!lastItem && <View style={{height: 1, backgroundColor: COLOR.LIGHT}} />}
              </ThrottledOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(ItemDescriptionScreen);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: StatusBar.currentHeight + 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  backIcon: {
    width: 15,
    height: 15,
    marginRight: 16,
  },
  headerContainer: {
    backgroundColor: COLOR.MEDIUM_DARK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 16,
  },
  searchIcon: {
    width: 15,
    height: 15,
  },
  noFoundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  noFoundImage: {
    width: graphicWidth,
    height: graphicWidth,
  },
  noFoundText: {
    fontSize: FONT_SIZE.XL + 1,
    color: COLOR.ORANGE,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
  },
});
