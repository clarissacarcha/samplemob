import React from 'react';
import {View, StyleSheet, Modal, Text, TouchableOpacity} from 'react-native';
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

import {COLOR, FONT, FONT_SIZE, SIZE} from 'res/variables';

import {useNavigation} from '@react-navigation/native';

import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {PATCH_CANCEL_CUSTOMER_ORDER} from 'toktokfood/graphql/toktokfood';

const CancelOrder = ({visibility = false, onCloseSheet, failedCancel, referenceOrderNumber = '', onProcess}) => {
  const navigation = useNavigation();

  const [postCancelOrder] = useMutation(PATCH_CANCEL_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: (error) => console.log(`LOCATION LOG ERROR: ${error}`),
    onCompleted: ({cancelOrder}) => {
      if (cancelOrder.status == 200) {
        navigation.pop();
      } else {
        failedCancel();
      }
    },
  });

  const cancelCurrentOrder = () => {
    onCloseSheet();
    onProcess();
    postCancelOrder({
      variables: {
        input: {
          reference_num: referenceOrderNumber,
        },
      },
    });
  };

  return (
    <>
      <Modal style={styles.container} visible={visibility} transparent={true}>
        <View style={styles.content}>
          <View style={[styles.proto, styles.cartBorder]}>
            <View style={styles.sheet}>
              <Text style={styles.cancelTitle}>This order will be canceled. Would you like to proceed?</Text>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => cancelCurrentOrder()} style={styles.cartButton}>
                  <Text style={styles.buttonText}>Yes, Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onCloseSheet()} style={styles.cartButton}>
                  <Text style={styles.buttonText}>No, Go Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
  },
  proto: {
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
    backgroundColor: COLOR.ORANGE,
    width: getDeviceWidth - 28,
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});

export default CancelOrder;
