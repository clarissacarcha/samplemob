import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {timer, pot, toktok_rider, rider1} from 'toktokfood/assets/images';

// Utils
import {scale, moderateScale, verticalScale} from 'toktokfood/helper/scale';

import DialogMessage from 'toktokfood/components/DialogMessage';
import RatingModal from 'toktokfood/components/RatingModal';

const DriverAnimationView = ({orderStatus, riderDetails, orderIsfor}) => {
  const [iShowSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setShowSuccess(riderDetails != null);
  }, [riderDetails]);

  const CancelOrderComponent = () => {};
 
  return (
    <View style={styles.container}>
      {/* <DialogMessage
        type="success"
        title="Yehey!"
        visibility={iShowSuccess}
        messages="We've found you a driver"
        onCloseModal={() => setShowSuccess(false)}
      /> */}
      <RatingModal
        title={"We've found you a driver!"}
        visibility={iShowSuccess}
        onCloseModal={() => setShowSuccess(false)}
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
      </RatingModal>
      {/* Contact Support */}
      <Text style={styles.contactSupportText}></Text>
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={orderIsfor == 1 ? riderDetails == null ? timer : toktok_rider : pot}
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
  },
  contactSupportText: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'right',
    color: COLORS.YELLOWTEXT,
    paddingRight: moderateScale(20),
  },
  img: {
    width: 250,
    height: 150,
    marginBottom: 20
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
  },
});
