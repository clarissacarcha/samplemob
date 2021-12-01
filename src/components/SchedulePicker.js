/**
 * Component used in sender and recipient details
 * Used to let the user select schedule on order type = scheduled
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, Platform} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import FIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment-timezone';

import {COLOR, DARK, MEDIUM, LIGHT} from '../res/constants';

const screenWidth = Dimensions.get('window').width;

const INITIAL_VISIBILITY = {
  day: false,
  from: false,
  to: false,
};

const TODAY_TIME = moment().tz('Asia/Manila').format('HH:mm:ss').toString();

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

const FROM_SCHEDULES = [{label: 'Anytime', value: '00:00:00'}, ...SCHEDULES];
const TO_SCHEDULES = [{label: 'Anytime', value: '23:59:59'}, ...SCHEDULES];

const createDays = () => {
  const output = [];

  for (let i = 0; i <= 7; i++) {
    const day = moment().add(i, 'days');
    const value = day.tz('Asia/Manila').format('YYYY-MM-DD');

    let label = '';
    if (i === 0) {
      label = 'Today   ';
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

const createdFilteredTimes = () => {
  const filteredFromSchedules = FROM_SCHEDULES.filter(sched => {
    if (sched.label == 'Anytime') {
      return true;
    }
    if (parseInt(sched.value.replace(':', '')) >= parseInt(TODAY_TIME.replace(':', ''))) {
      return true;
    }
    return false;
  });

  const filteredToSchedules = TO_SCHEDULES.filter(sched => {
    if (sched.label == 'Anytime') {
      return true;
    }
    if (parseInt(sched.value.replace(':', '')) >= parseInt(TODAY_TIME.replace(':', ''))) {
      return true;
    }
    return false;
  });

  return {
    filteredFromSchedules,
    filteredToSchedules,
  };
};

const PickerRow = ({initialData, setscheduledFrom, setscheduledTo, setScheduledDay}) => {
  const [visibility, setVisibility] = useState(INITIAL_VISIBILITY); // Picker Visibility State

  const daySchedules = createDays();
  const [fromSchedules, setFromSchedules] = useState(FROM_SCHEDULES);
  const [toSchedules, settoSchedules] = useState(TO_SCHEDULES);

  const onOpenPicker = state => {
    // Hides all picker dropdowns and shows selected
    setVisibility({
      ...INITIAL_VISIBILITY,
      ...state,
    });
  };

  useEffect(() => {
    if (initialData.scheduledDay == moment().tz('Asia/Manila').format('YYYY-MM-DD').toString()) {
      const {filteredFromSchedules, filteredToSchedules} = createdFilteredTimes();
      setFromSchedules(filteredFromSchedules);
      settoSchedules(filteredToSchedules);

      //Reset Selected Times
      setscheduledFrom('00:00:00');
      setscheduledTo('23:59:59');
    } else {
      setFromSchedules(FROM_SCHEDULES);
      settoSchedules(TO_SCHEDULES);
    }
  }, [initialData.scheduledDay]);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          marginTop: 10,
        }}>
        <DropDownPicker
          defaultValue={initialData.scheduledDay}
          items={daySchedules}
          containerStyle={styles.pickerContainerStyle}
          style={styles.pickerStyle}
          dropDownStyle={styles.pickerDropDown}
          arrowColor={COLOR}
          labelStyle={{alignItems: 'flex-end'}}
          itemStyle={{marginLeft: 0}}
          activeItemStyle={{alignItems: 'flex-start'}}
          // zIndex={1000}
          dropDownMaxHeight={250}
          isVisible={visibility.day}
          onOpen={() => {
            onOpenPicker({day: true});
          }}
          onChangeItem={({value}) => {
            setVisibility(INITIAL_VISIBILITY);
            setScheduledDay(value);
          }}
        />
        <View style={{width: 40, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 10, fontFamily: 'Rubik-Medium', textAlign: 'right'}}>FROM</Text>
        </View>
        <DropDownPicker
          defaultValue={initialData.scheduledFrom}
          placeholder="Anytime"
          items={fromSchedules}
          containerStyle={styles.pickerContainerStyle}
          style={styles.pickerStyle}
          dropDownStyle={styles.pickerDropDown}
          arrowColor={COLOR}
          labelStyle={{alignItems: 'flex-end'}}
          itemStyle={{marginLeft: 0}} //
          activeItemStyle={{alignItems: 'flex-start'}}
          // zIndex={5}
          dropDownMaxHeight={250}
          isVisible={visibility.from}
          onOpen={() => {
            onOpenPicker({from: true});
          }}
          onChangeItem={({value}) => {
            setVisibility(INITIAL_VISIBILITY);
            setscheduledFrom(value);
          }}
        />
        <View style={{width: 30, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 10, fontFamily: 'Rubik-Medium', textAlign: 'right'}}>TO</Text>
        </View>
        <DropDownPicker
          defaultValue={initialData.scheduledTo}
          placeholder="Anytime"
          items={toSchedules}
          containerStyle={styles.pickerContainerStyle}
          style={styles.pickerStyle}
          dropDownStyle={styles.pickerDropDown}
          arrowColor={COLOR}
          labelStyle={{alignItems: 'flex-end'}}
          itemStyle={{marginLeft: 0}} //
          activeItemStyle={{alignItems: 'flex-start', color: COLOR}}
          // zIndex={1000}
          dropDownMaxHeight={250}
          isVisible={visibility.to}
          onOpen={() => {
            onOpenPicker({to: true});
          }}
          onChangeItem={({value}) => {
            setVisibility(INITIAL_VISIBILITY);
            setscheduledTo(value);
          }}
        />
      </View>
      {/* <Text>{JSON.stringify({daySchedule: createDays()}, null, 4)}</Text> */}
      {/* <Text>{JSON.stringify({fromSchedules}, null, 4)}</Text>
      <Text>{JSON.stringify({toSchedules}, null, 4)}</Text> */}
    </>
  );
};

export const SchedulePicker = ({initialData, onScheduleChange}) => {
  const finePrint = ['', 'We will get you a rider ka-toktok.', 'We will arrive within your scheduled time.'];

  const [orderType, setOrderType] = useState(initialData.orderType);

  const [scheduledDay, setScheduledDay] = useState(
    orderType == 2
      ? moment(initialData.scheduledFrom, 'YYYY-MM-DD').format('YYYY-MM-DD').toString()
      : moment().tz('Asia/Manila').format('YYYY-MM-DD').toString(),
  );

  const [scheduledFrom, setscheduledFrom] = useState(
    orderType == 2
      ? moment(initialData.scheduledFrom, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss').toString()
      : '00:00:00',
  );
  const [scheduledTo, setscheduledTo] = useState(
    orderType == 2 ? moment(initialData.scheduledTo, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss').toString() : '23:59:59',
  );

  useEffect(() => {
    if (orderType == 1) {
      setScheduledDay(moment().tz('Asia/Manila').format('YYYY-MM-DD').toString());
      onScheduleChange({
        orderType,
        scheduledFrom: null,
        scheduledTo: null,
      });
    }

    if (orderType == 2) {
      onScheduleChange({
        orderType,
        scheduledFrom: `${scheduledDay} ${scheduledFrom}`,
        scheduledTo: `${scheduledDay} ${scheduledTo}`,
      });
    }
  }, [orderType, scheduledFrom, scheduledTo, scheduledDay]);

  return (
    <View
      style={{
        ...(Platform.OS !== 'android' && {
          zIndex: 10,
        }),
      }}>
      {/*-------------------- ORDER TYPE PICKER --------------------*/}
      <View style={{flexDirection: 'row', marginHorizontal: 20}}>
        <TouchableWithoutFeedback onPress={() => setOrderType(1)}>
          <View
            style={{
              width: (screenWidth - 60) / 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 50,
              borderRadius: 10,
              paddingHorizontal: 20,
              borderWidth: orderType === 1 ? 2 : 1,
              borderColor: orderType === 1 ? COLOR : LIGHT,
            }}>
            <Text style={{fontSize: 12}} numberOfLines={2}>
              {'As Soon\nAs Possible'}
            </Text>
            <MCIcon name="run-fast" size={24} color={orderType === 1 ? COLOR : LIGHT} />
          </View>
        </TouchableWithoutFeedback>

        <View style={{width: 20}} />

        <TouchableWithoutFeedback onPress={() => setOrderType(2)}>
          <View
            style={{
              width: (screenWidth - 60) / 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 50,
              borderRadius: 10,
              paddingHorizontal: 20,
              borderWidth: orderType === 2 ? 2 : 1,
              borderColor: orderType === 2 ? COLOR : LIGHT,
            }}>
            <Text style={{fontSize: 12}}>Scheduled</Text>
            <FIcon name="clock" size={24} color={orderType === 2 ? COLOR : LIGHT} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/*-------------------- FINE PRINT --------------------*/}
      <View style={{marginHorizontal: 20, marginTop: 10}}>
        <Text style={{color: DARK, fontSize: 10, fontFamily: 'Rubik-Medium'}}>{finePrint[orderType]}</Text>
      </View>

      {/*-------------------- TIME PICKER --------------------*/}
      {orderType === 2 && (
        <PickerRow
          setscheduledFrom={setscheduledFrom}
          setscheduledTo={setscheduledTo}
          setScheduledDay={setScheduledDay}
          initialData={{scheduledFrom, scheduledTo, scheduledDay}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainerStyle: {
    height: 30,
    flex: 1,
  },
  pickerStyle: {
    backgroundColor: 'white',
    borderColor: MEDIUM,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  pickerDropDown: {
    backgroundColor: 'white',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: MEDIUM,
  },

  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
});
