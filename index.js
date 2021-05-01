/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import App from './src/app/App';
import {name as appName} from './app.json';
import {COLOR, FONT, FONT_SIZE} from './src/res/variables';

const customTextProps = {
  allowFontScaling: false,
  textBreakStrategy: 'simple',
  style: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    color: COLOR.DARK,
  },
};

setCustomText(customTextProps);
setCustomTextInput(customTextProps);

AppRegistry.registerComponent(appName, () => App);
