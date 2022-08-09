import React, {createContext, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ADVERTISEMENTS} from 'toktokload/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {usePrompt} from 'src/hooks';
import {ErrorUtility} from 'toktokload/util';
import validator from 'validator';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children, navigation}) => {
  const {user} = useSelector(state => state.session);
  const formattedMobile = user?.username.replace('+63', '0');

  const [activeTab, setActiveTab] = useState(1);
  const [mobileNumber, setMobileNumber] = useState(formattedMobile);
  const [adHighlight, setAdHighlight] = useState([]);
  const [adsRegular, setAdsRegular] = useState([]);
  const [adsActions, setAdsAction] = useState({loading: false, error: {}});
  const [refreshing, setRefreshing] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState(null);
  const [onBoardingSteps, setOnboardingSteps] = useState(0);
  const [errorMessages, setErrorMessages] = useState({selection: '', inputField: ''});
  const prompt = usePrompt();

  const [getAdvertisements, {loading, error}] = useLazyQuery(GET_ADVERTISEMENTS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onCompleted: ({getAdvertisements}) => {
      let adHighlight = [];
      let adsRegular = [];

      getAdvertisements.map(ad => {
        if (ad.type == 1) adHighlight.push(ad);
        if (ad.type == 2) adsRegular.push(ad);
      });

      setAdHighlight(adHighlight);
      setAdsRegular(adsRegular);
      setRefreshing(false);
    },
    onError: error => {
      setRefreshing(false);
      // ErrorUtility.StandardErrorHandling({
      //   error,
      //   navigation,
      //   prompt,
      // });
    },
  });

  useEffect(() => {
    setAdsAction({loading, error});
  }, [loading, error]);

  const tabList = [
    {id: 1, name: 'Buy Load'},
    {id: 2, name: 'Favorites'},
  ];

  const changeErrorMessages = (key, errorMessage) => {
    setErrorMessages(oldstate => ({
      ...oldstate,
      [key]: errorMessage,
    }));
  };

  const checkDynamicField = (value, activeNetwork) => {
    if (value.length === 0) {
      return checkFieldIsEmpty('inputField', value);
    } else {
      let errorMessage =
        value.length != activeNetwork?.inputLength?.inputLength ? activeNetwork.inputLength.fieldPlaceholder : '';
      changeErrorMessages('inputField', errorMessage);
      return !errorMessage;
    }
  };

  const checkFieldIsEmpty = (key, value, fieldType) => {
    let message = fieldType === 'selection' ? 'Please make a selection' : 'This is a required field';
    let errorMessage = validator.isEmpty(value, {ignore_whitespace: true}) || value === 'null' ? message : '';

    changeErrorMessages(key, errorMessage);
    return !errorMessage;
  };

  return (
    <Provider
      value={{
        activeTab,
        setActiveTab,
        mobileNumber,
        setMobileNumber,
        tabList,
        adHighlight,
        adsRegular,
        adsActions,
        getAdvertisements,
        refreshing,
        setRefreshing,
        activeNetwork,
        setActiveNetwork,
        onBoardingSteps,
        setOnboardingSteps,
        errorMessages,
        setErrorMessages,
        checkFieldIsEmpty,
        changeErrorMessages,
        checkDynamicField,
      }}>
      {children}
    </Provider>
  );
};
