/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './src/app/App';
import {name as appName} from './app.json';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

TextInput.defaultProps.fontFamily = 'HelveticaNeue-Light';

AppRegistry.registerComponent(appName, () => App);
