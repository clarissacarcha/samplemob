import React from 'react';
import {View} from 'react-native';

import {COLOR} from 'res/variables';

const RadioButton = (props) => {
  const {id, style, selected, onValueChange, readonly} = props;

  const componentClick = () => {
    if (!readonly) {
      onValueChange(selected);
    }
  };
  return (
    <View
      key={id}
      onTouchEnd={() => componentClick()}
      style={[
        {
          width: 24,
          height: 24,
          borderWidth: 2,
          borderRadius: 7,
          marginRight: 3,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: selected ? COLOR.ORANGE : COLOR.DARK,
        },
        style,
      ]}>
      {selected ? (
        <View
          style={{
            height: 24,
            width: 24,
            borderRadius: 7,
            backgroundColor: COLOR.ORANGE,
          }}
        />
      ) : null}
    </View>
  );
};

export default RadioButton;
