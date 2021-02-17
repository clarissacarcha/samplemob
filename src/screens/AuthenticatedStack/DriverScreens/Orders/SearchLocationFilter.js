import React, {useState} from 'react';
import {View, Text, TextInput, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {HeaderBack, HeaderTitle} from '../../../../components';
import {COLOR, DARK, LIGHT, MEDIUM} from '../../../../res/constants';
import {GET_DELIVERY_LOCATION_FILTERS} from '../../../../graphql/model';
import _ from 'lodash';

const SearchLocationFilter = ({navigation, route}) => {
  const {setLocationFilter, onSelectLocationCallback, setIsSearching} = route.params;

  navigation.setOptions({
    headerTitle: () => <HeaderTitle label={['Search', 'Location']}/>,
    headerLeft: () => (
      <HeaderBack
        onBack={() => {
          navigation.pop();
          setIsSearching(true);
        }}
      />
    ),
  });

  const [searchString, setSearchString] = useState('');
  const [searchLocations, setSearchLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const {data, loading, error} = useQuery(GET_DELIVERY_LOCATION_FILTERS, {
    fetchPolicy: 'network-only',
    onCompleted: ({getDeliveryLocationFilters}) => {
      setSearchLocations(getDeliveryLocationFilters);
      setFilteredLocations(getDeliveryLocationFilters);
    },
  });

  const onSearchChange = value => {
    setSearchString(value);
    const filtered = searchLocations.filter(location => location.toLowerCase().includes(value.toLowerCase()));
    setFilteredLocations(filtered);
  };

  const onLocationSelect = value => {
    navigation.pop();
    setLocationFilter(value);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  return (
    <View style={{padding: 20, flex: 1, paddingBottom: 0}}>
      <TextInput
        value={searchString}
        onChangeText={onSearchChange}
        style={styles.input}
        placeholder="Search Location"
        placeholderTextColor={LIGHT}
        returnKeyType="done"
      />
      <FlatList
        showsVerticalScrollIndicator={true}
        data={filteredLocations}
        keyExtractor={(item, index) => index}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}>
              <TouchableOpacity
                onPress={() => {
                  onSelectLocationCallback(item);
                  navigation.pop();
                }}>
                <Text
                  style={{
                    paddingLeft: 20,
                    paddingVertical: 20,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default SearchLocationFilter;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    height: 50,
    color: DARK,
  },
});
