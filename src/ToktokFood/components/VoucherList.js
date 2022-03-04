/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, ImageBackground, View, StyleSheet, Text} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialIcons';
// import ContentLoader from 'react-native-easy-content-loader';

import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
// import {markerIcon} from 'toktokfood/assets/images';

import {reseller_badge} from 'toktokfood/assets/images';
// import {getStatusbarHeight, verticalScale, moderateScale, getDeviceWidth} from 'toktokfood/helper/scale';

const VoucherList = ({
  data = [],
  isDisabled = false,
  isReseller = false,
  hasClose = false,
  onCloseItem = () => null,
}) => {
  const voucherStyle = isDisabled ? {...styles.voucherContainer, opacity: 0.4} : styles.voucherContainer;
  const [voucherData, setVoucherData] = useState(data);

  const onSetVoucher = useCallback(() => {
    if (isReseller) {
      setVoucherData([{id: 0, name: 'Reseller -1.75%'}, ...data]);
      //   voucherData.unshift();
    }
  }, [isReseller]);

  useEffect(() => {
    onSetVoucher();
  }, [onSetVoucher]);

  // const onCloseItem = id => {
  //   const filterData = voucherData.filter(item => item.id !== id);
  //   setVoucherData(filterData);
  // };
  const voucherList = ({item}) => {
    if (item.id === 0) {
      return (
        <ImageBackground resizeMode="contain" source={reseller_badge} style={styles.resellerBadge}>
          <Text style={styles.resellerText}>{item.name}</Text>
        </ImageBackground>
      );
    }

    return (
      <View style={voucherStyle}>
        <Text style={styles.voucherText}>{item.vname}</Text>
        {(hasClose || (item.type !== 'deal' && item.type !== 'auto')) && (
          <MIcon style={styles.closeIcon} name="close" size={14} color="white" onPress={() => onCloseItem(item.id)} />
        )}
      </View>
    );
  };

  return <FlatList data={voucherData} horizontal showsHorizontalScrollIndicator={false} renderItem={voucherList} />;
};

export default VoucherList;

const styles = StyleSheet.create({
  closeIcon: {
    paddingLeft: 5,
  },
  resellerBadge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    marginRight: 10,
    paddingHorizontal: 8,
  },
  resellerPrice: {
    flexDirection: 'row',
  },
  resellerText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.S,
    fontWeight: '700',
  },
  voucherContainer: {
    alignItems: 'center',
    backgroundColor: '#FF6200',
    borderRadius: 5,
    flexDirection: 'row',
    height: 25,
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: 7,
  },
  voucherText: {
    color: COLOR.WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
});
