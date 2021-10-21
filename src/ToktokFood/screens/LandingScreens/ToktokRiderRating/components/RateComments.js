import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, FONTS } from 'res/constants';
import { scale, verticalScale } from 'toktokfood/helper/scale';
import { VerifyContext } from '../components';

export const RateComments = () => {
  const [rating, setRating] = useState(0);

  const {rateComments, setRateComments} = useContext(VerifyContext);

  const onChangeText = (val) => {
    setRateComments(val);
  };

  return (
    <View style={styles.tokWalletWrapper}>
      <View style={[styles.deliverWrapper, {paddingVertical: 10}]}>
        <Text style={styles.walletBalanceText}>What did you like about the delivery?</Text>
      </View>
      <View style={styles.textAreaContainer}>
        <TextInput
          value={rateComments}
          onChangeText={onChangeText}
          style={styles.textArea}
          underlineColorAndroid="transparent"
          placeholder="Tell us more (Optional)"
          numberOfLines={10}
          multiline={true}
          placeholderTextColor={'#A7A7A7'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
    borderColor: COLORS.MEDIUM,
    marginVertical: scale(6),
    paddingTop: 15,
    paddingHorizontal: scale(15),
    justifyContent: 'flex-start',
  },
  textAreaContainer: {
    borderColor: '#E5EAEA',
    borderWidth: 1,
    padding: 5,
    textAlignVertical: 'top',
    borderRadius: 10,
  },
  textArea: {
    height: verticalScale(70),
    textAlignVertical: 'top',
    fontFamily: FONTS.REGULAR,
    color: COLORS.BLACK,
    fontSize: 16,
    paddingHorizontal: scale(10),
    paddingTop: Platform.OS == 'ios' ? verticalScale(17) : verticalScale(10),
  },
  tokWalletWrapper: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  deliverWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },
  walletBalanceText: {
    fontSize: 15,
    fontFamily: FONTS.MEDIUM,
  },
});
