/**
 * @flow
 */

export type PropsType = {
  value: string, // required
  onChangeText: () => void, // required
  errorMessage: string, // required
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  style?: Object,
  placeholder?: string,
  placeholderTextColor?: string,
  returnKeyType?: 'done' | 'search',
  onSubmitEditing?: () => void,
  maxLength?: number,
  editable?: Boolean,
  label?: string,
  onBlur?: any,
};
