import {throttle} from 'lodash';
import React, {useCallback, useEffect, useRef} from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import constants from '../../common/res/constants';
import WarningPNG from '../../assets/images/warning.png';
import FailedPNG from '../../assets/images/failed.png';
import SuccessPNG from '../../assets/images/Success.png';

export const ToktokAlertModal = ({
  close,
  imageType = 'warning',
  image,
  title,
  noImage,
  message,
  visible = false,
  onPressButtonLeft = null,
  onPressButtonRight = null,
  onPressSingleButton = null,
  buttonLeftText = null,
  buttonRightText = null,
  buttonSingleText = 'OK',
  customMessage = null,
}) => {
  const onPressLeft = onPressButtonLeft
    ? throttle(
        () => {
          onPressButtonLeft();
          close();
        },
        {trailing: false},
      )
    : close;
  const onPressRight = onPressButtonRight
    ? throttle(
        () => {
          onPressButtonRight();
          close();
        },
        {trailing: false},
      )
    : close;
  const onPressSingle = onPressSingleButton
    ? throttle(
        () => {
          onPressSingleButton(), close();
        },
        {trailing: false},
      )
    : close;

  const useThrottle = (cb, delayDuration) => {
    const options = {leading: true, trailing: false}; // add custom lodash options
    const cbRef = useRef(cb);
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    useEffect(() => {
      cbRef.current = cb;
    });
    return useCallback(
      throttle((...args) => cbRef.current(...args), delayDuration, options),
      [delayDuration],
    );
  };

  const onPressLeftThrottled = useThrottle(onPressLeft, 1000);
  const onPressRightThrottled = useThrottle(onPressRight, 1000);
  const onPressSingleThrottled = useThrottle(onPressSingle, 1000);

  const showImage = () => {
    if (imageType === 'warning') {
      return WarningPNG;
    } else if (imageType === 'success') {
      return SuccessPNG;
    } else if (imageType === 'failed') {
      return FailedPNG;
    } else {
      return image;
    }
  };

  const titleFontColor = () => {
    if (imageType === 'warning') {
      return constants.COLOR.YELLOW;
    } else if (imageType === 'success') {
      return constants.COLOR.ORANGE;
    } else if (imageType === 'failed') {
      return constants.COLOR.RED;
    } else {
      return image;
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {!noImage && <Image source={showImage()} style={{width: 135, height: 120, marginBottom: 20}} />}
            <View style={{alignItems: 'center'}}>
              {title && (
                <Text
                  style={{
                    fontFamily: constants.FONT_FAMILY.BOLD,
                    fontSize: constants.FONT_SIZE.XL + 3,
                    color: titleFontColor(),
                    marginBottom: 16,
                  }}>
                  {title}
                </Text>
              )}
              {!customMessage && (
                <Text
                  style={{
                    fontFamily: constants.FONT_FAMILY.REGULAR,
                    fontSize: constants.FONT_SIZE.M,
                    color: constants.COLOR.BLACK,
                    textAlign: 'center',
                  }}>
                  {message}
                </Text>
              )}
              {customMessage && customMessage()}
            </View>
            <View style={{marginTop: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
              {buttonLeftText && buttonRightText && (
                <>
                  <TouchableOpacity
                    onPress={onPressLeftThrottled}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      marginRight: 24,
                      alignItems: 'center',
                      borderRadius: 5,
                      backgroundColor: constants.COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: constants.COLOR.ORANGE,
                    }}>
                    <Text
                      style={{
                        fontFamily: constants.FONT_FAMILY.BOLD,
                        fontSize: constants.FONT_SIZE.XL,
                        color: constants.COLOR.ORANGE,
                      }}>
                      {buttonLeftText}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onPressRightThrottled}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      alignItems: 'center',
                      borderRadius: 5,
                      backgroundColor: constants.COLOR.ORANGE,
                      borderWidth: 1,
                      borderColor: constants.COLOR.ORANGE,
                    }}>
                    <Text
                      style={{
                        fontFamily: constants.FONT_FAMILY.BOLD,
                        fontSize: constants.FONT_SIZE.XL,
                        color: constants.COLOR.WHITE,
                      }}>
                      {buttonRightText}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {buttonSingleText && !(buttonLeftText && buttonRightText) && (
                <TouchableOpacity
                  onPress={onPressSingleThrottled}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    alignItems: 'center',
                    borderRadius: 5,
                    backgroundColor: constants.COLOR.ORANGE,
                    borderWidth: 1,
                    borderColor: constants.COLOR.ORANGE,
                  }}>
                  <Text
                    style={{
                      fontFamily: constants.FONT_FAMILY.BOLD,
                      fontSize: constants.FONT_SIZE.XL,
                      color: constants.COLOR.WHITE,
                    }}>
                    {buttonSingleText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: constants.COLOR.WHITE,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
});
