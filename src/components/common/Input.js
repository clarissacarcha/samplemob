import React, {forwardRef} from 'react';
import {StyleSheet} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {COLOR, FONT_SIZE, FONT_FAMILY} from '../../res/constants';

export const Input = forwardRef((props, ref) => {

  return (
    <TextField
      returnKeyType="next"
      blurOnSubmit={false}
      fontSize={FONT_SIZE}
      labelFontSize={FONT_SIZE}
      tintColor={COLOR}
      titleTextStyle={props.titleTextStyle ? props.titleTextStyle : styles.titleTextStyle}
      ref={ref}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  titleTextStyle: {
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
    marginTop: -3,
  },
});

// const render = () => {
//   return (
//     <Input
//       label="Amount"
//       title="Enter amount to send"
//       keyboardType="numeric"
//       value={hookState.amount[0]}
//       onChangeText={value => hookState.amount[1](value)}
//       onSubmitEditing={() => onPress()}
//       renderLeftAccessory={() => (
//         <View style={styles.iconView}>
//           <MIcon name="edit" color={PaygoGreen} size={15} />
//         </View>
//       )}
//     />
//   );
// };
