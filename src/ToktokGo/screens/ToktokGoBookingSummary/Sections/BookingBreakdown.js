import React from 'react';
import {Text, StyleSheet, Image, View, ActivityIndicator, Dimensions} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import CONSTANTS from '../../../../common/res/constants';
import InfoIcon from '../../../../assets/icons/InfoIcon.png';
import moment from 'moment';
import {numberFormat} from '../../../../helper';
import {ThrottledOpacity} from '../../../../components_section';

const screenWidth = Dimensions.get('window').width;

export const BookingBreakdown = ({selectedVehicle, loading, details, setViewOutstandingFeeInfoModal}) => {
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  return (
    <View style={styles.container}>
      <ShimmerPlaceHolder style={{width: screenWidth / 1.08, marginBottom: 8}} visible={!loading}>
        <View style={styles.rowContainer}>
          <Text style={styles.title}>Ride Fare</Text>
          <Text style={styles.rideFareText}>
            ₱{numberFormat(selectedVehicle?.rate?.amount ? selectedVehicle?.rate?.amount : 0)}
          </Text>
        </View>
      </ShimmerPlaceHolder>

      {details?.rate?.charge && (
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.fee}>
              <Text style={styles.title}>Outstanding Fee</Text>
              <ThrottledOpacity
                onPress={() => {
                  setViewOutstandingFeeInfoModal(true);
                }}>
                <Image source={InfoIcon} resizeMode={'contain'} style={styles.iconDimensions} />
              </ThrottledOpacity>
            </View>
            <Text>₱{numberFormat(details?.rate?.charge?.amount)}</Text>
          </View>
          <View style={styles.feeDate}>
            <Text>
              {details?.rate?.charge?.type == 'LATE_FEE' ? 'Cancellation Fee' : 'No Show Fee'} last{' '}
              {moment(details?.rate?.charge?.createdAt).format('MMM D, YYYY')}
            </Text>
          </View>
        </View>
      )}

      {details?.rate?.tripFare?.discount > 0 && (
        <View style={styles.rowContainer}>
          <View>
            <Text style={styles.title}>Voucher</Text>
            <Text style={styles.voucherText}>{details?.voucher?.name}</Text>
          </View>

          {loading ? (
            <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
          ) : (
            <Text style={styles.discountText}>
              - ₱{numberFormat(details?.rate?.tripFare?.discount ? details?.rate?.tripFare?.discount : 0)}
            </Text>
          )}
        </View>
      )}

      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 19,
    flexDirection: 'column',
  },
  title: {
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
  },
  voucherText: {
    color: CONSTANTS.COLOR.BLACK,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  rideFareText: {
    color: CONSTANTS.COLOR.BLACK,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fee: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconDimensions: {
    marginLeft: 5,
    height: 13,
    width: 13,
  },
  feeDate: {
    marginTop: -8,
    marginBottom: 16,
  },
  redText: {
    color: CONSTANTS.COLOR.RED,
  },
  divider: {
    marginTop: 8,
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
  },
  discountText: {
    color: CONSTANTS.COLOR.RED,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    size: CONSTANTS.FONT_SIZE.M,
  },
});
