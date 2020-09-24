import React, {useState, useEffect} from 'react';
import {View, Text, Modal, StyleSheet, ActivityIndicator, TouchableHighlight, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {useSubscription, useMutation} from '@apollo/react-hooks';
import {
  CLIENT,
  ON_DELIVERY_DISPATCH,
  PATCH_DELIVERY_ACCEPTED,
  PATCH_DRIVER_GO_ONLINE,
  PATCH_DRIVER_GO_OFFLINE,
} from '../graphql';
import {BookingInfoCard} from '../components';
import {COLOR, DARK} from '../res/constants';
import Toast from 'react-native-simple-toast';

const GoOnlineOverlay = ({onDismiss, session}) => {
  const [deliveryOrder, setDeliveryOrder] = useState(null);

  const [patchDeliveryAccepted, {loading: acceptLoading}] = useMutation(PATCH_DELIVERY_ACCEPTED, {
    onCompleted: ({patchDeliveryAccepted}) => {
      setDeliveryOrder(null);
      // alert(JSON.stringify(patchDeliveryAccepted));
      Toast.show(patchDeliveryAccepted);
    },
    onError: ({graphQLErrors, networkError}) => {
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      }
      if (graphQLErrors) {
        Alert.alert('', graphQLErrors[0].message);
      }
    },
  });

  const [patchDriverGoOnline, {loading: onlineLoading}] = useMutation(PATCH_DRIVER_GO_ONLINE, {
    variables: {
      input: {
        driverId: session.user.driver.id,
      },
    },
    onCompleted: ({patchDriverGoOnline}) => {
      Toast.show(patchDriverGoOnline);
    },
  });

  const [patchDriverGoOffline, {loading: offlineLoading}] = useMutation(PATCH_DRIVER_GO_OFFLINE, {
    variables: {
      input: {
        driverId: session.user.driver.id,
      },
    },
    onCompleted: ({patchDriverGoOffline}) => {
      Toast.show(patchDriverGoOffline);
    },
  });

  const onDispatchReceived = ({subscriptionData, client}) => {
    if (subscriptionData.error) {
      return;
    }
    if (!subscriptionData.data) {
      return;
    }

    if (!deliveryOrder) {
      setDeliveryOrder(subscriptionData.data.onDeliveryDispatch.delivery);
    } else {
      // Do nothing. The user has already a delivery on his screen.
    }
  };

  useEffect(() => {
    patchDriverGoOnline();
  }, []);

  const {data, loading, error} = useSubscription(ON_DELIVERY_DISPATCH, {
    client: CLIENT,
    fetchPolicy: 'network-only',
    onSubscriptionData: onDispatchReceived,
    variables: {
      userId: session.user.id,
    },
  });

  const onAccept = () => {
    patchDeliveryAccepted({
      variables: {
        input: {
          deliveryId: deliveryOrder.id,
          // TODO: Replace with driverId from session
          driverId: session.user.driver.id,
        },
      },
    });
  };

  const onReject = () => {
    setDeliveryOrder(null);
  };

  const onGoOffline = () => {
    setDeliveryOrder(null);
    patchDriverGoOffline();
    onDismiss();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.transparent}>
        <View style={styles.labelRow}>
          {/*-------------------- STATUS LABEL --------------------*/}
          <View style={styles.labelBox}>
            <Text style={{fontFamily: 'Rubik-Medium'}}>
              {!deliveryOrder ? 'Waiting for a Delivery Order' : 'New Delivery Order Found'}
            </Text>
            {!deliveryOrder && <ActivityIndicator color={DARK} />}
          </View>

          {/*-------------------- GO OFFLINE BUTTON --------------------*/}
          <TouchableOpacity style={styles.offlineTouchable} onPress={onGoOffline} activeOpacity={0.5}>
            <Text style={{color: COLOR, fontFamily: 'Rubik-Medium'}}>Go Offline</Text>
          </TouchableOpacity>
        </View>

        {deliveryOrder && (
          <View>
            <View style={{marginHorizontal: -10}}>
              <BookingInfoCard delivery={deliveryOrder} />
            </View>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              {/*-------------------- ACCEPT BUTTON --------------------*/}
              <TouchableOpacity onPress={onAccept} style={styles.accept} activeOpacity={0.6}>
                <Text style={styles.acceptText}>Accept Order</Text>
              </TouchableOpacity>

              {/*-------------------- REJECT BUTTON --------------------*/}
              <TouchableOpacity onPress={onReject} style={styles.rejectTouchable} activeOpacity={0.6}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(
  mapStateToProps,
  null,
)(GoOnlineOverlay);

const styles = StyleSheet.create({
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  labelRow: {
    marginTop: 150,
    marginBottom: 10,
    height: 40,
    flexDirection: 'row',
  },
  labelBox: {
    flex: 1,
    backgroundColor: COLOR,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  iconBox: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  offlineTouchable: {
    marginLeft: 20,
    borderRadius: 10,
    width: 100,
    height: 40,
    backgroundColor: DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accept: {
    backgroundColor: COLOR,
    height: 50,
    borderRadius: 10,
    flex: 1,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    color: DARK,
    fontSize: 20,
    fontFamily: 'Rubik-Medium',
  },
  rejectTouchable: {
    backgroundColor: DARK,
    height: 50,
    width: 100,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectText: {
    color: COLOR,
    fontSize: 20,
    fontFamily: 'Rubik-Medium',
  },
});
