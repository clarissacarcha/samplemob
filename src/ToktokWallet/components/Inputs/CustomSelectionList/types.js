/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  style?: Object,
  placeholder: string,
  errorMessage: string,
  onSelectedValue: Object => any,
  selectedValue: string,
  setSelectedValue: any,
  data: Array<Object>,
  withSearch?: boolean,
  searchPlaceholder?: string,
  onSearchValue?: any,
  hasDefault?: boolean,
  defaultCondition?: string,
  label?: string,
  //use this props for additional validation
  hasValidation?: boolean,
  onChangeValidation?: () => void,
  showList?: boolean,
  setShowList?: any,
  multiple?: boolean,
  removeValue?: string,
};
