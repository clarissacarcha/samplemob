/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  children: string | any,
  mode?: 'regular' | 'medium' | 'bold' | 'heavy' | 'black' | 'semibold',
  isItalic?: boolean,
  style?: Object,
  fontSize?: number,
  textProps?: Object,
  color?: string,
};
