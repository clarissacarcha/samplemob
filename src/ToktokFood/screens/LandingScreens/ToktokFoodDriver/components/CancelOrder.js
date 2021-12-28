import React, {useState} from 'react';
import {View, StyleSheet, Modal, Text, TouchableOpacity} from 'react-native';
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

import {COLOR, FONT, FONT_SIZE, SIZE} from 'res/variables';

import {useNavigation} from '@react-navigation/native';

import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {PATCH_CANCEL_CUSTOMER_ORDER} from 'toktokfood/graphql/toktokfood';

import DialogMessage from 'toktokfood/components/DialogMessage';

const CancelOrder = ({
  visibility = false,
  onCloseSheet,
  failedCancel,
  referenceOrderNumber = '',
  setShowLoader,
  onCallBackResult
}) => {
  const reasonList = [
    {
      id: 1,
      reason: 'I changed my mind',
    },
    {
      id: 2,
      reason: 'I wanted to change location',
    },
    {
      id: 3,
      reason: 'Merchant took so long to accept',
    },
    {
      id: 4,
      reason: 'Change order type (Pick up or Delivery)',
    },
  ];

  const navigation = useNavigation();
  const [showReason, setShowReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState('I changed my mind');

  const [postCancelOrder] = useMutation(PATCH_CANCEL_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: (error) => {
      failedCancel()
    },
    onCompleted: ({cancelOrder}) => {
      setShowReason(false);
      onCallBackResult(cancelOrder)
    },
  });

  const proccessCancelOrder = () => {
    setShowReason(false);
    setShowLoader(true);
    onCloseSheet();
    // console.log(referenceOrderNumber, selectedReason)
    postCancelOrder({
      variables: {
        input: {
          reference_num: referenceOrderNumber,
          reason: selectedReason,
        },
      },
    });
  };

  const closeCancel = () => {
    onCloseSheet();
    setShowReason(false);
  };

  const RoundedButton = (props) => {
    const {id, selected, onSelect} = props;
    const componentClick = () => {
      onSelect(selected);
    };
    return (
      <>
        <View
          onTouchStart={() => componentClick()}
          key={id}
          style={[
            {
              width: 20,
              height: 20,
              borderWidth: 2,
              borderRadius: 50,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: '#FFA700',
            },
          ]}>
          {selected ? (
            <View
              style={{
                height: 11,
                width: 11,
                borderRadius: 50,
                backgroundColor: '#FFA700',
              }}
            />
          ) : null}
        </View>
      </>
    );
  };

  const CancelReasons = () => {
    return (
      <>
        <View style={[styles.reasonWrapper, styles.shadow]}>
          <View style={styles.reasonContent}>
            <Text style={styles.cancelTitle}>Choose a reason below</Text>
            <View style={styles.reasonListWrapper}>
              {reasonList.map((v, i) => {
                return (
                  <View style={styles.itemWrapper}>
                    <RoundedButton
                      id={v.id}
                      onSelect={() => setSelectedReason(v.reason)}
                      selected={selectedReason === v.reason}
                    />
                    <Text numberOfLines={1} style={styles.itemText}>
                      {v.reason}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.reasonButtonWrapper}>
              <TouchableOpacity
                onPress={() => closeCancel()}
                style={[styles.reasonButtons, {backgroundColor: '#868686'}]}>
                <Text style={styles.reasonButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => proccessCancelOrder()}
                style={[styles.reasonButtons, {backgroundColor: '#FFA700'}]}>
                <Text style={styles.reasonButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <Modal
        style={styles.container}
        visible={visibility}
        transparent={true}
        animationType="slide"
        presentationStyle="overFullScreen">
        <View style={[styles.content, {justifyContent: showReason ? 'center' : 'flex-end'}]}>
          {showReason && <CancelReasons />}
          {!showReason && (
            <View style={[styles.wrapper, styles.cartBorder]}>
              <View style={styles.sheet}>
                <Text style={styles.cancelTitle}>This order will be canceled. Would you like to proceed?</Text>
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity onPress={() => setShowReason(true)} style={styles.cartButton}>
                    <Text style={styles.buttonText}>Yes, Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onCloseSheet()} style={styles.cartButton}>
                    <Text style={styles.buttonText}>No, Go Back</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
  },
  wrapper: {
    height: '40%',
    width: '101%',
    position: 'absolute',
    backgroundColor: COLOR.WHITE,
  },
  cartBorder: {
    borderTopWidth: 3,
    borderEndWidth: 2,
    borderStartWidth: 2,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderColor: COLOR.ORANGE,
    marginHorizontal: -2,
  },
  sheet: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelTitle: {
    fontSize: 19,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: FONT.BOLD,
    marginBottom: verticalScale(7),
  },
  buttonWrapper: {
    height: 120,
    display: 'flex',
    justifyContent: 'space-between',
  },
  cartButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    backgroundColor: '#FFA700',
    width: getDeviceWidth - 28,
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  reasonWrapper: {
    width: '90%',
    height: verticalScale(400),
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFF',
    paddingVertical: scale(18),
  },
  shadow: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reasonContent: {
    flex: 1,
    paddingVertical: 10,
  },
  reasonListWrapper: {
    marginTop: 18,
    height: 200,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    padding: 5,
  },
  itemText: {
    fontSize: 14,
    fontFamily: FONT.REGULAR,
  },
  reasonButtonWrapper: {
    width: 250,
    alignSelf: 'center',
    marginTop: 18,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
  },
  reasonButtons: {
    height: 55,
    width: 109,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  reasonButtonText: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
    color: COLOR.WHITE,
  },
});

export default CancelOrder;
