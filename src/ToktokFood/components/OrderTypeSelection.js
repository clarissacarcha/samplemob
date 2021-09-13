import React from 'react';
import {View, StyleSheet, Modal, Text} from 'react-native';

import {COLOR, FONT} from 'src/res/variables';
import {verticalScale} from 'toktokfood/helper/scale';

const OrderTypeSelection = ({visibility, date, onValueChange, value}) => {
  const RoundedButton = (props) => {
    const {selected, orderIsFor} = props;
    return (
      <View
        onTouchEnd={() => onValueChange(orderIsFor === 1 ? 'DELIVERY' : 'PICK_UP')}
        style={[
          {
            width: 20,
            height: 20,
            borderWidth: 2,
            borderRadius: 50,
            marginRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: selected ? COLOR.YELLOW : COLOR.YELLOW,
          },
        ]}>
        {selected ? (
          <View
            style={{
              height: 11,
              width: 11,
              borderRadius: 50,
              backgroundColor: COLOR.YELLOW,
            }}
          />
        ) : null}
      </View>
    );
  };

  return (
    <>
      <Modal
        style={styles.container}
        visible={visibility}
        transparent={true}
        animationType="slide"
        presentationStyle="overFullScreen">
        <View style={styles.content}>
          <View style={[styles.wrapper, styles.cartBorder]}>
            <View style={styles.sheet}>
              <View style={styles.itemWrapper}>
                <RoundedButton orderIsFor={1} selected={value === 'DELIVERY'} />
                <Text style={styles.itemText}>Delivery</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.itemWrapper}>
                <RoundedButton orderIsFor={2} selected={value === 'PICK_UP'} />
                <Text style={styles.itemText}>Pick-up</Text>
              </View>
              <View style={styles.scheduleWrapper}>
                <View style={styles.dateWrapper}>
                  <Text style={styles.scheduleTitle}>Date</Text>
                  <Text style={styles.scheduleText}>Today, {date}</Text>
                </View>
                <View style={styles.dateWrapper}>
                  <Text style={styles.scheduleTitle}>Time</Text>
                  <Text style={styles.scheduleText}>ASAP</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(34, 34, 34, 0.50)',
  },
  wrapper: {
    width: '101%',
    position: 'absolute',
    height: verticalScale(170),
    backgroundColor: COLOR.WHITE,
  },
  cartBorder: {
    borderTopWidth: 3,
    borderEndWidth: 2,
    borderStartWidth: 2,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: COLOR.YELLOW,
    marginHorizontal: -2,
  },
  sheet: {
    flex: 1,
    padding: 15,
  },
  itemWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    padding: 5,
  },
  itemText: {
    fontSize: 16,
    fontFamily: FONT.REGULAR,
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 8,
    backgroundColor: COLOR.MEDIUM,
  },
  scheduleWrapper: {
    flex: 1,
    height: 120,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  scheduleTitle: {
    fontSize: 18,
    marginRight: 8,
    fontFamily: FONT.BOLD,
  },
  scheduleText: {
    fontSize: 16,
    fontFamily: FONT.REGULAR,
  },
  dateWrapper: {
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default OrderTypeSelection;
