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

// import React from 'react';
//
// import { StyleSheet, Text } from 'react-native';
//
// const styles = StyleSheet.create({
//   defaultFontFamily: {
//     fontFamily: 'lucida grande',
//   },
// });
//
// export default function fixOppoTextCutOff() {
//   const oldRender = Text.prototype.render;
//   Text.prototype.render = function render(...args) {
//     const origin = oldRender.call(this, ...args);
//     return React.cloneElement(origin, {
//       -      style: [origin.props.style, styles.defaultFontFamily],
//       +      style: [styles.defaultFontFamily, origin.props.style],
//   });
//   };
// }

AppRegistry.registerComponent(appName, () => App);
