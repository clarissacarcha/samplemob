import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useLayoutEffect} from 'react';
import {Text, View} from 'react-native';
import _BackgroundTimer from 'react-native-background-timer';
import * as Progress from 'react-native-progress';
import {useDispatch, useSelector} from 'react-redux';
import CONSTANTS from '../../../../common/res/constants';

export const ProgressBar = ({booking, setDriverFoundModal}) => {
  const [progressNum, setProgressNum] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalSeconds, setIntervalSeconds] = useState(
    moment(booking?.request?.expiresAt).diff(moment(), 'seconds', false),
  );
  // const [intervalSeconds, setIntervalSeconds] = useState(45);

  useLayoutEffect(() => {
    console.log('check', true);
    const intervalTimer = _BackgroundTimer.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      _BackgroundTimer.clearInterval(intervalTimer);
    };
  }, []);

  useEffect(() => {
    let interval = parseFloat(timer) / parseFloat(intervalSeconds);
    setProgressNum(interval);

    if (interval >= 1 || intervalSeconds <= 0) {
      setDriverFoundModal(false);
      console.log('TIMER DONE!');
    }
  }, [timer]);

  return (
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginHorizontal: -25,
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
        height={8}
      />
    </View>
  );
};
