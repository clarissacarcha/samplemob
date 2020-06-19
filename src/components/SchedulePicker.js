/**
 * Component used in sender and recipient details
 * Used to let the user select schedule on order type = scheduled
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import FIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {parseTime} from '../helper';
import moment from 'moment';

import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT, ORANGE} from '../res/constants';

const screenWidth = Dimensions.get('window').width;

const INITIAL_VISIBILITY = {
  day: false,
  from: false,
  to: false,
};

const timeToDate = value => {
  return moment(value, 'HH:mm:ss').toISOString();
  // .format('YYYY-MM-DD HH:mm:ss')
  // .toString();
};

const toDateFormat = (value, numOfDays) => {
  if (numOfDays > 0) {
    return moment(value)
      .add(numOfDays, 'days')
      .toISOString();
  }

  return moment(value).toISOString();
};

const schedules = [
  {label: '12:00 AM', value: timeToDate('00:00')},
  {label: '12:30 AM', value: timeToDate('00:30')},
  {label: '01:00 AM', value: timeToDate('01:00')},
  {label: '01:30 AM', value: timeToDate('01:30')},
  {label: '02:00 AM', value: timeToDate('02:00')},
  {label: '02:30 AM', value: timeToDate('02:30')},
  {label: '03:00 AM', value: timeToDate('03:00')},
  {label: '03:30 AM', value: timeToDate('03:30')},
  {label: '04:00 AM', value: timeToDate('04:00')},
  {label: '04:30 AM', value: timeToDate('04:30')},
  {label: '05:00 AM', value: timeToDate('05:00')},
  {label: '05:30 AM', value: timeToDate('05:30')},
  {label: '06:00 AM', value: timeToDate('06:00')},
  {label: '06:30 AM', value: timeToDate('06:30')},
  {label: '07:00 AM', value: timeToDate('07:00')},
  {label: '07:30 AM', value: timeToDate('07:30')},
  {label: '08:00 AM', value: timeToDate('08:00')},
  {label: '08:30 AM', value: timeToDate('08:30')},
  {label: '09:00 AM', value: timeToDate('09:00')},
  {label: '09:30 AM', value: timeToDate('09:30')},
  {label: '10:00 AM', value: timeToDate('10:00')},
  {label: '10:30 AM', value: timeToDate('10:30')},
  {label: '11:00 AM', value: timeToDate('11:00')},
  {label: '11:30 AM', value: timeToDate('11:30')},
  {label: '12:00 PM', value: timeToDate('12:00')},
  {label: '12:30 PM', value: timeToDate('12:30')},
  {label: '01:00 PM', value: timeToDate('13:00')},
  {label: '01:30 PM', value: timeToDate('13:30')},
  {label: '02:00 PM', value: timeToDate('14:00')},
  {label: '02:30 PM', value: timeToDate('14:30')},
  {label: '03:00 PM', value: timeToDate('15:00')},
  {label: '03:30 PM', value: timeToDate('15:30')},
  {label: '04:00 PM', value: timeToDate('16:00')},
  {label: '04:30 PM', value: timeToDate('16:30')},
  {label: '05:00 PM', value: timeToDate('17:00')},
  {label: '05:30 PM', value: timeToDate('17:30')},
  {label: '06:00 PM', value: timeToDate('18:00')},
  {label: '06:30 PM', value: timeToDate('18:30')},
  {label: '07:00 PM', value: timeToDate('19:00')},
  {label: '07:30 PM', value: timeToDate('19:30')},
  {label: '08:00 PM', value: timeToDate('20:00')},
  {label: '08:30 PM', value: timeToDate('20:30')},
  {label: '09:00 PM', value: timeToDate('21:00')},
  {label: '09:30 PM', value: timeToDate('21:30')},
  {label: '10:00 PM', value: timeToDate('22:00')},
  {label: '10:30 PM', value: timeToDate('22:30')},
  {label: '11:00 PM', value: timeToDate('23:00')},
  {label: '11:30 PM', value: timeToDate('23:30')},
];

const createDays = () => {
  const output = [];

  for (let i = 0; i <= 7; i++) {
    const day = moment().add(i, 'days');

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
      value: i.toString(),
    });
  }
  return output;
};

const PickerRow = ({initialData, setscheduledFrom, setscheduledTo, setScheduledDayIndex}) => {
  const TODAY_START = {label: 'Anytime', value: timeToDate('00:00')};
  const TODAY_END = {label: 'Anytime', value: timeToDate('23:59:59')};
  const TODAY_TIME = moment().toISOString();

  const FROM_SCHEDULES = [{label: 'Anytime', value: TODAY_START.value}, ...schedules];
  const TO_SCHEDULES = [{label: 'Anytime', value: TODAY_END.value}, ...schedules];

  const [visibility, setVisibility] = useState(INITIAL_VISIBILITY); // Picker Visibility State

  // Set FROM and TO for TODAY
  const createTodaySchedulesB = () => {
    const remainingFromSchedules = FROM_SCHEDULES.filter(sched => {
      if (sched.label == 'Anytime') {
        return true;
      }
      if (sched.value >= TODAY_TIME) {
        return true;
      }
      return false;
    });

    const remainingToSchedules = TO_SCHEDULES.filter(sched => {
      if (sched.label == 'Anytime') {
        return true;
      }
      if (sched.value >= TODAY_TIME) {
        return true;
      }
      return false;
    });

    return {
      from: remainingFromSchedules,
      to: remainingToSchedules,
    };
  };

  // Set FROM and TO for TOMORROW and BEYOND
  const createdDatedSchedulesB = numOfDays => {
    const datedFromSchedules = FROM_SCHEDULES.map(({label, value}) => {
      return {
        label,
        value: moment(value)
          .add(numOfDays, 'days')
          .toISOString(),
      };
    });

    const datedToSchedules = TO_SCHEDULES.map(({label, value}) => {
      return {
        label,
        value: moment(value)
          .add(numOfDays, 'days')
          .toISOString(),
      };
    });

    return {
      from: datedFromSchedules,
      to: datedToSchedules,
    };
  };
  const [fromSchedules, setFromSchedules] = useState(
    initialData.scheduledDayIndex == '0'
      ? createTodaySchedulesB().from
      : createdDatedSchedulesB(parseInt(initialData.scheduledDayIndex)).from,
  );
  const [toSchedules, setToSchedules] = useState(
    initialData.scheduledDayIndex == '0'
      ? createTodaySchedulesB().to
      : createdDatedSchedulesB(parseInt(initialData.scheduledDayIndex)).to,
  );

  // alert(moment(initialData.scheduledFrom).toISOString());
  const [selectedDay, setSelectedDay] = useState(initialData.scheduledDayIndex);

  const [selectedFrom, setSelectedFrom] = useState(initialData.scheduledFrom);
  const [selectedTo, setSelectedTo] = useState(initialData.scheduledTo);

  // const [selectedFrom, setSelectedFrom] = useState(null);
  // const [selectedTo, setSelectedTo] = useState(null);

  // Set FROM and TO for TODAY
  const createTodaySchedules = () => {
    const remainingFromSchedules = FROM_SCHEDULES.filter(sched => {
      if (sched.label == 'Anytime') {
        return true;
      }
      if (sched.value >= TODAY_TIME) {
        return true;
      }
      return false;
    });

    const remainingToSchedules = TO_SCHEDULES.filter(sched => {
      if (sched.label == 'Anytime') {
        return true;
      }
      if (sched.value >= TODAY_TIME) {
        return true;
      }
      return false;
    });
    setFromSchedules(remainingFromSchedules);
    setToSchedules(remainingToSchedules);

    setscheduledFrom(toDateFormat(TODAY_START.value));
    setscheduledTo(toDateFormat(TODAY_END.value));

    setSelectedFrom(TODAY_START.value);
    setSelectedTo(TODAY_END.value);
  };

  // Set FROM and TO for TOMORROW and BEYOND
  const createdDatedSchedules = numOfDays => {
    const datedFromSchedules = FROM_SCHEDULES.map(({label, value}) => {
      return {
        label,
        value: moment(value)
          .add(numOfDays, 'days')
          .toISOString(),
      };
    });

    const datedToSchedules = TO_SCHEDULES.map(({label, value}) => {
      return {
        label,
        value: moment(value)
          .add(numOfDays, 'days')
          .toISOString(),
      };
    });

    setFromSchedules(datedFromSchedules);
    setToSchedules(datedToSchedules);

    const THIS_DAY_START = moment('00:00', 'HH:mm:ss')
      .add(numOfDays, 'days')
      .toISOString();
    const THIS_DAY_END = moment('23:59:59', 'HH:mm:ss')
      .add(numOfDays, 'days')
      .toISOString();

    setSelectedFrom(THIS_DAY_START);
    setSelectedTo(THIS_DAY_END);

    setscheduledFrom(toDateFormat(THIS_DAY_START));
    setscheduledTo(toDateFormat(THIS_DAY_END));
  };

  const onOpenPicker = state => {
    // Hides all picker dropdowns and shows selected
    setVisibility({
      ...INITIAL_VISIBILITY,
      ...state,
    });
  };

  const onDaySelect = ({label, value}, index) => {
    // Hides all picker dropdowns
    setVisibility(INITIAL_VISIBILITY);

    setSelectedDay(value);
    setScheduledDayIndex(value);

    // If Today, use Today. Else, use Dated
    if (label === 'Today') {
      createTodaySchedules();
    } else {
      createdDatedSchedules(index);
    }
  };

  useEffect(() => {
    // createTodaySchedules();
    // setSelectedFrom(initialData.scheduledFrom);
    // setSelectedTo(initialData.scheduledTo);
  }, []);

  return (
    <>
      <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
        <DropDownPicker
          defaultValue={selectedDay}
          items={createDays()}
          containerStyle={styles.pickerContainerStyle}
          style={styles.pickerStyle}
          dropDownStyle={styles.pickerDropDown}
          arrowColor={COLOR}
          labelStyle={{alignItems: 'flex-end'}}
          itemStyle={{marginLeft: 8}} //
          activeItemStyle={{alignItems: 'flex-start'}}
          zIndex={1000}
          dropDownMaxHeight={250}
          isVisible={visibility.day}
          onOpen={() => {
            onOpenPicker({day: true});
          }}
          onChangeItem={onDaySelect}
        />
        <View style={{width: 40, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'right'}}>FROM</Text>
        </View>
        <DropDownPicker
          defaultValue={selectedFrom}
          placeholder="Anytime"
          items={fromSchedules}
          containerStyle={styles.pickerContainerStyle}
          style={styles.pickerStyle}
          dropDownStyle={styles.pickerDropDown}
          arrowColor={COLOR}
          labelStyle={{alignItems: 'flex-end'}}
          itemStyle={{marginLeft: 8}} //
          activeItemStyle={{alignItems: 'flex-start'}}
          zIndex={1000}
          dropDownMaxHeight={250}
          isVisible={visibility.from}
          onOpen={() => {
            onOpenPicker({from: true});
          }}
          onChangeItem={({value}) => {
            setVisibility(INITIAL_VISIBILITY);
            setSelectedFrom(value);
            setscheduledFrom(toDateFormat(value));
          }}
        />
        <View style={{width: 30, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'right'}}>TO</Text>
        </View>
        <DropDownPicker
          defaultValue={selectedTo}
          placeholder="Anytime"
          items={toSchedules}
          containerStyle={styles.pickerContainerStyle}
          style={styles.pickerStyle}
          dropDownStyle={styles.pickerDropDown}
          arrowColor={COLOR}
          labelStyle={{alignItems: 'flex-end'}}
          itemStyle={{marginLeft: 8}} //
          activeItemStyle={{alignItems: 'flex-start', color: COLOR}}
          zIndex={1000}
          dropDownMaxHeight={250}
          isVisible={visibility.to}
          onOpen={() => {
            onOpenPicker({to: true});
          }}
          onChangeItem={({value}) => {
            setVisibility(INITIAL_VISIBILITY);
            setSelectedTo(value);
            setscheduledTo(toDateFormat(value));
          }}
        />
      </View>
    </>
  );
};

export const SchedulePicker = ({initialData, onScheduleChange}) => {
  const finePrint = ['', 'We will assign a suitable rider for you.', 'We will arrive within your scheduled time.'];

  const [orderType, setOrderType] = useState(initialData.orderType);

  const [scheduledDayIndex, setScheduledDayIndex] = useState(initialData.scheduledDayIndex);

  const [scheduledFrom, setscheduledFrom] = useState(initialData.scheduledFrom);
  const [scheduledTo, setscheduledTo] = useState(initialData.scheduledTo);

  useEffect(() => {
    if (orderType == 1) {
      onScheduleChange({
        orderType,
        scheduledFrom: null,
        scheduledTo: null,
        scheduledDayIndex,
      });
    }

    if (orderType == 2) {
      onScheduleChange({
        orderType,
        scheduledFrom: scheduledFrom,
        scheduledTo: scheduledTo,
        scheduledDayIndex,
      });
    }
  }, [orderType, scheduledFrom, scheduledTo]);

  return (
    <View>
      {/*-------------------- URGENCY PICKER --------------------*/}
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
              paddingLeft: 20,
              paddingRight: 10,
              borderWidth: orderType === 1 ? 2 : 1,
              borderColor: orderType === 1 ? COLOR : LIGHT,
            }}>
            <Text style={{fontSize: 12}}>As Soon As Possible</Text>
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
              paddingLeft: 20,
              paddingRight: 10,
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
        <Text style={{color: DARK, fontSize: 9, fontWeight: 'bold'}}>{finePrint[orderType]}</Text>
      </View>

      {/*-------------------- TIME PICKER --------------------*/}
      {orderType === 2 && (
        <PickerRow
          setscheduledFrom={setscheduledFrom}
          setscheduledTo={setscheduledTo}
          setScheduledDayIndex={setScheduledDayIndex}
          initialData={{scheduledFrom, scheduledTo, scheduledDayIndex}}
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
    zIndex: 9,
  },

  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontWeight: 'bold',
  },
});
