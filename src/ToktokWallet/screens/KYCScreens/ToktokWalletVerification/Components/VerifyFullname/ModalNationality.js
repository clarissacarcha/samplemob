import React, {useState, useContext, useEffect} from 'react';
import {Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform} from 'react-native';
import {VerifyContext} from '../VerifyContextProvider';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import {Separator, SearchInput, CustomSelectionList} from 'toktokwallet/components';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_COUNTRIES} from 'toktokwallet/graphql/virtual';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {NoData} from 'toktokwallet/components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const ModalNationality = ({verifyFullNameErrors}) => {
  const {setNationality, setNationalityId, changeAddress, nationality} = useContext(VerifyContext);
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

  const onSelectedValue = ({index}) => {
    selectNationality(index);
  };

  return (
    <CustomSelectionList
      data={filteredNationalities}
      onSelectedValue={onSelectedValue}
      errorMessage={verifyFullNameErrors.nationalityError}
      placeholder="Search your nationality"
      withSearch={true}
      onSearchValue={filterSearch}
      hasDefault={true}
      defaultCondition={'nationality'}
      selectedValue={nationality}
    />
  );
};

export default ModalNationality;
