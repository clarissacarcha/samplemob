import React from 'react';
import {View} from 'react-native';

import {COLOR} from 'res/variables';

const RadioButton = (props) => {
  const {id, style, selected, onValueChange, readonly} = props;

  const componentClick = () => {
    if (!readonly) {
      onValueChange();
    }
  };
  return (
    <View
      key={id}
      onTouchEnd={() => componentClick()}
      style={[
        {
          width: 22,
          height: 22,
          borderWidth: 2,
          borderRadius: 5,
          marginRight: 5,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: selected ? COLOR.ORANGE : COLOR.DARK,
        },
        style,
      ]}>
      {selected ? (
        <View
          style={{
            height: 22,
            width: 22,
            borderRadius: 6,
            backgroundColor: COLOR.ORANGE,
          }}
        />
      ) : null}
    </View>
  );
};

export default RadioButton;
