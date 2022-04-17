/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import App from './src/app/App';
import {name as appName} from './app.json';
import {COLOR, FONT, FONT_SIZE} from './src/res/variables';
import 'react-native-get-random-values';

const customTextProps = {
  allowFontScaling: false,
  textBreakStrategy: 'simple',
  style: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: COLOR.BLACK,
  },
};

setCustomText(customTextProps);
setCustomTextInput(customTextProps);

LogBox.ignoreLogs(['new NativeEventEmitter']);

AppRegistry.registerComponent(appName, () => App);
