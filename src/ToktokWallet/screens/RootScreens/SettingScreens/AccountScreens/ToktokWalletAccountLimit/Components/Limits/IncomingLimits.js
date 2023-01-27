import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CONSTANTS from 'common/res/constants';
//SELF IMPORTS
import Card from './Card';
import {toktokwalletLabel} from '../Limits';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const IncomingLimits = ({limits, used}) => {
  return (
    <>
      {limits?.daily && (
        <Card
          title="Daily Incoming Limit"
          description={() => (
            <Text style={styles.labelRegular}>
              Cumulative amount of cash that can be received in your {toktokwalletLabel()}.
            </Text>
          )}
          limit={+limits?.daily}
          used={used?.daily}
          remaining={+limits?.daily - +used?.daily}
          bottomLabel={() => (
            <>
              {!limits?.monthly && (
                <Text style={styles.labelRegularSmall}>No limit for Monthly Incoming Transactions</Text>
              )}
              {!limits?.annual && (
                <Text style={styles.labelRegularSmall}>No limit for Annual Incoming Transactions</Text>
              )}
            </>
          )}
        />
      )}
      {limits?.monthly && (
        <Card
          title="Monthly Incoming Limit"
          description={() => (
            <Text style={styles.labelRegular}>
              Cumulative amount of cash that can be received in your {toktokwalletLabel()}.
            </Text>
          )}
          limit={+limits?.monthly}
          used={used?.monthly}
          remaining={+limits?.monthly - +used?.monthly}
          bottomLabel={() => (
            <>
              {!limits?.daily && <Text style={styles.labelRegularSmall}>No limit for Daily Incoming Transactions</Text>}
              {!limits?.annual && (
                <Text style={styles.labelRegularSmall}>No limit for Annual Incoming Transactions</Text>
              )}
            </>
          )}
        />
      )}
      {limits?.annual && (
        <Card
          title="Annual Incoming Limit"
          description={() => (
            <Text style={styles.labelRegular}>
              Cumulative amount of cash that can be received in your {toktokwalletLabel()}.
            </Text>
          )}
          limit={+limits?.annual}
          used={used?.annual}
          remaining={+limits?.annual - +used?.annual}
          bottomLabel={() => (
            <>
              {!limits?.daily && <Text style={styles.labelRegularSmall}>No limit for Daily Incoming Transactions</Text>}
              {!limits?.monthly && (
                <Text style={styles.labelRegularSmall}>No limit for Monthly Incoming Transactions</Text>
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

export default IncomingLimits;
