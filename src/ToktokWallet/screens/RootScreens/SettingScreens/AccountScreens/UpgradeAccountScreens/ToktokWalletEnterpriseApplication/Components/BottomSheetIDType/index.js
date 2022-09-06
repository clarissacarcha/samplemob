import React, {useEffect, useState, useContext} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ID_CARDS} from 'toktokwallet/graphql/';
import {ContextEnterpriseApplication} from '../ContextProvider';
import {CustomSelectionList} from 'toktokwallet/components';

export const BottomSheetIDType = ({onChange, idIndex, validID1, validID2, selectedValue, errorMessage}) => {
  const [filteredValidID, setFilteredValidID] = useState([]);
  const {setValidID1, setValidID2} = useContext(ContextEnterpriseApplication);

  const [getIDCards] = useLazyQuery(GET_ID_CARDS, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      let IDList = response.getIDCards;
      // if(validID1.IDType != ""){
      //   IDList = IDList.filter((validID)=>validID1.IDType != validID.id)
      // }
      // if(validID2.IDType != ""){
      //   IDList = IDList.filter((validID)=>validID2.IDType != validID.id)
      // }
      setFilteredValidID(IDList);
    },
    onError: err => {
      console.log(err);
    },
  });

  useEffect(() => {
    getIDCards();
  }, [onChange, getIDCards]);

  const selectValidID = ({index}) => {
    const input = {
      IDType: filteredValidID[index].id,
      IDTypeDescription: filteredValidID[index].name,
      isBackRequired: filteredValidID[index].isBackRequired,
      backErrorMessage: '',
      frontErrorMessage: '',
      name: '',
      frontFilename: '',
      frontFile: null,
      backFilename: '',
      backFile: null,
    };
    if (idIndex === 1) {
      setValidID1(state => {
        return {...state, ...input};
      });
    } else {
      setValidID2(state => {
        return {...state, ...input};
      });
    }
  };

  return (
    <CustomSelectionList
      data={filteredValidID}
      placeholder="Select ID Type"
      onSelectedValue={selectValidID}
      selectedValue={selectedValue}
      errorMessage={errorMessage}
      multiple={true}
      removeValue={idIndex === 1 ? validID2.IDTypeDescription : validID1.IDTypeDescription}
    />
  );
};
