import React, {useState} from 'react';
import {Rating} from 'react-native-ratings';
import {View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput} from 'react-native';

import {COLOR} from 'res/variables';
import {COLORS, FONTS, FONT_SIZE, BUTTON_HEIGHT} from 'res/constants';

import {rider1} from 'toktokfood/assets/images';
import {availableTips} from 'toktokfood/helper/strings';
import {verticalScale, moderateScale, scale, getDeviceWidth} from 'toktokfood/helper/scale';

import InputScrollView from 'react-native-input-scroll-view';

// Components
import HeaderImageBackground from './components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';

const ToktokRiderRating = () => {
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState(availableTips[0]);

  const RiderInfo = () => {
    return (
      <View style={styles.riderWrapper}>
        <Text style={styles.riderName}>Edward Nolasco Rosario</Text>
        <View style={styles.ratingWrapper}>
          <Text style={styles.ratingText}>3.5</Text>
          <Rating startingValue={3.5} imageSize={13} readonly style={styles.ratings} />
          <Text style={styles.ratingText}>09097570947</Text>
        </View>
      </View>
    );
  };

  const RatingAction = () => {
    return (
      <View style={styles.ratingActionWrapper}>
        <Rating onFinishRating={(r) => setRating(r)} startingValue={rating} imageSize={35} style={styles.ratings} />
      </View>
    );
  };

  const renderItem1 = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(item)}
        style={[styles.tipButton, activeTab.id === item.id && styles.activeButtonTip]}>
        <Text style={[styles.tipButtonText, activeTab.id === item.id && styles.activeTabText]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const WalletActions = () => {
    return (
      <View style={styles.tokWalletWrapper}>
        <View style={styles.walletBalanceWrapper}>
          <Text style={styles.walletBalanceText}>toktokwallet balance: </Text>
          <Text style={styles.walletBalanceText}>PHP 300.00</Text>
        </View>
        <Text style={styles.tipTitle}>Give a tip to make your rider happy!</Text>
        <View style={styles.tipButtonWrapper}>
          <FlatList
            row
            data={availableTips}
            scrollEnabled={false}
            renderItem={renderItem1}
            numColumns={availableTips.length / 2}
            showsHorizontalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.inputTipWrapper}>
          <View style={[styles.deliverWrapper, {paddingVertical: 10}]}>
            <Text style={styles.walletBalanceText}>Enter other amount</Text>
          </View>
          <TextInput
            multiline={true}
            numberOfLines={1}
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="Enter amount here..."
            placeholderTextColor={COLOR.MEDIUM}
          />
        </View>
      </View>
    );
  };

  const RateComments = () => {
    return (
      <View style={styles.tokWalletWrapper}>
        <View style={styles.inputTipWrapper}>
          <View style={[styles.deliverWrapper, {paddingVertical: 10}]}>
            <Text style={styles.walletBalanceText}>What did you like about the delivery?</Text>
          </View>
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={[styles.input, {height: moderateScale(90)}]}
            placeholder="Tell us more (Optional)"
            placeholderTextColor={COLOR.MEDIUM}
          />
          <TouchableOpacity style={styles.submitRatingButton} onPress={() => {}}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <>
      <View style={styles.container}>
        <HeaderImageBackground>
          <HeaderTitle forRating={true} />
          <Image source={rider1} style={styles.riderAvatar} />
        </HeaderImageBackground>
        <InputScrollView contentContainerStyle={{paddingBottom: 220}}>
          <RiderInfo />
          <RatingAction />
          <WalletActions />
          <RateComments/>
        </InputScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  riderAvatar: {
    width: 138,
    height: 138,
    marginTop: 18,
    borderRadius: 100,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  riderWrapper: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 8,
    borderBottomColor: COLOR.LIGHT,
  },
  riderName: {
    fontSize: 19,
    fontFamily: FONTS.MEDIUM,
  },
  ratingWrapper: {
    width: 195,
    display: 'flex',
    marginTop: 3,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratings: {
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: FONTS.MEDIUM,
  },
  ratingActionWrapper: {
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 8,
    borderBottomColor: COLOR.LIGHT,
  },
  tokWalletWrapper: {
    paddingVertical: 14,
    borderBottomWidth: 8,
    paddingHorizontal: 12,
    borderBottomColor: COLOR.LIGHT,
  },
  walletBalanceWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 22,
  },
  walletBalanceText: {
    fontSize: 15,
    fontFamily: FONTS.MEDIUM,
  },
  tipTitle: {
    fontSize: 13,
    textAlign: 'center',
    fontFamily: FONTS.NORMAL,
  },
  tipButtonWrapper: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipButton: {
    height: 50,
    width: 100,
    borderWidth: 2,
    borderRadius: 10,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.YELLOW,
  },
  tipButtonText: {
    fontSize: 15,
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
  },
  activeButtonTip: {
    backgroundColor: COLORS.YELLOW,
  },
  deliverWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },
  input: {
    height: moderateScale(55),
    borderWidth: 1,
    borderRadius: 10,
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
    borderColor: COLORS.MEDIUM,
    marginVertical: scale(6),
    paddingTop: 15,
    paddingHorizontal: scale(15),
  },
  submitRatingButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: BUTTON_HEIGHT,
    backgroundColor: COLOR.YELLOW,
    width: getDeviceWidth - 28,
    marginTop: scale(10),
  },
  buttonText: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONTS.BOLD,
  },
});

export default ToktokRiderRating;
