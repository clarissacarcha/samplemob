import React from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {ThrottledOpacity} from '../../../../../components_section';
import FIcons from 'react-native-vector-icons/Fontisto';
import DestinationIcon from '../../../../../assets/icons/DestinationIcon.png';
import ClearTextInput from '../../../../../assets/icons/EraseTextInput.png';
import CONSTANTS from '../../../../../common/res/constants';
import {useDispatch} from 'react-redux';

const SearchBar = ({setSearchValue, setAddressList, searchValue, onPressSearch, dispatch}) => {
  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE, paddingHorizontal: 16, marginBottom: 15}}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 19}}>
        <View style={styles.containerInput}>
          <Image source={DestinationIcon} style={{height: 20, width: 20, marginLeft: 12}} resizeMode={'contain'} />

          <TextInput
            onChangeText={query => {
              setSearchValue(query);
              setAddressList([]);
            }}
            style={styles.input}
            placeholder={'Enter location'}
            value={searchValue}
            onSubmitEditing={onPressSearch}
          />

          <ThrottledOpacity
            delay={500}
            style={{padding: 8}}
            onPress={() => {
              dispatch({type: 'SET_PICKUP_ADDRESS', value: ''});
              setSearchValue('');
              setAddressList([]);
            }}>
            {/* {loading == true ? (
                <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
              ) : ( */}
            {searchValue != '' && (
              <Image source={ClearTextInput} style={{height: 10, width: 10}} resizeMode={'contain'} />
            )}
            {/*  )} */}
          </ThrottledOpacity>
        </View>
        <ThrottledOpacity
          onPress={onPressSearch}
          style={{padding: 12, backgroundColor: CONSTANTS.COLOR.ORANGE, borderRadius: 5, marginLeft: 8}}>
          <FIcons name={'search'} size={15} color={CONSTANTS.COLOR.WHITE} />
        </ThrottledOpacity>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  containerInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  input: {
    marginLeft: 12,
    color: CONSTANTS.COLOR.BLACK,
    width: '75%',
    paddingVertical: 12,
  },
});
