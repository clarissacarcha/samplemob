import React, {useState, useContext, useEffect} from 'react';
import {VerifyContext} from '../VerifyContextProvider';
import {CustomSelectionList} from 'toktokwallet/components';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_COUNTRIES} from 'toktokwallet/graphql/virtual';

const ModalNationality = ({verifyFullNameErrors}) => {
  const {setNationality, setNationalityId, nationality} = useContext(VerifyContext);
  const [nationalities, setNationalities] = useState([]);
  const [filteredNationalities, setFilteredNationalities] = useState([]);
  // const [countryIndex, setCountryIndex] = useState(20);
  const [search, setSearch] = useState('');

  const [getCountries] = useLazyQuery(GET_COUNTRIES, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      const countries = response.getCountries;
      const defaultNationality = 'Filipino';

      countries.sort((x, y) => {
        return x.nationality > y.nationality;
      });
      countries.sort((x, y) => {
        const sorted = y.nationality === defaultNationality ? 1 : 0;
        return x.nationality === defaultNationality ? -1 : sorted;
      });

      //REMOVE UNITED STATES MINOR OUTLYING ISLANDS
      const findIndex = countries.findIndex(item => item.iso2 === 'UM');
      countries.splice(findIndex, 1);

      setNationalities(countries);
      setFilteredNationalities(countries);
    },
    onError: error => {
      console.log(JSON.stringify(error));
    },
  });

  useEffect(() => {
    if (search === '') {
      getCountries();
    }
  }, [search, getCountries]);

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

  // const setAdditionalCountries = () => {
  //   setFilteredNationalities(state => [...state, ...nationalities.slice(countryIndex + 1, countryIndex + 20)]);
  //   setCountryIndex(state => state + 20);
  // };

  const onSelectedValue = ({index}) => {
    selectNationality(index);
  };

  return (
    <CustomSelectionList
      data={filteredNationalities}
      onSelectedValue={onSelectedValue}
      errorMessage={verifyFullNameErrors.nationalityError}
      searchPlaceholder="Search your nationality"
      withSearch={true}
      onSearchValue={filterSearch}
      hasDefault={true}
      defaultCondition={'Filipino'}
      selectedValue={nationality}
    />
  );
};

export default ModalNationality;
