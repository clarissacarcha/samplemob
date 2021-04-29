import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import {useAlert} from '../../../../../hooks';
import {COLOR, LIGHT, ORANGE, FONT_REGULAR} from '../../../../../res/constants';

import {WhiteButton, BlackButton} from '../../../../../revamp';

const SCHEDULES = [
  {label: 'Anytime', value: '23:59:59'},
  {label: '12:00 AM', value: '00:00:00'},
  {label: '12:30 AM', value: '00:30:00'},
  {label: '01:00 AM', value: '01:00:00'},
  {label: '01:30 AM', value: '01:30:00'},
  {label: '02:00 AM', value: '02:00:00'},
  {label: '02:30 AM', value: '02:30:00'},
  {label: '03:00 AM', value: '03:00:00'},
  {label: '03:30 AM', value: '03:30:00'},
  {label: '04:00 AM', value: '04:00:00'},
  {label: '04:30 AM', value: '04:30:00'},
  {label: '05:00 AM', value: '05:00:00'},
  {label: '05:30 AM', value: '05:30:00'},
  {label: '06:00 AM', value: '06:00:00'},
  {label: '06:30 AM', value: '06:30:00'},
  {label: '07:00 AM', value: '07:00:00'},
  {label: '07:30 AM', value: '07:30:00'},
  {label: '08:00 AM', value: '08:00:00'},
  {label: '08:30 AM', value: '08:30:00'},
  {label: '09:00 AM', value: '09:00:00'},
  {label: '09:30 AM', value: '09:30:00'},
  {label: '10:00 AM', value: '10:00:00'},
  {label: '10:30 AM', value: '10:30:00'},
  {label: '11:00 AM', value: '11:00:00'},
  {label: '11:30 AM', value: '11:30:00'},
  {label: '12:00 PM', value: '12:00:00'},
  {label: '12:30 PM', value: '12:30:00'},
  {label: '01:00 PM', value: '13:00:00'},
  {label: '01:30 PM', value: '13:30:00'},
  {label: '02:00 PM', value: '14:00:00'},
  {label: '02:30 PM', value: '14:30:00'},
  {label: '03:00 PM', value: '15:00:00'},
  {label: '03:30 PM', value: '15:30:00'},
  {label: '04:00 PM', value: '16:00:00'},
  {label: '04:30 PM', value: '16:30:00'},
  {label: '05:00 PM', value: '17:00:00'},
  {label: '05:30 PM', value: '17:30:00'},
  {label: '06:00 PM', value: '18:00:00'},
  {label: '06:30 PM', value: '18:30:00'},
  {label: '07:00 PM', value: '19:00:00'},
  {label: '07:30 PM', value: '19:30:00'},
  {label: '08:00 PM', value: '20:00:00'},
  {label: '08:30 PM', value: '20:30:00'},
  {label: '09:00 PM', value: '21:00:00'},
  {label: '09:30 PM', value: '21:30:00'},
  {label: '10:00 PM', value: '22:00:00'},
  {label: '10:30 PM', value: '22:30:00'},
  {label: '11:00 PM', value: '23:00:00'},
  {label: '11:30 PM', value: '23:30:00'},
];

const SCHEDULE_TIME = SCHEDULES.map((item) => {
  return item.label;
});

const createDays = () => {
  const output = [];

  for (let i = 0; i <= 7; i++) {
    const day = moment().add(i, 'days');
    const value = day.tz('Asia/Manila').format('YYYY-MM-DD');

    let label = '';
    if (i === 0) {
      label = 'Today';
    } else if (i === 1) {
      label = 'Tomorrow';
    } else {
      label = day.format('ddd MMM D');
    }

    output.push({
      label,
      value,
    });
  }
  return output;
};

const SCHEDULESB = createDays();

const SCHEDULE_DAYS = createDays().map((item) => {
  return item.label;
});

const DeliveryScheduleFormButton = () => {
  const [orderType, setOrderType] = useState('ASAP');
  const [scheduledAt, setScheduledAt] = useState(null);
  const [formattedScheduledAt, setFormattedScheduledAt] = useState('ASAP');
  const [scheduledDate, setScheduledDate] = useState('Today');
  const [scheduledTime, setScheduledTime] = useState('Anytime');

  const bottomSheetRef = useRef();

  const snapPoints = useMemo(() => [0, 130, 345], []);

  return (
    <View style={styles.screenBox}>
      <WhiteButton
        label={`Pick Up ${formattedScheduledAt}`}
        prefixSet="Material"
        prefixName="access-time"
        suffixSet="Material"
        suffixName="arrow-forward"
        onPress={() => {
          bottomSheetRef.current.snapTo(1);
        }}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        handleComponent={() => (
          <View
            style={{
              height: 20,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              borderTopWidth: 3,
              borderRightWidth: 2,
              borderLeftWidth: 2,
              borderColor: ORANGE,
              marginHorizontal: -2,
            }}
          />
        )}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        backdropComponent={BottomSheetBackdrop}>
        <BottomSheetView style={styles.contentContainer}>
          <Text>Pick Up Time</Text>
          <View style={{height: 10}} />
          <WhiteButton
            label="ASAP"
            prefixSet="Material"
            prefixName="timer"
            borderless
            onPress={() => {
              setOrderType('ASAP');
              setFormattedScheduledAt('ASAP');
              bottomSheetRef.current.snapTo(0);
            }}
          />
          <WhiteButton
            label="Scheduled"
            prefixSet="MaterialCommunity"
            prefixName="calendar-month"
            borderless
            onPress={() => {
              bottomSheetRef.current.snapTo(2);
            }}
          />
          <View style={{height: 150, flexDirection: 'row'}}>
            <ScrollPicker
              dataSource={SCHEDULE_DAYS}
              selectedIndex={0}
              renderItem={(data, index) => {
                //
              }}
              onValueChange={(data, selectedIndex) => {
                setScheduledDate(data);
              }}
              wrapperHeight={150}
              wrapperWidth={150}
              wrapperBackground={'#FFFFFF'}
              itemHeight={50}
              highlightColor={LIGHT}
              highlightBorderWidth={1}
              onPress={() => {}}
            />
            <ScrollPicker
              dataSource={SCHEDULE_TIME}
              selectedIndex={0}
              renderItem={(data, index) => {
                return <Text style={{fontSize: 10}}>{data.label}</Text>;
              }}
              onValueChange={(data, selectedIndex) => {
                console.log(data);
                setScheduledTime(data);
              }}
              wrapperHeight={150}
              wrapperWidth={150}
              wrapperBackground={'#FFFFFF'}
              itemHeight={50}
              highlightColor={LIGHT}
              highlightBorderWidth={1}
              onPress={(x, y) => {
                console.log({x});
                console.log({y});
              }}
            />
          </View>
          <View style={{height: 10}} />

          <BlackButton
            label="Confirm"
            onPress={() => {
              const formattedDate = SCHEDULESB.find((date) => {
                return date.label === scheduledDate;
              });

              const formattedTime = SCHEDULES.find((date) => {
                return date.label === scheduledTime;
              });
              setFormattedScheduledAt(`${formattedDate.label} - ${formattedTime.label}`);
              setScheduledAt(`${formattedDate.value} ${formattedTime.value}`);
              bottomSheetRef.current.collapse();
            }}
          />
          <View style={{height: 10}} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(DeliveryScheduleFormButton);

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
});
