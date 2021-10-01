import React from 'react';
import Modal from 'react-native-modal';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback} from 'react-native';

// COLORS
import {COLOR, FONT_SIZE, FONT} from 'src/res/variables';
import {VectorIcon, ICON_SET} from 'src/revamp';
// Utils
import {moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';

const OrderTypeSelection = ({
  data,
  allowPickup,
  handleModal,
  handleSelected,
  onValueChange,
  value,
  visibility,
  setShowFilter,
  date,
  shopname
}) => {

  const onPressItem = (item) => {
    handleSelected(item)
    setShowFilter(false)
  }

  const RoundedButton = (props) => {
    const {selected, orderIsFor, disabled} = props;
    return (
      <View
        style={[
          {
            width: 20,
            height: 20,
            borderWidth: 2,
            borderRadius: 50,
            marginRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#FFA700',
            opacity: disabled ? .5 : 1
          },
        ]}>
        {selected ? (
          <View
            style={{
              height: 11,
              width: 11,
              borderRadius: 50,
              backgroundColor: '#FFA700',
            }}
          />
        ) : null}
      </View>
    );
  };

  const DisplayButton = ({ disabled, title, orderIsFor, onTouchEnd, textStyle }) => {
    let disableStyle = disabled ? { color: 'gray' } : {} 
    return (
      <TouchableOpacity
        style={styles.itemWrapper}
        onPress={onTouchEnd}
        disabled={disabled}
      >
        <RoundedButton disabled={disabled} orderIsFor={orderIsFor} selected={value === title} />
        <Text numberOfLines={1} style={[styles.itemText, disableStyle]}>{title}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <Modal isVisible={visibility} onBackdropPress={handleModal} style={styles.modal}>
      {/* <View style={styles.container}> */}
        {/* {renderHeader()} */}
        {/* <FlatList data={data} renderItem={renderItem} showsVerticalScrollIndicator={false} /> */}
        <View style={[styles.wrapper, styles.cartBorder]}>
          <View style={styles.sheet}>
            <DisplayButton
              title='Delivery'
              orderIsFor={1}
              onTouchEnd={() => onValueChange('Delivery')}
            />
            <View style={styles.separator} />
            
            <DisplayButton
              title={allowPickup == 0 ? `${shopname} is not available for pickup` : 'Pickup'}
              orderIsFor={2}
              onTouchEnd={() => onValueChange('Pickup')}
              disabled={allowPickup == 0}
            />
            
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
      {/* </View> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(20),
  },
  headerText: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '500',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    padding: moderateScale(20),
  },
  itemText: {
    fontSize: FONT_SIZE.L,
  },
  itemTextSelected: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.L,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(34, 34, 34, 0.50)',
  },
  wrapper: {
    width: '101%',
    position: 'absolute',
    backgroundColor: COLOR.WHITE,
  },
  cartBorder: {
    borderTopWidth: 3,
    borderEndWidth: 2,
    borderStartWidth: 2,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: '#FFA700',
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
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  scheduleTitle: {
    fontSize: FONT_SIZE.L,
    marginRight: moderateScale(15),
    fontFamily: FONT.BOLD,
  },
  scheduleText: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
});

export default OrderTypeSelection;

