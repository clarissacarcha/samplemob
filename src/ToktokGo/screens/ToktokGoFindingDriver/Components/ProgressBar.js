import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useLayoutEffect} from 'react';
import {View} from 'react-native';
import _BackgroundTimer from 'react-native-background-timer';
import * as Progress from 'react-native-progress';
import {useDispatch, useSelector} from 'react-redux';
import CONSTANTS from '../../../../common/res/constants';

export const ProgressBar = ({}) => {
  const {bookingTimer} = useSelector(state => state.toktokGo);
  const [progressNum, setProgressNum] = useState(45);
  const [timer, setTimer] = useState(45);
  const [intervalSeconds, setIntervalSeconds] = useState(moment().diff(moment(), 'seconds', false));

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const intervalTimer = _BackgroundTimer.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      _BackgroundTimer.clearInterval(intervalTimer);
    };
  }, []);

  useEffect(() => {
    let interval = parseFloat(timer) / parseFloat(intervalSeconds);
    // dispatch({
    //   type: 'SET_BOOKING_TIMER',
    //   payload: {
    //     timer: timer,
    //     progress: interval,
    //   },
    // });
    setProgressNum(interval);

    if (interval >= 1 || intervalSeconds <= 0) {
      console.log('TIMER DONE!');
      //   dispatch({type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE'});
      //   dispatch({
      //     type: 'SET_BOOKING_TIMER',
      //     payload: {
      //       expireSecond: 0,
      //       timer: 1,
      //       progress: 0,
      //     },
      //   });
    }
  }, [timer]);

  return (
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginHorizontal: -16,
        bottom: 16,
      }}>
      <Progress.Bar
        progress={progressNum}
        unfilledColor={'#FFF1D2'}
        color={CONSTANTS.COLOR.ORANGE}
        borderRadius={0}
        borderWidth={0}
        width={null}
        animationType={'timing'}
      />
    </View>
  );
};
