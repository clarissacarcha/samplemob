import React, {forwardRef} from 'react';
import {Dropdown as DP} from 'react-native-material-dropdown';
import {COLOR} from '../../res/constants';

export const Dropdown = forwardRef((props, ref) => {
  const {label, value, data, style} = props;
  return (
    <DP
      label={label ? label : 'Label goes here'}
      value={value ? value : 'Value goes here'}
      data={
        data
          ? data
          : [
              {
                value: 'Yamaha YZF-R1',
                key: '1',
              },
              {
                value: 'Honda CBR1000RR',
                key: '2',
              },
              {
                value: 'BMW GS1250S',
                key: '3',
              },
            ]
      }
      containerStyle={[{width: '100%'}, style ? style : {}]}
      fontSize={10}
      labelFontSize={10}
      itemCount={10}
      baseColor={COLOR}
      ref={ref}
      {...props}
    />
  );
});

// onChangeText={(value, i, data) => {
//     filterCities(data[i].key)
//     setCity('');
//     setProvince(value)
// }}

