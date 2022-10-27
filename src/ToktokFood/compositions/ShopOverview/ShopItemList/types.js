/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  onGetRef: (any, Object) => void,
  onMomentumScrollBegin: () => void,
  onMomentumScrollEnd: () => void,
  onScrollEndDrag: () => void,
  route: {
    key: string,
    id?: string,
    index?: number,
    title: string,
  },
  activeRoute: {
    key: string,
    index?: number,
    title: string,
  },
  shopId: string,
  scrollY: any,
};
