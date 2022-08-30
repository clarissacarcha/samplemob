import React, {useState, useContext, useEffect} from 'react';
import {Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput} from 'react-native';
import {VerifyContext} from '../VerifyContextProvider';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import {SearchInput, NoData, CustomSelectionList} from 'toktokwallet/components';
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_PROVINCES} from 'toktokwallet/graphql/virtual';
import CONSTANTS from 'common/res/constants';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const ModalProvince = ({type, onSelect}) => {
  const {
    modalProvinceVisible,
    province,
    setModalProvinceVisible,
    setProvince,
    setProvinceId,
    setCity,
    setCityId,
    changeVerifyAddressErrors,
    verifyAddressErrors,
  } = useContext(VerifyContext);

  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [getProvinces, {error, loading}] = useLazyQuery(GET_PROVINCES, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setFilteredProvinces(response.getProvinces);
      setProvinces(response.getProvinces);
      // console.log("Provinces", response)
    },
    onError: err => {
      console.log(err);
    },
  });

  useEffect(() => {
    getProvinces();
  }, []);

  const selectCountry = index => {
    const province = filteredProvinces[index].provDesc;
    const provinceId = filteredProvinces[index].id;
    setProvince(province);
    setProvinceId(provinceId);
    setCity('');
    setCityId('');
    getCitiesOfProvince(filteredProvinces[index].provCode);
    setModalProvinceVisible(false);
    setFilteredProvinces(provinces);
    changeVerifyAddressErrors('provinceError', '');
  };

  const filterSearch = value => {
    const filtered = provinces.filter(province => province.provDesc.toLowerCase().includes(value.toLowerCase()));
    setFilteredProvinces(filtered);
  };

  const getCitiesOfProvince = code => {
    onSelect(code);
  };

  const onSelectedValue = ({index}) => {
    selectCountry(index);
  };

  return (
    <CustomSelectionList
      data={filteredProvinces}
      onSelectedValue={onSelectedValue}
      errorMessage={verifyAddressErrors.provinceError}
      searchPlaceholder="Search your province"
      placeholder="Select Province"
      withSearch={true}
      onSearchValue={filterSearch}
      hasDefault={true}
      selectedValue={province}
    />
  );
};

export default ModalProvince;
