import React, {useEffect, useState} from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT} from 'res/variables';
// Images
import {chat, phoneBlack} from 'toktokfood/assets/images';
// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {checkRiderDetails} from 'toktokfood/helper/ShowRiderDetails';

const OrderRider = ({riderDetails, transaction, referenceNum}) => {
  const {user, vehicle} = riderDetails;
  const [showDriverModal, setShowDriverModal] = useState(false);

  useEffect(() => {
    if (riderDetails != null && transaction.orderStatus != 's') {
      handleCheckRiderDetails();
    }
  }, [riderDetails, transaction]);

  const handleCheckRiderDetails = async () => {
    let res = await checkRiderDetails(referenceNum);
    setShowDriverModal(res?.status == 200);
  };

  const onMessage = () => {
    const url = `sms:${user.person.mobileNumber}`;
    Linking.openURL(url);
  };

  const onCall = () => {
    const url = `tel:${user.person.mobileNumber}`;
    Linking.openURL(url);
  };

  const renderAvatar = (rating = 4) => (
    <View style={styles.avatarContainer}>
      <Image resizeMode="cover" style={styles.avatar} source={{uri: user.person.avatar}} />
      <View style={styles.leftContainer}>
        <Text style={styles.riderName}>{`${user.person.firstName} ${user.person.lastName}`}</Text>
        <Text style={styles.orderNumber}>{user.person.mobileNumber}</Text>
        <Text style={styles.notes}>{vehicle.plateNumber}</Text>
        <Text style={styles.notes}>{`${vehicle.brand.brand} ${vehicle.model.model}`}</Text>
        {/* <Text style={styles.notes}>{parseFloat(rating).toFixed(1)}</Text>
          <Rating startingValue={parseFloat(rating).toFixed(1)} imageSize={13} readonly style={styles.ratings} ratingColor={"#FFA700"} /> */}
        {/* <CustomStarRating
          rating={'0'}
          starImgStyle={{ width: scale(15), height: scale(15), marginVertical: 5 }}
          ratingStyle={{ color: 'black', fontSize: FONT_SIZE.S }}
          readOnly
          showRating
          rightRating
        /> */}
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionContainer}>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onMessage}>
          <Image resizeMode="contain" style={styles.phone} source={chat} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCall}>
          <Image resizeMode="contain" style={styles.phone} source={phoneBlack} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <RatingModal
        title={"We've found you a driver!"}
        visibility={showDriverModal}
        onCloseModal={() => setShowDriverModal(false)}
        btnTitle="Ok"
        imgSrc={user.person.avatar}
        rating={0}
        readOnly
      >
        <Text style={styles.messageTitle}>{`${user.person.firstName} ${user.person.lastName}`}</Text>
        <Text style={styles.messageContent}>{user.person.mobileNumber}</Text>
        <Text style={styles.messageContent}>{
          `${vehicle.brand.brand} ${vehicle.model.model} - ${vehicle.plateNumber}`
        }</Text>
      </RatingModal> */}
      <View style={styles.content}>
        {renderAvatar()}
        {renderActions()}
      </View>
      {/* <View style={styles.riderInfo}>
        <Text style={styles.notes}>{riderConno}</Text>
        <Text style={styles.notes}>{riderPlatenum}</Text>
      </View> */}
    </View>
  );
};

export default OrderRider;

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionContainer: {
    justifyContent: 'space-between',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 100,
  },
  avatarContainer: {
    flexDirection: 'row',
    // paddingBottom: 10
  },
  leftContainer: {
    paddingHorizontal: 15,
  },
  orderNumber: {
    fontWeight: '400',
  },
  phone: {
    width: 20,
    height: 20,
    marginLeft: 20,
    tintColor: COLORS.YELLOWTEXT,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riderInfo: {
    borderTopWidth: 1,
    borderColor: '#DDDDDD',
    marginTop: verticalScale(5),
    paddingTop: moderateScale(5),
  },
  riderName: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  star: {
    width: 10,
    height: 10,
    marginLeft: 3,
    alignSelf: 'center',
  },
  notes: {
    fontWeight: '300',
    fontSize: FONT_SIZE.M,
  },
  container: {
    backgroundColor: 'white',
    padding: moderateScale(20),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
