import React, {useState, useEffect} from 'react';
import {Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform} from 'react-native';
import AIcon from 'react-native-vector-icons/dist/AntDesign';
import {SIZES, INPUT_HEIGHT, FONTS, COLORS} from '../../../../../../res/constants';
import {COLOR} from '../../../../../../res/variables';
import FIcon from 'react-native-vector-icons/Feather';

import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_MALL_GRAPHQL_CLIENT} from '../../../../../../graphql';
import {
  GET_CITIES_BY_PROVINCES,
  GET_PROVINCES_BY_REGIONS,
  GET_REGIONS,
} from '../../../../../../graphql/toktokmall/model/Address';

export const SelectAddressModal = ({isVisible, setIsVisible, type, setSelected, data}) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    } else {
      setFilteredData([]);
    }
  }, [data]);

  useEffect(() => {
    if (!isVisible) {
      setFilteredData([]);
    }
  }, [isVisible]);

  const onPress = item => {
    setSelected(item);
    setIsVisible(false);
  };

  const filterSearch = value => {
    if (type === 'reg') {
      const filtered = data.filter(item => item.regDesc.toLowerCase().includes(value.toLowerCase()));
      setFilteredData(filtered);
    } else if (type === 'prov') {
      const filtered = data.filter(item => item.provDesc.toLowerCase().includes(value.toLowerCase()));
      setFilteredData(filtered);
    } else if (type === 'city') {
      const filtered = data.filter(item => item.citymunDesc.toLowerCase().includes(value.toLowerCase()));
      setFilteredData(filtered);
    }
  };
  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false);
        setFilteredData(cities);
      }}
      style={styles.container}
      animationType="slide">
      <View style={styles.content}>
        <TouchableOpacity onPress={() => setIsVisible(false)} style={{justifyContent: 'center', alignItems: 'center'}}>
          <FIcon name="chevron-down" size={20} />
        </TouchableOpacity>
        <View style={styles.search}>
          <TextInput
            placeholder={type === 'reg' ? 'Select Region' : type === 'prov' ? 'Select Province' : 'Select City'}
            placeholderTextColor="gray"
            style={styles.input}
            onChangeText={filterSearch}
          />
          <FIcon style={{alignSelf: 'center', position: 'absolute', right: 25}} name={'search'} size={24} />
        </View>

        <FlatList
          style={{marginVertical: 15}}
          data={filteredData}
          keyExtractor={city => city.id}
          renderItem={({item}) => (
            <>
              <TouchableOpacity onPress={() => onPress(item)} style={[styles.country]}>
                <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M, textTransform: 'capitalize'}}>
                  {item.citymunDesc || item.provDesc || item.regDesc}
                </Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 45 : 15,
  },
  search: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 10,
  },
  input: {
    fontFamily: FONTS.REGULAR,
    flex: 1,
    height: '100%',
    width: '100%',
    fontSize: SIZES.M,
    backgroundColor: '#F7F7FA',
    paddingLeft: 10,
    borderRadius: 5,
    color: COLORS.DARK,
  },
  country: {
    height: INPUT_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLOR.LIGHT,
  },
});
