import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';

import {COLOR, DARK, MEDIUM, COLOR_UNDERLAY} from '../../res/constants';

// const INITIAL_VISIBILITY = {
//   day: false,
//   from: false,
//   to: false,
// };

const TODAY_TIME = moment().tz('Asia/Manila').format('HH:mm:ss').toString();

const SCHEDULES = [
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

const createdFilteredTimes = (scheduledDate) => {
  const filteredFromSchedules = FROM_SCHEDULES.filter((sched) => {
    if (scheduledDate !== moment().format('YYYY-MM-DD').toString()) {
      return true;
    }

    if (sched.label === 'Anytime') {
      return true;
    }
    if (parseInt(sched.value.replace(':', '')) >= parseInt(TODAY_TIME.replace(':', ''))) {
      return true;
    }
    return false;
  });

  const filteredToSchedules = TO_SCHEDULES.filter((sched) => {
    if (scheduledDate !== moment().format('YYYY-MM-DD').toString()) {
      return true;
    }

    if (sched.label === 'Anytime') {
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

const Component = ({initialData, onChangeFrom, onChangeTo, scheduledDate, visible}) => {
  // const [visibility, setVisibility] = useState(INITIAL_VISIBILITY); // Picker Visibility State

  const [data, setData] = useState(initialData);

  // const onOpenPicker = (state) => {
  //   // Hides all picker dropdowns and shows selected
  //   setVisibility({
  //     ...INITIAL_VISIBILITY,
  //     ...state,
  //   });
  // };

  if (!visible) {
    return null;
  }

  return (
    <>
      <Text style={styles.label}>Schedule </Text>
      <View style={[styles.container, {...(Platform.OS === 'ios' ? {zIndex: 999} : {})}]}>
        <View style={styles.scheduledDate}>
          <Text style={{color: MEDIUM}}>{moment(scheduledDate, 'YYYY-MM-DD').format('ddd, MMM D')}</Text>
        </View>
        <View style={styles.spacingContainer}>
          <Text style={styles.spacingText}>FROM</Text>
        </View>
        <DropDownPicker
          defaultValue={moment(data.scheduledFrom, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss').toString()}
          placeholder="Anytime"
          items={createdFilteredTimes(scheduledDate).filteredFromSchedules}
          containerStyle={styles.pickerContainer}
          style={styles.pickerStyle}
          dropDownStyle={styles.pickerDropDown}
          arrowColor={COLOR}
          labelStyle={styles.pickerLabel}
          itemStyle={styles.pickerItem}
          // activeItemStyle={styles.pickerActiveItem}
          dropDownMaxHeight={250}
          // isVisible={visibility.from}
          onOpen={() => {
            // onOpenPicker({from: true});
          }}
          onChangeItem={({value}) => {
            onChangeFrom(`${scheduledDate} ${value}`);
          }}
        />
        <View style={styles.spacingContainer}>
          <Text style={styles.spacingText}>TO</Text>
        </View>
        <DropDownPicker
          defaultValue={moment(data.scheduledTo, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss').toString()}
          placeholder="Anytime"
          items={createdFilteredTimes(scheduledDate).filteredToSchedules}
          containerStyle={styles.pickerContainer}
          style={styles.pickerStyle}
          dropDownStyle={styles.pickerDropDown}
          arrowColor={COLOR}
          labelStyle={styles.pickerLabel}
          itemStyle={styles.pickerItem}
          // activeItemStyle={styles.pickerActiveItem}
          dropDownMaxHeight={250}
          onOpen={() => {
            // onOpenPicker({to: true});
          }}
          onChangeItem={({value}) => {
            onChangeTo(`${scheduledDate} ${value}`);
          }}
        />
      </View>
    </>
  );
};

export const ScheduledTimeInput = Component;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  scheduledDate: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: MEDIUM,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: COLOR_UNDERLAY,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    height: 50,
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
  pickerLabel: {
    alignItems: 'flex-end',
  },
  pickerItem: {
    marginLeft: 0,
  },
  pickerActiveItem: {
    // alignItems: 'flex-start',
  },
  spacingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  spacingText: {
    fontSize: 12,
    fontFamily: 'Rubik-Regular',
  },
});
