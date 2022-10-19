/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  accessibilityLabel?: string,
  theme?: Object,
  scrollY: any,
  shopId: string,
  // onGetRef: (any, Object) => void,
  // onMomentumScrollBegin: () => void,
  // onMomentumScrollEnd: () => void,
  // onScrollEndDrag: () => void,
  listOffset: Object,
  listRefArr: {
    current: Array<any>,
  },
  isListGliding: any,
  // index: number,
  // routes: any,
  // setIndex: any => any | null,
};
