/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  visible: boolean,
  setVisible: any,
  data: Array<Object>,
  onChangeSelect: Function,
  withSearch?: boolean,
  onSearchValue: string => void,
  hasDefault?: boolean,
  defaultCondition?: string,
  searchPlaceholder: string,
  multiple?: boolean,
  removeValue?: string,
};
