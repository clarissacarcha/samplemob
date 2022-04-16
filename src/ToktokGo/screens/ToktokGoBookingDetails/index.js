import React from 'react';
import {
  BookingID,
  BookingDriverDetails,
  BookingAddress,
  BookingInfo,
  BookingNote,
  BookingTotal,
  BookingStatus,
  BookingCancelledNote,
  BookingMap,
} from './Sections';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {HeaderBack, HeaderTitle} from '../../../components';
import CONSTANTS from '../../../common/res/constants';
import {connect} from 'react-redux';

const screenWidth = Dimensions.get('window').width;
const modalHeight = (Dimensions.get('window').width / 1.55) * 2;

const SelectedBookingDetails = ({navigation, session, createSession, route}) => {
  const {delivery} = route.params;
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Booking Details', '']} />,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <BookingID delivery={delivery} />
      {/* todo: replace condition if status is ongoing */}
      {true && (
        <>
          <BookingDriverDetails stop={delivery.senderStop} />
          <View style={{borderBottomWidth: 8, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
        </>
      )}

      <BookingInfo delivery={delivery} />
      <BookingNote delivery={delivery} />

      {/* todo: replace condition if status is completed */}
      {true && <BookingMap delivery={delivery} />}
      <BookingAddress delivery={delivery} />
      <BookingTotal delivery={delivery} dummyStatus={session.dummyStatus} />

      <View style={{borderBottomWidth: 8, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />

      <BookingStatus logs={delivery.logs} delivery={delivery} session={session} />
      {/* todo: replace condition if status is cancelled */}
      {true && <BookingCancelledNote />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    marginHorizontal: 0,
  },
});

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedBookingDetails);
