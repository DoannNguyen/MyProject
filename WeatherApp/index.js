/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import MainScreen from './src/Views/MainScreen';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => MainScreen);
