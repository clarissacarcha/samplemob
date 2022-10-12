import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CONSTANTS from 'common/res/constants';
//SELF IMPORTS
import Card from './Card';
import {toktokwalletLabel} from '../Limits';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const OutgoingLimits = ({limits, used}) => {
  return (
    <>
      {limits?.daily && (
        <Card
          title="Daily Outgoing Limit"
          description={() => (
            <Text style={styles.labelRegular}>
              Maximum amount that you can transfer from your {toktokwalletLabel()} to other beneficiary accounts.
            </Text>
          )}
          limit={+limits?.daily}
          used={used?.daily}
          remaining={+limits?.daily - +used?.daily}
          bottomLabel={() => (
            <>
              {!limits?.monthly && (
                <Text style={styles.labelRegularSmall}>No limit for Monthly Outgoing Transactions</Text>
              )}
              {!limits?.annual && (
                <Text style={styles.labelRegularSmall}>No limit for Annual Outgoing Transactions</Text>
              )}
            </>
          )}
        />
      )}
      {limits?.monthly && (
        <Card
          title="Monthly Outgoing Limit"
          description={() => (
            <Text style={styles.labelRegular}>
              Maximum amount that you can transfer from your {toktokwalletLabel()} to other beneficiary accounts.
            </Text>
          )}
          limit={+limits?.monthly}
          used={used?.monthly}
          remaining={+limits?.monthly - +used?.monthly}
          bottomLabel={() => (
            <>
              {!limits?.daily && <Text style={styles.labelRegularSmall}>No limit for Daily Outgoing Transactions</Text>}
              {!limits?.annual && (
                <Text style={styles.labelRegularSmall}>No limit for Annual Outgoing Transactions</Text>
              )}
            </>
          )}
        />
      )}
      {limits?.annual && (
        <Card
          title="Annual Outgoing Limit"
          description={() => (
            <Text style={styles.labelRegular}>
              Maximum amount that you can transfer from your {toktokwalletLabel()} to other beneficiary accounts.
            </Text>
          )}
          limit={+limits?.annual}
          used={used?.annual}
          remaining={+limits?.annual - +used?.annual}
          bottomLabel={() => (
            <>
              {!limits?.daily && <Text style={styles.labelRegularSmall}>No limit for Daily Outgoing Transactions</Text>}
              {!limits?.monthly && (
                <Text style={styles.labelRegularSmall}>No limit for Monthly Outgoing Transactions</Text>
              )}
            </>
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  labelRegular: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: '#525252',
  },
  labelRegularSmall: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    color: '#525252',
  },
});

export default OutgoingLimits;
