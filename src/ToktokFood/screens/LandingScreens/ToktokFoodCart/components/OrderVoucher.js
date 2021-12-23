import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

// Components
import StyledTextInput from 'toktokfood/components/StyledTextInput';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT} from 'res/variables';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

const OrderVoucher = () => {
  const [voucher, setVoucher] = useState('');

  const onChangeText = (value) => {
    setVoucher(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Voucher</Text>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subText}>* Invalid voucher code. Please check your voucher code.</Text>
      </View>

      <View style={styles.formContainer}>
        <StyledTextInput onChangeText={onChangeText} label="Voucher" value={voucher} />

        <TouchableOpacity style={styles.apply}>
          <Text style={styles.subText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderVoucher;

const styles = StyleSheet.create({
  apply: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: moderateScale(15),
  },
  formContainer: {
    flexDirection: 'row',
    marginTop: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
  subHeader: {
    backgroundColor: '#FFFCF4',
    paddingHorizontal: moderateScale(20),
  },
  subText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.M,
  },
  headerText: {
    fontWeight: '500',
    fontSize: FONT_SIZE.L,
  },
  container: {
    backgroundColor: 'white',
    paddingVertical: moderateScale(10),
  },
});
