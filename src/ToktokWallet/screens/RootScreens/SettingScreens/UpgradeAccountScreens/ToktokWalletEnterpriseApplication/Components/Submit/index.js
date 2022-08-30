import React, {useContext} from 'react';
import {PreviousNextButton} from 'toktokwallet/components';
import {ContextEnterpriseApplication} from '../ContextProvider';

export const ValidateRequirements = context => {
  const {forms, setFileError, validID1, validID2, setValidID1, setValidID2} = context;

  let noError = true;
  if (forms[0].filename == '') {
    setFileError(0, 'Business Permit is required');
    noError = false;
  }
  if (forms[1].filename == '') {
    setFileError(1, 'DTI Certificate of Registration is required');
    noError = false;
  }
  if (forms[2].filename == '') {
    setFileError(2, 'BIR 2303 Form is required');
    noError = false;
  }
  if (forms[3].filename == '') {
    setFileError(3, 'Barangay Permit is required');
    noError = false;
  }

  if (validID1.IDTypeDescription == '') {
    setValidID1(state => ({...state, frontErrorMessage: 'Please make a selection'}));
    noError = false;
  }

  if (validID1.frontFilename == '' && validID1.IDTypeDescription != '') {
    setValidID1(state => ({...state, frontErrorMessage: 'Photo is required'}));
    noError = false;
  }

  if (validID1.isBackRequired && validID1.backFilename == '' && validID1.IDTypeDescription != '') {
    setValidID1(state => ({...state, backErrorMessage: 'Photo is required'}));
    noError = false;
  }

  if (validID2.IDTypeDescription == '') {
    setValidID2(state => ({...state, frontErrorMessage: 'Please make a selection'}));
    noError = false;
  }

  if (validID2.frontFilename == '' && validID2.IDTypeDescription != '') {
    setValidID2(state => ({...state, frontErrorMessage: 'Photo is required'}));
    noError = false;
  }

  if (validID2.isBackRequired && validID2.backFilename == '' && validID2.IDTypeDescription != '') {
    setValidID2(state => ({...state, backErrorMessage: 'Photo is required'}));
    noError = false;
  }

  return noError;
};

export const Submit = () => {
  const {forms, validID1, validID2, setFileError, setValidID1, setValidID2, pepInfo, setCurrentIndex} =
    useContext(ContextEnterpriseApplication);

  const onPress = () => {
    const noError = ValidateRequirements({
      forms,
      setFileError,
      validID1,
      validID2,
      setValidID1,
      setValidID2,
    });

    if (noError) {
      setCurrentIndex(state => state + 1);
    }
  };

  const Previous = () => setCurrentIndex(state => state - 1);

  return (
    <>
      <PreviousNextButton
        label="Previous"
        labelTwo={'Next'}
        hasShadow
        onPressNext={onPress}
        onPressPrevious={Previous}
      />
    </>
  );
};
