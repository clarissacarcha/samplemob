import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, ScrollView} from 'react-native';
import {TransactionModal} from '../Reports';
import CONSTANTS from 'common/res/constants';
import {moderateScale} from 'toktokwallet/helper';
import {info_icon} from 'toktokwallet/assets';
import {PolicyNote} from 'toktokwallet/components';

const {COLOR, FONT_FAMILY: FONTS, FONT_SIZE} = CONSTANTS;
const {width} = Dimensions.get('window');

export const TransactionDetails = ({transaction, visible, setVisible}) => {
  const {name, phrase, displayInfo, createdAt, transactionType} = transaction;
  const isCashOutPending = transactionType?.key === 'CASH_OUT' && displayInfo.Status === 'Pending';

  const renderDetails = ({details}) => {
    if (details) {
      const data = Object.entries(details);
      const RenderInfo = data.map((data, index) => {
        if (!data[0] && !data[1]) return null;
        const key = data[0];
        const value = data[1];
        return (
          <View style={{flexDirection: 'row'}}>
            <Text style={{marginTop: moderateScale(2)}}>
              <Text key={`externalDetails_${index}`} style={styles.labelText}>
                {key}:
              </Text>
              <Text key={`externalDetailsSub_${index}`} style={{flexShrink: 1}}>
                {` ${value}`}
              </Text>
            </Text>
          </View>
        );
      });
      return RenderInfo;
    }

    return null;
  };

  return (
    <TransactionModal visible={visible} setVisible={setVisible}>
      <ScrollView>
        <Text style={styles.cashOutText}>{name}</Text>
        <Text style={styles.labelCashOut}>{phrase}</Text>
        {isCashOutPending && (
          <PolicyNote
            note1="All transactions made before 01:00 PM will be processed within the day."
            note2="All transactions after 01:00 PM will be processed the next banking day."
            containerStyle={{marginTop: moderateScale(10)}}
          />
        )}
        <View style={{marginTop: isCashOutPending ? 5 : 15}}>{renderDetails({details: displayInfo})}</View>
      </ScrollView>
    </TransactionModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontFamily: FONTS.BOLD,
    fontSize: FONT_SIZE.M,
  },
  labelCashOut: {
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  cashOutText: {
    fontFamily: FONTS.BOLD,
    fontSize: moderateScale(18),
  },
  pendingContent: {
    marginTop: moderateScale(10),
    flexDirection: 'row',
    backgroundColor: COLOR.LIGHT_YELLOW,
    padding: moderateScale(16),
  },
  pendingPolicty: {
    height: 13,
    width: 13,
    marginRight: 10,
    marginTop: 3,
  },
  pendingText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
  },
});
