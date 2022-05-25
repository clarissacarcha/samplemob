import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import {LoadingIndicator} from 'toktokbills/components';

//UTIL
import {moderateScale, numberFormat, currencyCode} from 'toktokbills/helper';

//COMPONENTS
import {ReceiptSeparator} from '../../../../../components/Ui';

//FONTS & COLORS & IMAGES
import toktokBillsLogo from '../../../../../../ToktokBills/assets/images/toktokbills.png';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import moment from 'moment';

export const ReceiptDetails = ({route}) => {
  const {receipt, paymentData} = route.params;
  const {
    senderMobileNumber,
    destinationNumber,
    destinationIdentifier,
    amount,
    email,
    billerDetails,
    convenienceFee,
    referenceNumber,
    createdAt,
    toktokServiceCommission,
  } = receipt;
  const {firstFieldName, secondFieldName} = paymentData.billItemSettings;
  const totalAmount = parseInt(amount) + convenienceFee + toktokServiceCommission;
  const [logo, setLogo] = useState({height: 0, width: 0});
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    Image.getSize(billerDetails.logo, (width, height) => {
      let size = height > width ? height - width : width - height;
      if (size > 10) {
        if (width > moderateScale(80) || height > moderateScale(40)) {
          setLogo({width: 80, height: 50});
        } else {
          setLogo({width, height});
        }
      } else {
        setLogo({width: 50, height: 50});
      }
    });
    console.log('HERE', receipt);
  }, []);

  return (
    <>
      <View style={styles.line} />
      <View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Service Reference Number: </Text>
          <Text style={[styles.description, {color: COLOR.ORANGE, fontFamily: FONT.BOLD}]}>{referenceNumber}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Transaction Date and Time: </Text>
          <Text style={styles.description}>{moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A')}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>{firstFieldName}: </Text>
          <Text style={styles.description}>{destinationNumber}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>{secondFieldName}: </Text>
          <Text style={styles.description}>{destinationIdentifier}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Toktokwallet Account Number: </Text>
          <Text style={styles.description}>+{senderMobileNumber}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Payment amount: </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(amount)}
          </Text>
        </View>
        {convenienceFee > 0 && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Convenience Fee: </Text>
            <Text style={styles.description}>
              {currencyCode}
              {numberFormat(convenienceFee)}
            </Text>
          </View>
        )}
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Toktok Service Fee: </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(toktokServiceCommission)}
          </Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Total</Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(totalAmount)}
          </Text>
        </View>
        <ReceiptSeparator />
        <View style={styles.brokenLine} />
        <View style={{alignItems: 'center'}}>
          <Text style={styles.description}>A copy of this receipt will be delivered on the email provided.</Text>
          <Image source={toktokBillsLogo} style={styles.logo} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: COLOR.BLACK,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    width: '50%',
  },
  logo: {
    marginTop: moderateScale(16),
    alignSelf: 'center',
    width: moderateScale(102),
    height: moderateScale(23),
  },
  description: {
    color: 'black',
    fontSize: FONT_SIZE.M,
    flexShrink: 1,
    textAlign: 'center',
  },
  bodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginBottom15: {
    marginBottom: moderateScale(15),
  },
  line: {
    height: 8,
    marginHorizontal: -16,
    backgroundColor: COLOR.LIGHT,
    marginVertical: moderateScale(16),
  },
  brokenLine: {
    borderBottomWidth: 2,
    borderBottomColor: COLOR.ORANGE,
    borderStyle: 'dashed',
    margin: moderateScale(16),
  },
  logo: {
    width: moderateScale(80),
    height: moderateScale(50),
    resizeMode: 'contain',
  },
});
