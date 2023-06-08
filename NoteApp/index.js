/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import MainScreen from './src/views/MainScreen';
import CreateScreen from './src/views/CreateScreen';
import Controll from './src/views/Controll';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Controll);
