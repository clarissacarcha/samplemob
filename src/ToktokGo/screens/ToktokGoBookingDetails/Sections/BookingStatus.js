import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, Image, Dimensions} from 'react-native';
import constants from '../../../../common/res/constants';
import {FONT} from '../../../../res/variables';
import _, {constant} from 'lodash';
import FAIcons from 'react-native-vector-icons/FontAwesome';
import Dots from './Dots';
// import OfflineImage from '../../../../assets/toktok/images/Offline.png';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const StatusBar = ({label, log, number}) => {
  const [imageDimension, setImageDimension] = useState(null);

  let ts = '';
  let hasImage;
  let fontColor = constants.COLOR.FADE;
  let fontFamily = constants.FONT_FAMILY.REGULAR;

  if (log) {
    ts =
      moment(log.createdAt).format('MMM D, YYYY hh:mm A') != 'Invalid date'
        ? moment(log.createdAt).format('MMM D, YYYY hh:mm A')
        : log.createdAt;
    fontColor = constants.COLOR.ORANGE;
    fontFamily = constants.FONT_FAMILY.BOLD;
    hasImage = log.image ? true : false;
  }

  useEffect(() => {
    if (hasImage) {
      getImage();
    }
  }, [hasImage]);

  const getImageDimensions = uri => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        uri,
        (width, height) => {
          resolve({width: width, height: height});
        },
        error => {
          reject(error);
        },
      );
    });
  };
  const getImage = async () => {
    const result = await getImageDimensions(log.image);
    const width = screenWidth - 40 - 40 - 34; // outer padding, inner padding, leftMargin

    const height = (width / result.width) * result.height;

    setImageDimension({
      width,
      height,
    });
  };

  return (
    <View style={{flex: 1}}>
      <View style={{position: 'absolute', top: 12, overflow: 'hidden', height: '99%', width: 20}}>
        {number != 4 && <Dots />}
      </View>
      <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
        <View style={{marginRight: 25, alignItems: 'center'}}>
          <FAIcons
            name={'circle'}
            size={constants.FONT_SIZE.XS}
            style={{marginTop: 6}}
            color={log ? constants.COLOR.ORANGE : constants.COLOR.MEDIUM}
          />
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontFamily: fontFamily, fontSize: constants.FONT_SIZE.M, color: fontColor, flex: 0.9}}>
            {label}
          </Text>
          <Text
            style={{
              fontFamily: constants.FONT_FAMILY.REGULAR,
              fontSize: constants.FONT_SIZE.M,
              color: constants.COLOR.GRAY,
              marginTop: 2,
            }}>
            {ts}
          </Text>
        </View>
      </View>
      {(number == 2 || number == 4) && hasImage && imageDimension && (
        <View style={{flex: 1, marginBottom: 10}}>
          <Image
            source={{uri: log.image}}
            style={{
              height: imageDimension.height,
              marginTop: 20,
              marginLeft: 34,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
};

const Status = ({booking}) => {
  const mappedLogs = _.mapKeys(booking.logs, 'status');
  return (
    /*-------------------- ON GOING --------------------*/
    <View>
      <View style={{borderBottomWidth: 2, borderColor: constants.COLOR.LIGHT, width: '100%', marginVertical: 15}} />
      <StatusBar number={1} label={'Arrived at destination'} log={mappedLogs['COMPLETED']} />
      <StatusBar number={3} label={'Passenger picked up'} log={mappedLogs['PICKED_UP']} />
      <StatusBar number={2} label={'Driver arrived at pick-up location'} log={mappedLogs['ARRIVED']} />
      <StatusBar number={4} label={'Driver accepted'} log={mappedLogs['ACCEPTED']} />
      {/* <View style={{borderBottomWidth: 2, borderColor: constants.COLOR.LIGHT, width: '100%', marginTop: 15}} /> */}
    </View>
  );
};

const Cancelled = () => {
  return (
    <View>
      <View style={{borderBottomWidth: 2, borderColor: constants.COLOR.LIGHT, width: '100%', marginVertical: 15}} />
      <View style={{flex: 1, flexDirection: 'row', marginBottom: 5, alignItems: 'center'}}>
        <View style={{marginRight: 25, alignItems: 'center'}}>
          <FAIcons
            name={'circle'}
            size={constants.FONT_SIZE.XS}
            style={{marginTop: 3}}
            color={constants.COLOR.ORANGE}
          />
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              fontFamily: constants.FONT_FAMILY.BOLD,
              fontSize: constants.FONT_SIZE.L,
              color: constants.COLOR.ORANGE,
            }}>
            Cancelled
          </Text>
        </View>
      </View>
      <View style={{borderBottomWidth: 2, borderColor: constants.COLOR.LIGHT, width: '100%', marginTop: 15}} />
    </View>
  );
};

export const BookingStatus = ({logs, delivery, booking, session, details}) => {
  return (
    <View style={styles.card}>
      <View style={styles.directionsBox}>
        <View style={styles.directionDetail}>
          {/*-------------------- ORDER DATE --------------------*/}
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Text style={{fontFamily: FONT.BOLD, fontSize: constants.FONT_SIZE.M}}>Booking Log</Text>
            </View>
          </View>
        </View>
        {['ONGOING', 'COMPLETED'].includes(booking.tag) && (
          <Status booking={booking} details={details} logs={logs} session={session} />
        )}
        {booking.tag == 'CANCELLED' && <Cancelled />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: constants.COLOR.WHITE,
    marginTop: 5,
    // alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  items: {
    fontFamily: FONT.REGULAR,
    color: constants.COLOR.DARK,
    fontSize: constants.FONT_SIZE.M,
    marginTop: 2,
  },
});
