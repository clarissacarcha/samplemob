import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

//UTIL
import {moderateScale, numberFormat} from 'toktokload/helper';

//COMPONENTS
import {
  OrangeButton,
  HeaderBack,
  HeaderTitle,
  HeaderTabs,
  LoadingIndicator,
  Separator,
} from 'src/ToktokLoad/components';
import {PaymentMethod, PayNowButton, SummaryDetails} from './components';
import {SomethingWentWrong} from 'toktokload/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {wallet_icon} from 'src/ToktokLoad/assets/icons';
import {banner_bg} from 'toktokbills/assets';

//GRAPHQL & HOOKS
import {GET_MY_ACCOUNT, GET_USER_TOKTOK_WALLET_DATA} from 'toktokwallet/graphql';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {useAccount} from 'toktokwallet/hooks';
import {useLazyQuery} from '@apollo/react-hooks';

export const ToktokLoadSummary = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'Payment Summary'} />,
  });

  const {loads, mobileNumber, network} = route.params;
  const isFocused = useIsFocused();
  const {user} = useSelector(state => state.session);
  const {getMyAccountLoading, getMyAccount, getMyAccountError} = useAccount({isOnErrorAlert: false});
  const [refreshing, setRefreshing] = useState(false);
  const [networkSize, setNetworkSize] = useState({width: moderateScale(50), height: moderateScale(30)});
  const [isInsufficient, setInsufficient] = useState(false);

  useEffect(() => {
    if (user.toktokWalletAccountId) {
      Image.getSize(network.iconUrl, (width, height) => {
        setNetworkSize({width: width - moderateScale(40), height: height - moderateScale(10)});
      });
      getMyAccount();
    }
  }, [user]);

  useEffect(() => {
    setRefreshing(getMyAccountLoading);
  }, [getMyAccountLoading]);

  const onRefresh = () => {
    getMyAccount();
  };

  const onCashIn = ({balance}) => {
    console.log(balance);
    getMyAccount();
  };

  if (getMyAccountLoading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (getMyAccountError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={getMyAccountError} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <ImageBackground source={banner_bg} style={styles.headerContainer}>
          <Image
            source={{uri: network.iconUrl}}
            style={{height: networkSize.height, width: networkSize.width}}
            resizeMode="contain"
          />
          <View style={styles.headerContentContainer}>
            <Text style={styles.headerText}>Buy Load for {mobileNumber}</Text>
          </View>
        </ImageBackground>
        <SummaryDetails loadDetails={loads?.loadDetails ? loads.loadDetails : loads} mobileNumber={mobileNumber} />
        <Separator />
        <PaymentMethod
          loadDetails={loads?.loadDetails ? loads.loadDetails : loads}
          getMyAccount={getMyAccount}
          onCashIn={onCashIn}
          isInsufficient={isInsufficient}
        />
      </ScrollView>
      <PayNowButton
        loadDetails={loads?.loadDetails ? loads.loadDetails : loads}
        mobileNumber={mobileNumber}
        setInsufficient={setInsufficient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10),
  },
  headerText: {
    fontSize: FONT_SIZE.L,
  },
  separator: {
    height: moderateScale(30),
    backgroundColor: '#F7F7FA',
  },
  line: {
    height: 1,
    backgroundColor: '#F6841F',
  },
  headerContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: moderateScale(5),
    paddingBottom: moderateScale(20),
    paddingHorizontal: moderateScale(50),
  },
});
