import {
  NavigationActions,
} from 'react-navigation';

import AppNavigator from '../../AppNavigator';

const initialNavState = {
  index: 0,
  routes: [
    { key: 'Splash', routeName: 'Splash' },
    { key: 'Main', routeName: 'Main' },
    { key: 'Login', routeName: 'Login' },
  ],
};

const nav = (state = initialNavState, action) => {
  
  if (action.type === 'Login') {
    return AppNavigator.router.getStateForAction(NavigationActions.back(), state);
  }
  if (action.type === 'Logout') {
    return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
  }
  return AppNavigator.router.getStateForAction(action, state);
};

export default nav;