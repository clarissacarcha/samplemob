import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
//COMPONENTS, HELPER
import {VerifyContext} from '../../../VerifyContextProvider';
import {currencyCode, numberFormat, moderateScale} from 'toktokwallet/helper';
import {LoadingIndicator} from 'toktokwallet/components';
//ASSETS
import tokwaLogo from 'toktokwallet/assets/images/tokwa.png';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const RecentQrCodes = ({data}) => {
  const {setAmount, setGeneratedQrCode, getAccountQrCodesLoading} = useContext(VerifyContext);

  const onPressRecentQr = item => {
    setAmount(item.amount);
    setGeneratedQrCode(item.qrCode);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.shadowContainer} onPress={() => onPressRecentQr(item)}>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(8),
          }}>
          <QRCode
            value={item.qrCode} //Give value when there's no session as it will throw an error if value is empty.
            logo={tokwaLogo}
            logoSize={moderateScale(10)}
            logoBackgroundColor="transparent"
            size={moderateScale(50)}
            color="black"
            backgroundColor="transparent"
          />
          {!!item?.amount && (
            <Text style={styles.amount}>
              {currencyCode}
              {numberFormat(item.amount)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {(data.length !== 0 || getAccountQrCodesLoading) && <Text style={styles.title}>Recent QR</Text>}
      {getAccountQrCodesLoading ? (
        <LoadingIndicator isLoading={true} size="small" />
      ) : (
        <FlatList
          horizontal
          data={data}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: moderateScale(7)}}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: 'white',
    margin: moderateScale(10),
  },
  title: {
    fontFamily: FONT.BOLD,
    color: COLOR.ORANGE,
    marginTop: moderateScale(16),
    paddingHorizontal: moderateScale(16),
  },
  amount: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    marginTop: moderateScale(3),
  },
});
