import React, {useState, useEffect, useRef} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';
import {timer, pot, toktok_rider, ready_for_pickup } from 'toktokfood/assets/images';

// Utils
import {scale, moderateScale, verticalScale} from 'toktokfood/helper/scale';

import DialogMessage from 'toktokfood/components/DialogMessage';
import RatingModal from 'toktokfood/components/RatingModal';
import { saveRiderDetails, checkRiderDetails, getRiderDetails, clearRiderDetails } from 'toktokfood/helper/ShowRiderDetails';
import {orderStatusMessageDelivery, orderStatusMessagePickUp} from 'toktokfood/helper/orderStatusMessage';

const statusImage = (orderIsfor, orderStatus) => {
  if(orderStatus == 'p'){
    return timer
  } else if(orderIsfor == 2 && orderStatus == 'rp'){
    return ready_for_pickup
  } else {
    return pot
  }
}

const DriverAnimationView = ({orderStatus, riderDetails, orderIsfor, referenceNum}) => {
  const [showDriverModal, setShowDriverModal] = useState(false);
  const status = orderIsfor == 1 ? orderStatusMessageDelivery(orderStatus) : orderStatusMessagePickUp(orderStatus)

  useEffect(() => {
    if(riderDetails != null && orderStatus != 's'){
      handleCheckRiderDetails();
    }
  }, [riderDetails, orderStatus]);

  const handleCheckRiderDetails = async() => {
    let res = await checkRiderDetails(referenceNum)
    setShowDriverModal(res?.status == 200)
  }

  return (
    <View style={styles.container}>
      {/* <DialogMessage
        type="success"
        title="Yehey!"
        visibility={iShowSuccess}
        messages="We've found you a driver"
        onCloseModal={() => setShowSuccess(false)}
      /> */}
      {/* <RatingModal
        title={"We've found you a driver!"}
        visibility={showDriverModal}
        onCloseModal={() => setShowDriverModal(false)}
        btnTitle="Ok"
        imgSrc={riderDetails?.user.person.avatar}
        rating={0}
        readOnly
        // showRating
      >
        <Text style={styles.messageTitle}>{`${riderDetails?.user.person.firstName} ${riderDetails?.user.person.lastName}`}</Text>
        <Text style={styles.messageContent}>{riderDetails?.user.person.mobileNumber}</Text>
        <Text style={styles.messageContent}>{
          `${riderDetails?.vehicle.brand.brand} ${riderDetails?.vehicle.model.model} - ${riderDetails?.vehicle.plateNumber}`
        }</Text>
      </RatingModal> */}
      {/* Contact Support */}
      <View style={styles.imgContainer}>
        {(orderStatus != 's' && orderStatus != 'c' &&  orderStatus != 'f' && orderIsfor == 1) && (
          <Text style={styles.title}>{status.title}</Text>
        )}
        {(orderIsfor == 2) && (
          <Text style={styles.title}>{status.title}</Text>
        )}
        <Image
          style={styles.img}
          source={statusImage(orderIsfor, orderStatus)}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default DriverAnimationView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9'
  },
  contactSupportText: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'right',
    color: COLORS.YELLOWTEXT,
    paddingRight: moderateScale(20),
  },
  img: {
    width: moderateScale(180),
    height: moderateScale(180),
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: verticalScale(10),
  },
  title: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
    paddingBottom: verticalScale(30)
  },
});
