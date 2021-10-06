import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, View, Alert} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import {useSelector} from 'react-redux';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import {down_arrow_ic, markerIcon} from 'toktokfood/assets/images';
import {moderateScale} from 'toktokfood/helper/scale';

import DialogMessage from 'toktokfood/components/DialogMessage';

import {DELETE_SHOP_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery} from '@apollo/react-hooks';

import {CHECK_HAS_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';

const ChangeAddress = ({title = '', searchBox = true, backOnly = false, styleContainer}) => {
  const navigation = useNavigation();
  const {location, customerInfo} = useSelector((state) => state.toktokFood);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const onSetLocationDetails = () => {
    navigation.navigate('ToktokFoodAddressDetails');
    setShowConfirmation(false);
  };

  const renderLoader = () => (
    <ContentLoader
      active
      pRows={1}
      pWidth={['80%']}
      title={false}
      primaryColor="#FFFFFF"
      secondaryColor="rgba(256,186,28,0.4)"
    />
  );

  const [checkHasTemporaryCart, {data: temporaryCart}] = useLazyQuery(CHECK_HAS_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: (r) => {
      console.log(r);
    },
    onError: (err) => {
      Alert.alert('', 'Something went wrong.');
    },
  });

  const showConfirmationDialog = () => {
    if (temporaryCart?.checkHasTemporaryCart?.shopid !== 0) {
      setShowConfirmation(true);
    } else {
      onSetLocationDetails();
    }
  };

  useEffect(() => {
    checkHasTemporaryCart({variables: {input: {userId: customerInfo.userId}}});
  }, []);

  return (
    <>
      <DialogMessage
        visibility={showConfirmation}
        title="Change Location"
        messages="You will lose the items in your cart if you change location. Proceed?"
        type="warning"
        btn1Title="Cancel"
        btn2Title="Proceed"
        onCloseBtn1={() => {
          setShowConfirmation(false);
        }}
        onCloseBtn2={() => {
          onSetLocationDetails();
        }}
        hasTwoButtons
      />
      <View onTouchEndCapture={() => showConfirmationDialog()} style={[styles.container, styleContainer]}>
        <Text style={{color: '#FFA700', fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S}}>Deliver to</Text>
        <View style={styles.divider} />
        {location.address == undefined ? (
          renderLoader()
        ) : (
          <View style={styles.textAddressContainer}>
            <Image style={styles.addressMarkerIcon} source={markerIcon} />
            <Text style={styles.textAddress} numberOfLines={1}>
              {location.address}
            </Text>
            <Image style={styles.downArrowIc} source={down_arrow_ic} />
          </View>
        )}
      </View>
    </>
  );
};

export default ChangeAddress;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(25),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(15),
  },
  textAddressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
  },
  textAddress: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.REGULAR,
    flexShrink: 1,
  },
  addressMarkerIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    marginRight: 4,
    resizeMode: 'contain',
  },
  divider: {
    marginHorizontal: 10,
    height: '100%',
    width: 1,
    backgroundColor: '#FFA700',
  },
  downArrowIc: {
    width: moderateScale(12),
    height: moderateScale(12),
    marginLeft: 4,
    resizeMode: 'contain',
  },
});
