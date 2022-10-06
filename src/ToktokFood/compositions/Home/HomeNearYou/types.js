/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  page?: number,
  isReload?: boolean,
  setLoadMore: Function,
  setIsReload: Function,
  setPage: Function,
};
