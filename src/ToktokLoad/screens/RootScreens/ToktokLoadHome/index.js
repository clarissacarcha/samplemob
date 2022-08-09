import React, {useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_LOAD_CATEGORIES, GET_LOAD_CATEGORY_NETWORKS} from 'toktokload/graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import Tooltip from 'react-native-walkthrough-tooltip';
import {usePrompt} from 'src/hooks';
import {useSelector} from 'react-redux';
import {ErrorUtility} from 'toktokload/util';
import {load} from 'toktokload/assets/images';
import {heart_selected_fill_icon} from 'toktokload/assets/icons';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

//UTIL
import {moderateScale, checkViewOnboarding} from 'toktokload/helper';

//components
import {
  HeaderBack,
  HeaderTitle,
  HeaderTabs,
  LoadingIndicator,
  SomethingWentWrong,
  SplashHome,
  CustomButton,
} from 'src/ToktokLoad/components';
import {BuyLoad, Favorites, VerifyContextProvider, VerifyContext, Advertisement, LoadCategory} from './components';

import CONSTANTS from 'common/res/constants';
import {KeyboardAvoidingView} from 'react-native';
const {COLOR, FONT_FAMILY: FONT, SIZE, FONT_SIZE, MARGIN, SHADOW} = CONSTANTS;

const FavoritesNav = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{paddingRight: 16}}>
      <Image style={{height: 20, width: 20}} resizeMode="contain" source={heart_selected_fill_icon} />
    </TouchableOpacity>
  );
};

const MainComponent = ({navigation, route}) => {
  // navigation.setOptions({
  //   headerRight: ()=> <FavoritesNav onPress={goToFavorites}/>
  // })

  const {
    adsActions,
    adsRegular,
    getAdvertisements,
    mobileNumber,
    mobileErrorMessage,
    refreshing,
    setRefreshing,
    adHighlight,
    activeNetwork,
    setActiveNetwork,
    onBoardingSteps,
    setOnboardingSteps,
  } = useContext(VerifyContext);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const prompt = usePrompt();
  const {user} = useSelector(state => state.session);

  const goToFavorites = () => navigation.navigate('ToktokLoadFavorites', {mobileErrorMessage, mobileNumber});

  const [getLoadCategories, {loading, error}] = useLazyQuery(GET_LOAD_CATEGORIES, {
    fetchPolicy: 'network-only',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      setRefreshing(false);
    },
    onCompleted: ({getLoadCategories}) => {
      setRefreshing(false);
      setActiveTab(getLoadCategories[0]);
      setCategories(getLoadCategories);
    },
  });

  navigation.setOptions({
    headerShown: !showSplash,
  });

  const getActiveCategoryName = activeTab => {
    return categories.filter(tab => tab?.id === activeTab?.id)[0];
  };

  const showOnboarding = async () => {
    let isViewOnboarding = await checkViewOnboarding(user.id);
    if (!isViewOnboarding) {
      prompt({
        type: 'onboarding',
        title: 'Buy Load!',
        message:
          'Learn how to navigate through the app by clicking the button below in order to start the walkthrough.',
        event: 'TOKTOKBILLSLOAD',
        onPress: () => setOnboardingSteps(1),
      });
    }
  };
  useEffect(() => {
    getDataList();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      showOnboarding();
      setShowSplash(false);
    }, 1500);
  }, [user]);

  const getDataList = () => {
    getLoadCategories();
    getAdvertisements();
  };

  const onRefresh = () => {
    setRefreshing(true);
    getDataList();
  };

  const onPressNext = () => {
    navigation.navigate('ToktokLoadNetworks', {mobileNumber, network: activeNetwork});
  };

  if (!showSplash && !refreshing && (loading || adsActions.loading)) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (showSplash || ((loading || adsActions.loading) && !refreshing)) {
    return <SplashHome />;
  }
  if (error || adsActions.error) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong error={error ?? adsActions.error} onRefetch={getDataList} />
      </View>
    );
  }
  return (
    // <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "padding"} keyboardVerticalOffset={30}>

    <ScrollView
      style={styles.container}
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={loading || adsActions.loading} onRefresh={onRefresh} />}>
      {adsRegular.length > 0 && <Advertisement autoplay ads={adsRegular} />}
      <Tooltip
        accessible={false}
        animated={true}
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        displayInsets={{top: 10, bottom: 10, left: 10, right: Platform.OS === 'android' ? 5 : 10}}
        backgroundColor="rgba(0,0,0,0.7)"
        disableShadow={true}
        isVisible={onBoardingSteps === 1}
        content={
          <View style={{padding: 5}}>
            <Text style={styles.tooltipTitle}>Load Categories</Text>
            <Text style={{paddingVertical: moderateScale(10)}}>
              Choose between the load categories: Telco, Broadband, and Entertainment.
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TouchableOpacity style={styles.tooltipButton} onPress={() => setOnboardingSteps(2)}>
                <Text style={styles.tooltipButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        closeOnChildInteraction={false}
        closeOnContentInteraction={false}
        placement="bottom">
        <HeaderTabs
          tabs={categories}
          scrollEnabled={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          fitToScreen={false}
          overLap={false}
        />
      </Tooltip>
      <LoadCategory
        navigation={navigation}
        activeTab={activeTab?.id}
        activeCategory={() => getActiveCategoryName(activeTab)}
      />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        {adHighlight.length > 0 && <Advertisement ads={adHighlight} />}
        <CustomButton
          label="Next"
          disabled={!mobileNumber || mobileErrorMessage || !activeNetwork}
          onPress={onPressNext}
          hasShadow
        />
      </View>
      {/* <ActionButton 
          fixNativeFeedbackRadius={true} 
          hideShadow={false} 
          spacing={15} 
          size={50} 
          nativeFeedbackRippleColor="transparent" 
          degrees={0} 
          renderIcon={()=><Image style={{height: 30 ,width: 30}} resizeMode="contain" source={load}/>} 
          buttonColor="white"
          titleBgColor="transparent"
          bgColor="rgba(0,0,0,0.5)"
          offsetY={75}
          offsetX={14}
      >
        <ActionButton.Item activeOpacity={0} size={40} hideLabelShadow={true} textContainerStyle={{backgroundColor:"transparent",border: 0,borderColor:"transparent"}} textStyle={{backgroundColor:"transparent",color:"white"}} title="Activities" buttonColor="white" onPress={() => console.log("notes tapped!")}>
          <Icon name="md-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item size={40} hideLabelShadow={true} textContainerStyle={{backgroundColor:"transparent",border: 0,borderColor:"transparent"}} textStyle={{backgroundColor:"transparent",color:"white"}} title="toktokwallet" buttonColor="white" onPress={() => navigation.navigate("ToktokLoadFavorites" , {mobileErrorMessage , mobileNumber})}>
          <Icon name="md-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton> */}
    </ScrollView>

    // </KeyboardAvoidingView>
  );
};

export const ToktokLoadHome = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'toktokload'} />,
  });

  return (
    <VerifyContextProvider>
      <MainComponent navigation={navigation} route={route} />
    </VerifyContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'orange',
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
});
