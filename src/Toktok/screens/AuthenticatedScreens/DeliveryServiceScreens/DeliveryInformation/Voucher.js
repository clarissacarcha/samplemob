import React from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, Image} from 'react-native';
import {COLOR} from '../../../../../res/variables';
import {ThrottledOpacity} from '../../../../../components_section';

import IOIcons from 'react-native-vector-icons/Ionicons';
import VoucherIMG from '../../../../../assets/toktokgo/voucher.png';
import ArrowRightIcon from '../../../../../assets/icons/arrow-right-icon.png';

const Voucher = ({navigation, selectedVoucher, setSelectedVoucher}) => {
  return (
    <>
      <View style={styles.separator} />
      <View style={styles.wrapper}>
        <View style={styles.voucherWrapper}>
          <Image source={VoucherIMG} style={styles.voucherDimensions} resizeMode={'contain'} />
          <Text>Vouchers</Text>
        </View>
        {selectedVoucher ? (
          <ThrottledOpacity
            onPress={() => {
              setSelectedVoucher(null);
            }}>
            <View style={styles.textWrapper}>
              <View style={styles.selectedVoucherWrapper}>
                <Text style={{color: COLOR.WHITE}}>{selectedVoucher?.name}</Text>
                <IOIcons name={'close'} style={styles.appliedVoucherClose} />
              </View>
              <Image source={ArrowRightIcon} style={styles.arrowDimensions} resizeMode={'contain'} />
            </View>
          </ThrottledOpacity>
        ) : (
          <ThrottledOpacity
            onPress={() => {
              navigation.navigate('DeliveryVouchers', {setSelectedVoucher});
            }}>
            <View style={styles.textWrapper}>
              <Text style={{color: COLOR.ORANGE}}>Select or Enter Code</Text>
              <Image source={ArrowRightIcon} style={styles.arrowDimensions} resizeMode={'contain'} />
            </View>
          </ThrottledOpacity>
        )}
      </View>
      <View style={styles.separator} />
    </>
  );
};

const mapStateToProps = state => ({
  constants: state.constants,
});

export default connect(mapStateToProps, null)(Voucher);

const styles = StyleSheet.create({
  separator: {
    backgroundColor: COLOR.LIGHT,
    height: 8,
    marginHorizontal: -16,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  voucherWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  voucherDimensions: {
    width: 22,
    height: 16,
    marginRight: 8,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowDimensions: {
    height: 9,
    width: 6,
    marginLeft: 10,
  },
  appliedVoucherClose: {
    color: COLOR.WHITE,
    marginLeft: 3,
  },
  selectedVoucherWrapper: {
    backgroundColor: COLOR.ORANGE,
    paddingHorizontal: 5,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
