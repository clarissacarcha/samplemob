/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  item: Object,
  index: number,
  showMore: boolean,
  onPressItem: number => any,
};
