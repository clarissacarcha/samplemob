/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import App from './src/app/App';
import {name as appName} from './app.json';

const customTextProps = {
  style: {
    allowFontScaling: false,
    fontFamily: 'Rubik-Regular',
    textBreakStrategy: 'simple',
  },
};

setCustomText(customTextProps);
setCustomTextInput(customTextProps);


AppRegistry.registerComponent(appName, () => App);
