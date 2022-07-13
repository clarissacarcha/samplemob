import React, {useState, useEffect, useContext} from 'react';
import {Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput} from 'react-native';
import {VerifyContext} from '../VerifyContextProvider';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import {SearchInput, NoData, CustomSelectionList} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const ModalCity = ({type, data, selectedCity}) => {
  const [cities, setCities] = useState(data);

  const {
    province,
    modalCityVisible,
    city,
    setModalCityVisible,
    setCityId,
    setCity,
    changeVerifyAddressErrors,
    verifyAddressErrors,
  } = useContext(VerifyContext);
  const [filteredCities, setFilteredCities] = useState(cities);
  const [showList, setShowList] = useState(false);

  const selectCountry = index => {
    const city = filteredCities[index].citymunDesc;
    const cityId = filteredCities[index].id;
    setCity(city);
    setCityId(cityId);
    setModalCityVisible(false);
    setFilteredCities(cities);
    changeVerifyAddressErrors('cityError', '');
  };

  const renderCountry = ({item, index}) => {
    return (
      <>
        <TouchableOpacity onPress={() => selectCountry(index)} style={[styles.country]}>
          <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.citymunDesc}</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
      </>
    );
  };

  const filterSearch = value => {
    const filtered = cities.filter(city => city.citymunDesc.toLowerCase().includes(value.toLowerCase()));
    setFilteredCities(filtered);
  };

  const onSelectedValue = ({index}) => {
    selectCountry(index);
  };

  useEffect(() => {
    setCities(data);
    setFilteredCities(data);
  }, [data]);

  const onChangeValidation = () => {
    province != '' ? setShowList(true) : changeVerifyAddressErrors('provinceError', 'This is a required field');
  };

  return (
    <CustomSelectionList
      data={filteredCities}
      onSelectedValue={onSelectedValue}
      errorMessage={verifyAddressErrors.cityError}
      searchPlaceholder="Search your city"
      placeholder="Select City"
      withSearch={true}
      onSearchValue={filterSearch}
      hasDefault={true}
      selectedValue={city}
      hasValidation={true}
      onChangeValidation={onChangeValidation}
      showList={showList}
      setShowList={setShowList}
    />
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
  country: {
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
  countryText: {
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

export default ModalCity;
