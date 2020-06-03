import { combineReducers } from 'redux';

import language from './language';
import auth from './auth';
import init from './init'
import home from './home'

export default combineReducers({
  language,
  auth,
  init,
  home
});
