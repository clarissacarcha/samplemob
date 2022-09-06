import React, {useCallback, useEffect, useMemo, useRef, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import {VerifyContext} from '../VerifyContextProvider';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_IDENTIFICATION_CARDS} from 'toktokwallet/graphql/virtual';
import CONSTANTS from 'common/res/constants';
import {CustomSelectionList} from 'toktokwallet/components';
import {ListModal} from '../../../../../components/Modals';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const BottomSheetIDType = ({
  visibleSOIModal,
  setVisibleSOIModal,
  changeVerifyID,
  changeVerifyIDErrors,
  verifyIDErrors,
  selectedValue,
}) => {
  const snapPoints = useMemo(() => [0, 550], []);
  const constants = useSelector(state => state.constants);
  const {setIdentificationId, setIsbackRequired, setFrontImage, setBackImage} = useContext(VerifyContext);
  const [filteredValidID, setFilteredValidID] = useState([]);
  const ref = useRef();
  const [getIdentificationCards, {error, loading}] = useLazyQuery(GET_IDENTIFICATION_CARDS, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setFilteredValidID(response.getIdentificationCards);
    },
    onError: err => {
      console.log(err);
    },
  });

  useEffect(() => {
    getIdentificationCards();
  }, []);

  const onSelectedValue = ({index}) => {
    const validID = filteredValidID[index];
    changeVerifyID('idType', validID.name);
    changeVerifyID('idNumber', '');
    setIdentificationId(validID.id);
    setIsbackRequired(validID.isBackRequired == 1);
    changeVerifyIDErrors('idError', '');
    changeVerifyIDErrors('idNumberError', '');
    changeVerifyIDErrors('idFrontError', '');
    changeVerifyIDErrors('idBackError', '');
    setFrontImage(null);
    setBackImage(null);
  };

  return (
    <CustomSelectionList
      data={filteredValidID}
      errorMessage={verifyIDErrors.idError}
      placeholder="Select ID Type"
      onSelectedValue={onSelectedValue}
      selectedValue={selectedValue}
    />
  );
};

const styles = StyleSheet.create({
  box: {
    marginBottom: 20,
  },
  sheet: {
    paddingHorizontal: 16,
  },
  spacing: {height: 2},
  validID: {
    height: SIZE.FORM_HEIGHT,
    justifyContent: 'center',
    borderBottomWidth: 0.2,
    borderColor: 'silver',
    paddingHorizontal: 12,
  },
});

export default BottomSheetIDType;
