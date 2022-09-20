import React, {useContext, useEffect, useState, useRef} from 'react';
import {View, StyleSheet, ScrollView, Dimensions, ImageBackground, Platform} from 'react-native';
import ViewShot from 'react-native-view-shot';
import CONSTANTS from 'common/res/constants';
import {useAccount} from 'toktokwallet/hooks';

//GRAPHQL
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_WALLET} from 'toktokwallet/graphql';
import {useLazyQuery} from '@apollo/react-hooks';

//COMPONENTS
import {OrangeButton, HeaderTitleRevamp, HeaderDownloadReceipt} from 'toktokwallet/components';
import {Header, ReceiptDetails} from './components';

//UTIL
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import LinearGradient from 'toktokwallet/assets/images/screen-bg.png';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const MainComponent = ({route}) => {
  return (
    <View style={styles.receiptContainer}>
      <Header route={route} />
      <ReceiptDetails route={route} />
    </View>
  );
};

const ReceiptDownload = ({route, onCapturingScreen}) => {
  return (
    <ImageBackground source={LinearGradient} resizeMode="cover" style={{padding: moderateScale(16)}}>
      <View
        style={{
          ...styles.receiptContainer,
          ...(onCapturingScreen && Platform.OS === 'android' ? styles.receiptBorder : {}),
        }}>
        <Header route={route} />
        <ReceiptDetails route={route} />
      </View>
    </ImageBackground>
  );
};

export const ToktokWalletDpCashInReceipt = ({navigation, route}) => {
  const [onCapturingScreen, setOnCapturingScreen] = useState(false);
  const viewshotRef = useRef();
  const {refreshWallet} = useAccount();
  const onCashIn = route.params.onCashIn;

  navigation.setOptions({
    headerLeft: () => null,
    headerTitle: () => <HeaderTitleRevamp label={'Transaction Receipt'} />,
    headerRight: () => (
      <HeaderDownloadReceipt
        viewshotRef={viewshotRef}
        // refNo={route.params.receipt.referenceNumber}
        onPressDownloadReceipt={val => {
          setOnCapturingScreen(val);
        }}
      />
    ),
  });

  const [getWallet] = useLazyQuery(GET_WALLET, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => onErrorAlert({alert, error}),
    onCompleted: ({getWallet}) => {
      refreshWallet();
      onCashIn({
        balance: getWallet.totalBalance,
      });
      return navigation.pop(4);
    },
  });

  const Proceed = () => {
    // navigation.pop(4)
    if (onCashIn) {
      getWallet();
    } else {
      navigation.navigate('ToktokWalletHomePage');
      navigation.replace('ToktokWalletHomePage');
    }
  };

  return (
    <>
      <ImageBackground source={LinearGradient} resizeMode="cover" style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            padding: onCapturingScreen ? 0 : moderateScale(16),
          }}>
          <ViewShot ref={viewshotRef} options={{format: 'jpg', quality: 0.9, result: 'tmpfile'}}>
            {onCapturingScreen ? (
              <ReceiptDownload route={route} onCapturingScreen={onCapturingScreen} />
            ) : (
              <MainComponent navigation={navigation} route={route} onCapturingScreen={onCapturingScreen} />
            )}
          </ViewShot>
        </ScrollView>
      </ImageBackground>
      <View style={styles.buttonContainer}>
        <OrangeButton label="OK" onPress={Proceed} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  separator: {
    height: moderateScale(30),
    backgroundColor: '#F7F7FA',
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
    backgroundColor: COLOR.WHITE,
  },
  receiptContainer: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20),
    backgroundColor: COLOR.WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  receiptBorder: {
    borderColor: '#F8F8F8',
    borderWidth: 2,
  },
});
