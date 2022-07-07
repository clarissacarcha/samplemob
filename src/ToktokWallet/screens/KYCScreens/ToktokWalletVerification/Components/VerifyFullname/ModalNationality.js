import React, {useState, useContext, useEffect} from 'react';
import {Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform} from 'react-native';
import {VerifyContext} from '../VerifyContextProvider';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import {Separator, SearchInput} from 'toktokwallet/components';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_COUNTRIES} from 'toktokwallet/graphql/virtual';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {NoData} from 'toktokwallet/components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const ModalNationality = ({visible, setVisible}) => {
  const {setNationality, setNationalityId, changeAddress} = useContext(VerifyContext);
  const [nationalities, setNationalities] = useState([]);
  const [filteredNationalities, setFilteredNationalities] = useState([]);
  const [countryIndex, setCountryIndex] = useState(20);
  const [search, setSearch] = useState('');

  const [getCountries, {data, error, loading}] = useLazyQuery(GET_COUNTRIES, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      const countries = response.getCountries;
      const nationality = 'Filipino';
      countries.sort((x, y) => {
        return x.nationality === nationality ? -1 : y.nationality === nationality ? 1 : 0;
      });
      setNationalities(countries);
      setFilteredNationalities(countries);
    },
    onError: error => {
      console.log(JSON.stringify(error));
    },
  });

  useEffect(() => {
    if (search == '') {
      getCountries();
    }
  }, [search]);

  const selectNationality = index => {
    const country = filteredNationalities[index];
    setNationality(country.nationality);
    setNationalityId(country.id);
    setVisible(false);
    setFilteredNationalities(nationalities);
  };

  const filterSearch = value => {
    const filtered = nationalities.filter(country => country.nationality.toLowerCase().includes(value.toLowerCase()));
    setFilteredNationalities(filtered);
    setSearch(value);
  };

  const setAdditionalCountries = () => {
    setFilteredNationalities(state => [...state, ...nationalities.slice(countryIndex + 1, countryIndex + 20)]);
    setCountryIndex(state => state + 20);
  };

  const renderNationality = ({item, index}) => {
    return (
      <>
        <TouchableOpacity onPress={() => selectNationality(index)} style={[styles.nationality]}>
          <Text style={styles.nationalityText}>{item.nationality}</Text>
          {item.nationality === 'Filipino' && <Text style={styles.default}>(Default)</Text>}
        </TouchableOpacity>
        <View style={styles.divider} />
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        setFilteredNationalities(nationalities);
      }}
      style={styles.container}
      animationType="slide">
      <View style={[styles.content, {marginTop: Platform.OS === 'ios' ? getStatusbarHeight : moderateScale(15)}]}>
        <View style={{flexDirection: 'row', marginHorizontal: 16}}>
          <TouchableOpacity onPress={() => setVisible(false)} style={styles.center}>
            <FIcon name="chevron-left" size={16} color={COLOR.ORANGE} />
          </TouchableOpacity>
          <SearchInput
            containerStyle={styles.search}
            placeholder="Search your nationality"
            placeholderTextColor={'#525252'}
            onChangeText={filterSearch}
            search={search}
            onClear={() => setSearch('')}
          />
        </View>
        <FlatList
          style={{marginVertical: 15}}
          data={filteredNationalities}
          keyExtractor={nationality => nationality.id}
          renderItem={renderNationality}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return <NoData type="search" title="No Results Found" label="Try to search something similar." />;
          }}
          contentContainerStyle={{flexGrow: 1, marginBottom: getStatusbarHeight}}
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
    marginTop: 15,
  },
  search: {
    marginLeft: 16,
    flex: 1,
  },
  input: {
    fontFamily: FONT.REGULAR,
    flex: 1,
    height: '100%',
    width: '100%',
    fontSize: FONT_SIZE.M,
    backgroundColor: '#F7F7FA',
    paddingLeft: 10,
    borderRadius: 5,
    color: COLOR.DARK,
  },
  nationality: {
    height: SIZE.FORM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLOR.LIGHT,
  },
  nationalityText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  default: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: '#9E9E9E',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModalNationality;
