import React, {createContext, useState} from 'react';
import {useSelector} from 'react-redux';
//Steps Components
import {
  VerifyFullname,
  VerifyAddress,
  VerifyID,
  VerifySelfie,
  VerifySelfieWithID,
  PepQuestionnaire,
  PepRequestVideoCall,
  Confirm,
} from "../../Components"

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

const citiesList = [];

export const VerifyContextProvider = ({children}) => {
  const session = useSelector(state => state.session);

  const [modalCountryVisible, setModalCountryVisible] = useState(false);
  const [modalProvinceVisible, setModalProvinceVisible] = useState(false);
  const [modalCityVisible, setModalCityVisible] = useState(false);

  const [fullname, setFullname] = useState(
    `${session.user.person.firstName} ${session.user.person.middleName ? session.user.person.middleName + ' ' : ''}${
      session.user.person.lastName
    }`,
  );
  const [person, setPerson] = useState({
    firstName: session.user.person.firstName,
    middleName: session.user.person.middleName ? session.user.person.middleName : '',
    lastName: session.user.person.lastName,
    gender: '',
    hasMiddleName: true,
  });
  const [contactInfo, setContactInfo] = useState({
    mobile_number: session.user.username,
    email: session.user.person.emailAddress,
  });
  const [nationality, setNationality] = useState('Filipino');
  const [nationalityId, setNationalityId] = useState(173); // Default Philippines from database
  const [birthInfo, setBirthInfo] = useState({
    birthdate: '',
    birthPlace: '',
  });
  const [incomeInfo, setIncomeInfo] = useState({
    source: '',
    otherSource: '',
    occupation: '',
  });

  const [verifyFullNameErrors, setVerifyFullNameErrors] = useState({
    firstNameError: '',
    middleNameError: '',
    lastNameError: '',
    genderError: '',
    emailError: '',
    nationality: '',
    birthdateError: '',
    birthPlaceError: '',
    sourceIncomeError: '',
    otherSourceError: '',
    occupationError: '',
  });

  const [address, setAddress] = useState({
    country: 'Philippines',
    line1: '',
    line2: '',
    postalCode: '',
    countryId: 175,
  });

  const [verifyAddressErrors, setVerifyAddressErrors] = useState({
    streetError: '',
    barangayError: '',
    provinceError: '',
    cityError: '',
    postalError: ''
  })

  const [province, setProvince] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [city, setCity] = useState('');
  const [cityId, setCityId] = useState('');

  const [verifyID, setVerifyID] = useState({
    idType: '',
    idImage: null,
    idCountry: 'Philippines',
    idNumber: '',
    idID: '',
  });
  const [identificationId, setIdentificationId] = useState(null);

  const [selfieImage, setSelfieImage] = useState(null);
  const [tempSelfieImage, setTempSelfieImage] = useState(null);
  const [selfieImageWithID, setSelfieImageWithID] = useState(null);
  const [tempSelfieImageWithID, setTempSelfieImageWithID] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [isBackRequired, setIsbackRequired] = useState(false);
  const [cities, setCities] = useState(citiesList);
  const [provinceCities, setProvinceCities] = useState([]);

  const [pepInfo, setPepInfo] = useState({
    isPep: false,
    questionnaire: {
      isPep: '',
      pepPosition: '',
      isFamilyPep: '',
      familyPepPosition: '',
      sourceOfIncomeId: '',
      sourceOfIncomeDes: '',
      sourceOfIncome: '',
      sourceOfWealthId: '',
      sourceOfWealthDes: '',
      sourceOfWealth: '',
    },
    videocall: {
      videoCallContactDetails: '',
      callChannelId: '',
      callChannel: '',
      preferredVcsDayMin: '',
      preferredVcsDayMax: '',
      preferredVcsTimeMin: '',
      preferredVcsTimeMax: '',
    },
  });

  const changePersonInfo = (key, value) => {
    setPerson(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeContactInfo = (key, value) => {
    setContactInfo(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeBirthInfo = (key, value) => {
    setBirthInfo(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeVerifyFullNameErrors = (key, value) => {
    setVerifyFullNameErrors(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeVerifyAddressErrors = (key, value) => {
    setVerifyAddressErrors(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };
  

  const changeAddress = (key, value) => {
    setAddress(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeVerifyID = (key, value) => {
    setVerifyID(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeProvinceCities = data => {
    setProvinceCities([...data]);
  };

  const changeIncomeInfo = (key, value) => {
    setIncomeInfo(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const [cacheImagesList, setCacheImagesList] = useState([]);

  // States for Steps rendering
  const [currentIndex, setCurrentIndex] = useState(0);
  const defaultStepsScreens = [
    <VerifyFullname/>,
    <VerifyAddress/>,
    <VerifyID/>,
    <VerifySelfie/>,
    <VerifySelfieWithID/>,
    <Confirm/>,
  ]
  const pepSreens = [
    <PepQuestionnaire/>,
    <PepRequestVideoCall/>
  ]
  
  const [stepsScreens , setStepScreens] = useState(defaultStepsScreens)
  const appendPepScreens = ()=> {
    setStepScreens([
      <VerifyFullname/>,
      <VerifyAddress/>,
      <VerifyID/>,
      <VerifySelfie/>,
      <VerifySelfieWithID/>,
      ...pepSreens,
      <Confirm/>,
    ])
  }

  const resetStepScreens = ()=> {
    setStepScreens(defaultStepsScreens)
  }

  return (
    <Provider
      value={{
        currentIndex,
        setCurrentIndex,
        fullname,
        setFullname,
        nationality,
        setNationality,
        nationalityId,
        setNationalityId,
        contactInfo,
        changeContactInfo,
        birthInfo,
        changeBirthInfo,
        address,
        changeAddress,
        province,
        setProvince,
        provinceId,
        setProvinceId,
        city,
        setCity,
        cityId,
        setCityId,
        verifyID,
        changeVerifyID,
        selfieImage,
        setSelfieImage,
        tempSelfieImage,
        setTempSelfieImage,
        selfieImageWithID,
        setSelfieImageWithID,
        tempSelfieImageWithID,
        setTempSelfieImageWithID,
        person,
        changePersonInfo,
        modalCountryVisible,
        setModalCountryVisible,
        modalProvinceVisible,
        setModalProvinceVisible,
        modalCityVisible,
        setModalCityVisible,
        cities,
        setCities,
        provinceCities,
        changeProvinceCities,
        frontImage,
        setFrontImage,
        backImage,
        setBackImage,
        isBackRequired,
        setIsbackRequired,
        identificationId,
        setIdentificationId,
        incomeInfo,
        changeIncomeInfo,
        cacheImagesList,
        setCacheImagesList,
        pepInfo,
        setPepInfo,
        verifyFullNameErrors,
        setVerifyFullNameErrors,
        changeVerifyFullNameErrors,
        verifyAddressErrors,
        setVerifyAddressErrors,
        changeVerifyAddressErrors,
        stepsScreens,
        setStepScreens,
        pepSreens,
        appendPepScreens,
        resetStepScreens
      }}>
      {children}
    </Provider>
  );
};
