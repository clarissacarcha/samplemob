/**
 * @flow
 */

export type PropsType = {
  testID?: string,
  children: string,
  mode?: 'regular' | 'medium' | 'bold' | 'heavy' | 'black' | 'semibold',
  isItalic?: boolean,
  style?: Object,
  fontSize?: number,
  textProps?: Object,
};
