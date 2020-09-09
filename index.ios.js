/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import bgmessaging from './src/bgmessaging'

AppRegistry.registerComponent('clubbenz', () => App);
// AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgmessaging);
