import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Image, View} from 'react-native';
import constants from '../../../../common/res/constants';
import {APP_FLAVOR, MEDIUM} from '../../../../res/constants';
import {FONT} from '../../../../res/variables';
// import CashImage from '../../../../assets/toktok/images/Cash.png';
// import ToktokIcon from '../../../../assets/toktok/images/ToktokIcon.png';
import {AccordionBooking} from '.';
import {numberFormat} from '../../../../helper';

export const BookingTotal = ({delivery, dummyStatus}) => {
  const [cashSubTexts, setCashSubTexts] = useState([]);
  const [cashSenderSubTexts, setCashSenderSubTexts] = useState([]);
  const [toktokWalletSubTexts, setToktokWalletCashSubTexts] = useState([]);

  const [cashTitleText, setCashTitleText] = useState(0);
  const [cashSenderTitleText, setCashSenderTitleText] = useState(0);
  const [toktokWalletTitleText, setToktokWalletTitleText] = useState(0);

  const getCollectFromCustomer = () => {
    //Array for local sub items
    let cashSubTextArray = [];
    /* Return null if the orderSubtotal is = 0 and collectFromRecipient = 0
            this is for handling the 0 value of collectFromRecipient and 0 value of orderSubtotal
        */

    let total = 0;
    if (parseFloat(delivery.collectFromRecipient) != 0) {
      //Check for pabili fee and express fee, if available, deduct it from delivery price
      let deliveryFeeWithDeductions = (
        parseFloat(delivery.collectFromRecipient) +
        parseFloat(delivery.collectFromSender) -
        (parseFloat(delivery.partnerBranchOrderFee) + parseFloat(delivery.cashOnDeliveryFee)) -
        parseFloat(delivery.expressFee)
      ).toFixed(2);
      let deliveryFee = (parseFloat(delivery.collectFromRecipient) + parseFloat(delivery.collectFromSender)).toFixed(2);
      //Add the delivery fee with or without deductions
      // if(deliveryFeeWithDeductions > 0) {
      cashSubTextArray.push({text: 'Sedan', amount: `₱${numberFormat(300)}`});
      // }
      //If the delivery has pabili fee, add it to the sub text array
      // if(delivery.description) {
      const pabiliFee = `PHP ${(
        parseFloat(delivery.partnerBranchOrderFee) + parseFloat(delivery.cashOnDeliveryFee)
      ).toFixed(2)}`;
      cashSubTextArray.push({text: 'Distance', amount: `₱${numberFormat(80)}`});
      // }
      //If the delivery has express fee, add it to the sub text array
      if (delivery.expressFee != 0) {
        const expressFee = `PHP ${parseFloat(delivery.expressFee).toFixed(2)}`;
        cashSubTextArray.push({text: 'Express Fee', amount: expressFee});
      }
      total = parseFloat(deliveryFee);
    }

    /** RAISE THIS ESTIMATED AMOUNT */
    const estimatedAmount = parseFloat(delivery.cashOnDelivery).toFixed(2);
    if (delivery.cashOnDelivery && delivery.cashOnDelivery != '0') {
      cashSubTextArray.push({text: 'Estimated Amount', amount: `PHP ${estimatedAmount}`});
    }
    //Add local sub text array to the session sub text
    setCashSubTexts(cashSubTextArray);
    //Add total text amount to cash title text session
    // total = total + parseFloat(estimatedAmount);
    total = 380;
    if (total > 0) {
      setCashTitleText('₱' + numberFormat(total));
    }
  };

  useEffect(() => {
    getCollectFromCustomer();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.directionsBox}>
        <View style={{borderBottomWidth: 1, borderColor: constants.COLOR.LIGHT}} />
        <View style={styles.directionDetail}>
          {/*-------------------- TOTAL INCOME --------------------*/}
          <View style={{flex: 1}}>
            <View>
              {/* <Text style={{fontFamily: FONT.BOLD, fontSize: constants.FONT_SIZE.M}}>
                                Summary
                            </Text> */}
              {cashTitleText != 0 && (
                <AccordionBooking
                  titleText={'Total'}
                  titleAmount={cashTitleText}
                  subTexts={cashSubTexts}
                  dummyStatus={dummyStatus}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: constants.COLOR.WHITE,
    // alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsBox: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  items: {
    fontFamily: FONT.REGULAR,
    color: constants.COLOR.DARK,
    fontSize: constants.FONT_SIZE.M,
    marginTop: 2,
  },
  deliveryFee: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderColor: constants.COLOR.LIGHT,
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
