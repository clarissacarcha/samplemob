import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {timer, pot, toktok_rider} from 'toktokfood/assets/images';

// Utils
import {scale, moderateScale, verticalScale} from 'toktokfood/helper/scale';

import DialogMessage from 'toktokfood/components/DialogMessage';

const DriverAnimationView = ({status = 1}) => {
  const [iShowSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setShowSuccess(status === 2);
  }, [status]);

  const CancelOrderComponent = () => {};

  return (
    <View style={styles.container}>
      <DialogMessage
        type="success"
        title="Yehey!"
        visibility={iShowSuccess}
        messages="We've found you a driver"
        onCloseModal={() => setShowSuccess(false)}
      />
      {/* Contact Support */}
      <Text style={styles.contactSupportText}></Text>
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={status === 1 ? timer : status === 2 ? pot : toktok_rider}
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
