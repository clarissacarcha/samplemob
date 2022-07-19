import React, {forwardRef, useMemo, useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SOURCE_OF_INCOME} from 'toktokwallet/graphql';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';
import CONSTANTS from 'common/res/constants';
import {CustomSelectionList} from 'toktokwallet/components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const SourceOfIncome = ({changeIncomeInfo, changeVerifyFullNameErrors, verifyFullNameErrors, selectedValue}) => {
  const snapPoints = useMemo(() => [0, 550], []);
  const alert = useAlert();
  const [filteredSourceOfIncome, setFilteredSourceOfIncome] = useState([]);

  const [getSourceOfIncome] = useLazyQuery(GET_SOURCE_OF_INCOME, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getSourceOfIncome}) => {
      const data = [...getSourceOfIncome, {id: '0', description: 'Others'}];
      setFilteredSourceOfIncome(data);
    },
    onError: error => {
      onErrorAlert({alert, error});
    },
  });

  const onSelectedValue = ({index}) => {
    if (filteredSourceOfIncome[index].id == '0') {
      changeIncomeInfo('otherSource', '');
    }
    changeIncomeInfo('source', filteredSourceOfIncome[index]);
    changeVerifyFullNameErrors('sourceIncomeError', '');
  };

  useEffect(() => getSourceOfIncome(), []);

  return (
    <CustomSelectionList
      data={filteredSourceOfIncome}
      onSelectedValue={onSelectedValue}
      errorMessage={verifyFullNameErrors.sourceIncomeError}
      placeholder="Select Source of Income"
      selectedValue={selectedValue}
    />
  );
};

export default SourceOfIncome;
