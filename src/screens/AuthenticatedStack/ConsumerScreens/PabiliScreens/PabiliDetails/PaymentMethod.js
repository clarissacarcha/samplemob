import React, {useMemo, forwardRef, useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableHighlight, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {LIGHT, ORANGE} from '../../../../../res/constants';
import {COLOR, FONT} from '../../../../../res/variables';
import {WhiteButton, VectorIcon, ICON_SET, Shadow} from '../../../../../revamp';

import ToktokWalletIcon from '../../../../../assets/images/toktokwalletlanding.png';

export const PaymentMethodSheet = forwardRef(({onChange, balanceText, hasWallet, price, getWalletBalance}, ref) => {
  const state = useSelector(state => state);
  const snapPoints = useMemo(() => [0, state.constants.isToktokwalletAvailable == 1 ? 181 : 101], []);

  const navigation = useNavigation();

  const [hasEnoughBalance, setHasEnoughBalance] = useState(
    parseFloat(balanceText.replace(/,/g, '')) >= parseFloat(price),
  );

  useEffect(() => {
    setHasEnoughBalance(parseFloat(balanceText.replace(/,/g, '')) >= parseFloat(price));
  }, [price, balanceText]);

  const onCashIn = () => {
    getWalletBalance();
  };

  const onCashInClick = () => {
    console.log('CASH IN');
    navigation.push('ToktokWalletPaymentOptions', {
      amount: parseFloat(price) - parseFloat(balanceText.replace(/,/g, '')),
      onCashIn: onCashIn,
    });
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      handleComponent={() => <View style={styles.sheetBox} />}
      backdropComponent={BottomSheetBackdrop}>
      <View style={styles.sheet}>
        <Text style={{fontFamily: FONT.BOLD}}>Payment Method</Text>
        <View style={{height: 10}} />
        {/* <WhiteButton
          label="Cash"
          borderless
          labelStyle={{fontFamily: FONT.REGULAR}}
          onPress={() => {
            onChange('CASH');
            ref.current.collapse();
          }}
        /> */}
        <View style={{flexDirection: 'row', alignItems: 'center', height: 70}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Shadow style={{borderRadius: 5}}>
              <TouchableHighlight
                onPress={() => {
                  onChange('CASH');
                  ref.current.collapse();
                }}
                style={{borderRadius: 5}}
                underlayColor={COLOR.YELLOW_UNDERLAY}>
                <View
                  style={{backgroundColor: 'white', flexDirection: 'row', borderRadius: 5, padding: 8, minWidth: 150}}>
                  <View style={{padding: 2, backgroundColor: COLOR.YELLOW, borderRadius: 5, marginRight: 8}}>
                    {/* <Image source={ToktokWalletIcon} style={{height: 30, width: 30}} resizeMode="contain" /> */}
                    <View style={{height: 30, width: 30, justifyContent: 'center', alignItems: 'center'}}>
                      <View
                        style={{
                          height: 25,
                          width: 25,
                          borderRadius: 15,
                          borderWidth: 2,
                          borderColor: COLOR.WHITE,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{color: COLOR.WHITE, fontSize: 13}}>₱</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{color: COLOR.YELLOW}}>Cash</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </Shadow>
          </View>
        </View>
        <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />
        {hasWallet && state.constants.isToktokwalletAvailable == 1 && hasEnoughBalance && (
          <View style={{flexDirection: 'row', alignItems: 'center', height: 70}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Shadow style={{borderRadius: 5}}>
                <TouchableHighlight
                  onPress={() => {
                    onChange('TOKTOKWALLET');
                    ref.current.collapse();
                  }}
                  style={{borderRadius: 5}}
                  underlayColor={COLOR.YELLOW_UNDERLAY}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      flexDirection: 'row',
                      borderRadius: 5,
                      padding: 8,
                      minWidth: 150,
                    }}>
                    <View style={{padding: 2, backgroundColor: COLOR.YELLOW, borderRadius: 5, marginRight: 8}}>
                      <Image source={ToktokWalletIcon} style={{height: 30, width: 30}} resizeMode="contain" />
                    </View>
                    <View style={{}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: COLOR.YELLOW}}>toktok</Text>
                        <Text style={{color: COLOR.ORANGE}}>wallet</Text>
                      </View>

                      <Text style={{fontSize: 9}}>{`Balance: PHP ${balanceText}`}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </Shadow>
            </View>
          </View>
        )}
        {hasWallet && !hasEnoughBalance && state.constants.isToktokwalletAvailable == 1 && (
          <View style={{flexDirection: 'row', alignItems: 'center', height: 70}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Shadow style={{borderRadius: 5}}>
                <TouchableHighlight
                  disabled
                  onPress={() => {}}
                  style={{borderRadius: 5}}
                  underlayColor={COLOR.YELLOW_UNDERLAY}>
                  <View
                    style={{
                      backgroundColor: '#E5E5E5',
                      flexDirection: 'row',
                      borderRadius: 5,
                      padding: 8,
                      minWidth: 150,
                    }}>
                    <View style={{padding: 2, backgroundColor: COLOR.YELLOW, borderRadius: 5, marginRight: 8}}>
                      <Image source={ToktokWalletIcon} style={{height: 30, width: 30}} resizeMode="contain" />
                    </View>
                    <View style={{}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: COLOR.YELLOW}}>toktok</Text>
                        <Text style={{color: COLOR.ORANGE}}>wallet</Text>
                      </View>

                      <Text style={{fontSize: 9}}>{`Balance: PHP ${balanceText}`}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </Shadow>
            </View>
            <TouchableOpacity
              onPress={onCashInClick}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <Text style={{color: COLOR.ORANGE}}>Insufficient balance.</Text>
              <Text style={{color: COLOR.ORANGE}}>Please click here to cash in.</Text>
            </TouchableOpacity>
          </View>
        )}

        {hasWallet === null && state.constants.isToktokwalletAvailable == 1 && (
          <View style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR.YELLOW} />
          </View>
        )}

        {hasWallet === false && state.constants.isToktokwalletAvailable == 1 && (
          <View style={{flexDirection: 'row', alignItems: 'center', height: 70}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Shadow style={{borderRadius: 5}}>
                <TouchableHighlight
                  disabled
                  onPress={() => {}}
                  style={{borderRadius: 5}}
                  underlayColor={COLOR.YELLOW_UNDERLAY}>
                  <View
                    style={{
                      backgroundColor: '#EEEEEE',
                      flexDirection: 'row',
                      borderRadius: 5,
                      padding: 8,
                      minWidth: 150,
                    }}>
                    <View style={{padding: 2, backgroundColor: COLOR.YELLOW, borderRadius: 5, marginRight: 8}}>
                      <Image source={ToktokWalletIcon} style={{height: 30, width: 30}} resizeMode="contain" />
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: COLOR.YELLOW}}>toktok</Text>
                        <Text style={{color: COLOR.ORANGE}}>wallet</Text>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              </Shadow>
            </View>
            <TouchableOpacity
              onPress={() => navigation.push('ToktokWalletLoginPage')}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <Text style={{color: COLOR.ORANGE, textAlign: 'center'}}>Create your toktokwallet account now!</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheet>
  );
});

export const PaymentMethodForm = ({value, bottomSheetRef}) => {
  return (
    <View style={styles.box}>
      <Text style={{fontFamily: FONT.BOLD}}>Payment Method</Text>
      <View style={styles.spacing} />
      {/* <WhiteButton
        label={value}
        labelColor={MEDIUM}
        suffixSet="Material"
        suffixName="arrow-forward"
        suffixColor={LIGHT}
        delay={0}
        onPress={() => {
          bottomSheetRef.current.expand();
        }}
      /> */}

      <TouchableHighlight
        underlayColor={COLOR.WHITE_UNDERLAY}
        onPress={() => {
          bottomSheetRef.current.expand();
        }}
        style={{
          borderRadius: 5,
        }}>
        <View
          style={{
            height: 50,
            alignItems: 'center',
            backgroundColor: COLOR.LIGHT,
            borderRadius: 5,
            paddingHorizontal: 8,
            flexDirection: 'row',
          }}>
          <Text style={{flex: 1, color: value ? COLOR.BLACK : COLOR.MEDIUM}}>{value}</Text>
          <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-thin-right" color={COLOR.BLACK} />
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginBottom: 20,
  },
  sheet: {
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: LIGHT,
    borderRadius: 5,
    fontSize: 14,
  },
  spacing: {height: 5},
  sheetBox: {
    height: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopWidth: 3,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: ORANGE,
    marginHorizontal: -2,
  },
});
