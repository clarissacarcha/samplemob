/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import App from './src/app/App';
import {name as appName} from './app.json';

const customTextProps = {
  allowFontScaling: false,
  textBreakStrategy: 'simple',
  style: {
    fontFamily: 'Rubik-Regular',
  },
};

setCustomText(customTextProps);
setCustomTextInput(customTextProps);

AppRegistry.registerComponent(appName, () => App);
