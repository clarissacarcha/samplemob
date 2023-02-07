/**
 * @flow
 */

export type PropsType = {
  value: string, // required
  onChangeText: any, // required
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
  onBlur?: Boolean,
  onFocus?: Boolean,
  caretHidden?: Boolean,
  editable?: Boolean,
  label?: string,
  onPressFavorite?: any,
  isFavorite?: Boolean,
  name?: string,
  hasContacts?: Boolean,
  hasFavorite?: Boolean,
  disableFavorite?: Boolean,
};
