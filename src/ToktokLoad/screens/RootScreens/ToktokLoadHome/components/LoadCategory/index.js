import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VectorIcon, ICON_SET} from 'src/revamp';
import Tooltip from 'react-native-walkthrough-tooltip';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_LOAD_CATEGORIES, GET_LOAD_CATEGORY_NETWORKS} from 'toktokload/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {usePrompt} from 'src/hooks';
import {ErrorUtility} from 'toktokload/util';
import {useSelector} from 'react-redux';

//COMPONENTS
import {OrangeButton, LoadingIndicator} from 'src/ToktokLoad/components';
import {VerifyContext} from '../VerifyContextProvider';

//UTIL
import {moderateScale, saveViewOnboarding} from 'toktokload/helper';

//FONTS & COLORS
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

//IMAGES
import {contact_icon} from 'toktokload/assets/icons';
import {blank} from 'toktokload/assets/ads';

//SELF IMPORTS
import {Advertisement} from '../Advertisement';

import {NetworkListModal} from '../NetworkListModal';

const width = Dimensions.get('window').width;

export const LoadCategory = ({navigation, activeCategory, activeTab}) => {
  const {
    mobileNumber,
    setMobileNumber,
    setSubContainerStyle,
    adHighlight,
    activeNetwork,
    setActiveNetwork,
    onBoardingSteps,
    setOnboardingSteps,
    errorMessages,
    changeErrorMessages,
  } = useContext(VerifyContext);

  const [visible, setVisible] = useState(false);
  const [networks, setNetworks] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);

  const prompt = usePrompt();
  const {user} = useSelector(state => state.session);
  const formattedMobile = user?.username.replace('+63', '0');
  const tooltipWidth = moderateScale(
    width - (Platform.OS === 'android' ? moderateScale(16 + 20) : moderateScale(16 + 20)),
  );

  const [getLoadCategoryNetworks, {loading}] = useLazyQuery(GET_LOAD_CATEGORY_NETWORKS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
      setVisible(false);
    },
    onCompleted: ({getLoadCategoryNetworks}) => {
      setNetworks(getLoadCategoryNetworks);
    },
  });

  useEffect(() => {
    setActiveNetwork(null);
  }, [activeTab]);

  useEffect(() => {
    changeErrorMessages('inputField', '');
    changeErrorMessages('selection', '');
    if (activeNetwork?.inputLength?.name.toLowerCase() === 'mobile number') setMobileNumber(formattedMobile);
  }, [activeNetwork]);

  const onChangeText = value => {
    // let mobile = value.replace(/[$-/:-?{-~!"#^_`\[\] ]/g, "");
    const fieldFormat = activeNetwork?.inputLength?.fieldFormat;
    let mobile = fieldFormat == 2 ? value.replace(/[^A-Za-z0-9]/g, '') : value.replace(/[^0-9]/g, '');

    if (activeNetwork?.inputLength?.name.toLowerCase() === 'mobile number') {
      if ((mobile.length == 1 || mobile.length == 2) && (mobileNumber.length == '' || mobileNumber.length == 1)) {
        setMobileNumber('09');
      } else {
        setMobileNumber(mobile);
      }
    } else {
      setMobileNumber(mobile);
    }
    changeErrorMessages('inputField', '');
  };

  const onPressNext = () => {
    navigation.navigate('ToktokLoadNetworks', {mobileNumber, network: activeNetwork});
  };

  const onSelectContact = number => {
    onChangeText(number);
  };

  const onPressContacts = () => {
    navigation.navigate('ToktokLoadContacts', {onSelectContact});
  };

  const openNetworks = () => {
    getLoadCategoryNetworks({
      variables: {
        input: {
          loadCategoryId: activeTab,
        },
      },
    });
    setVisible(true);
  };

  const onPressGotIt = async () => {
    await saveViewOnboarding(user.id);
    setOnboardingSteps(0);
  };

  const ads = [{id: 1, image: blank}];

  return (
    <View style={styles.container}>
      <NetworkListModal
        visible={visible}
        setVisible={setVisible}
        activeNetwork={activeNetwork}
        setActiveNetwork={setActiveNetwork}
        loading={loading}
        data={networks}
        activeCategory={activeCategory()?.name}
      />
      <Tooltip
        accessible={false}
        animated={true}
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        displayInsets={{top: 0, bottom: 0, left: 0, right: 0}}
        contentStyle={{width: tooltipWidth}}
        backgroundColor="rgba(0,0,0,0.6)"
        disableShadow={true}
        isVisible={onBoardingSteps === 2}
        content={
          <View style={{padding: 5}}>
            <Text style={styles.tooltipTitle}>Select Load</Text>
            <Text style={{paddingVertical: moderateScale(10)}}>
              By selecting the arrow down, all the different electronic loads will display for you to choose.
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TouchableOpacity style={styles.tooltipButton} onPress={() => setOnboardingSteps(3)}>
                <Text style={styles.tooltipButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        closeOnChildInteraction={false}
        closeOnContentInteraction={false}
        placement="bottom">
        <View style={onBoardingSteps === 2 && [styles.onBoardingStyleSteps, {width: tooltipWidth}]}>
          <View style={[{flexDirection: 'column'}]}>
            <Text style={{fontFamily: FONT.SEMI_BOLD, fontSize: FONT_SIZE.M, color: '#222222'}}>
              Select {activeCategory()?.name ? activeCategory().name : ''}
            </Text>
            <TouchableOpacity
              disabled={onBoardingSteps === 2}
              style={[styles.selection, !!errorMessages.selection && styles.borderError]}
              onPress={openNetworks}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                {activeNetwork && onBoardingSteps !== 3 ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {imageLoading && (
                      <View style={{position: 'absolute', left: 10}}>
                        <LoadingIndicator isLoading={true} size="small" />
                      </View>
                    )}
                    <Image
                      source={{uri: activeNetwork.iconUrl}}
                      style={styles.networkImage}
                      resizeMode="contain"
                      onLoadStart={() => {
                        setImageLoading(true);
                      }}
                      onLoadEnd={() => {
                        setImageLoading(false);
                      }}
                    />
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S, marginLeft: 5}}>
                      {activeNetwork.name}
                    </Text>
                  </View>
                ) : (
                  <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S, color: '#707070'}}>
                    Select {activeCategory()?.name ? activeCategory().name : ''}
                  </Text>
                )}
              </View>
              <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
                <VectorIcon size={15} iconSet={ICON_SET.FontAwesome5} name="chevron-down" color={COLOR.ORANGE} />
              </View>
            </TouchableOpacity>
            {!!errorMessages.selection && <Text style={styles.errorMessage}>{errorMessages.selection}</Text>}
          </View>
        </View>
      </Tooltip>
      {(activeNetwork || onBoardingSteps == 3) && (
        <>
          <Tooltip
            accessible={false}
            animated={true}
            topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
            displayInsets={{top: 0, bottom: 0, left: 0, right: 0}}
            contentStyle={{width: tooltipWidth}}
            backgroundColor="rgba(0,0,0,0.6)"
            disableShadow={true}
            isVisible={onBoardingSteps === 3}
            content={
              <View style={{padding: 5}}>
                <Text style={styles.tooltipTitle}>Buy Load For</Text>
                <Text style={{paddingVertical: moderateScale(10)}}>
                  Input the mobile number of your load recipient, or select a recipient from your contacts.
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <TouchableOpacity style={styles.tooltipButton} onPress={onPressGotIt}>
                    <Text style={styles.tooltipButtonText}>Finish</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            closeOnChildInteraction={false}
            closeOnContentInteraction={false}
            placement="bottom">
            <View style={onBoardingSteps === 3 && [styles.onBoardingStyleSteps, {width: tooltipWidth}]}>
              <Text
                style={[
                  onBoardingSteps !== 3 && {marginTop: moderateScale(16)},
                  {fontFamily: FONT.SEMI_BOLD, fontSize: FONT_SIZE.M, color: '#222222'},
                ]}>
                Buy Load For
              </Text>
              <View style={styles.inputContainer}>
                <View style={[styles.input, !!errorMessages.inputField && styles.borderError]}>
                  {!activeNetwork ? (
                    <TextInput
                      value={mobileNumber}
                      onChangeText={onChangeText}
                      keyboardType={'number-pad'}
                      returnKeyType="done"
                      editable={false}
                      placeholderTextColor="#9E9E9E"
                    />
                  ) : (
                    <TextInput
                      value={mobileNumber}
                      onChangeText={onChangeText}
                      placeholder={`${activeNetwork.inputLength.fieldPlaceholder}`}
                      keyboardType={activeNetwork.inputLength.fieldFormat == 2 ? 'default' : 'number-pad'}
                      returnKeyType="done"
                      maxLength={+activeNetwork?.inputLength?.inputLength ?? 11}
                      placeholderTextColor="#9E9E9E"
                    />
                  )}
                </View>
                {(activeNetwork?.inputLength?.name.toLowerCase() === 'mobile number' || onBoardingSteps === 3) && (
                  <TouchableOpacity
                    onPress={onPressContacts}
                    style={styles.contactsContainer}
                    disabled={onBoardingSteps === 3}>
                    <Image source={contact_icon} style={styles.icon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Tooltip>
        </>
      )}
      {!!errorMessages.inputField && <Text style={styles.errorMessage}>{errorMessages.inputField}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: moderateScale(16),
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: moderateScale(16),
  },
  onBoardingStyleSteps: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: moderateScale(5),
    padding: moderateScale(10),
  },
  input: {
    backgroundColor: '#F8F8F8',
    height: moderateScale(40),
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    justifyContent: 'center',
    flex: 1,
  },
  contactsContainer: {
    backgroundColor: '#F6841F',
    padding: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(5),
    marginLeft: moderateScale(10),
  },
  errorMessage: {
    fontSize: FONT_SIZE.S,
    color: '#ED3A19',
    paddingTop: moderateScale(5),
  },
  icon: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  networkImage: {
    height: moderateScale(20),
    width: moderateScale(40),
  },
  tooltipButton: {
    justifyContent: 'center',
    backgroundColor: '#F6841F',
    padding: moderateScale(4.5),
    width: moderateScale(100),
    borderRadius: moderateScale(5),
  },
  tooltipButtonText: {
    textAlign: 'center',
    color: COLOR.WHITE,
  },
  tooltipTitle: {
    fontFamily: FONT.SEMI_BOLD,
    color: '#F6841F',
  },
  selection: {
    backgroundColor: '#F8F8F8',
    height: moderateScale(40),
    borderRadius: moderateScale(5),
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: moderateScale(10),
    marginTop: 16,
  },
  borderError: {
    borderWidth: 1,
    borderColor: '#ED3A19',
  },
});
