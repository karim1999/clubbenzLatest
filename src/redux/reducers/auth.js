import {UPDATE_USER,UPDATE_SELECTED_CAR, UPDATE_LANGUAGE} from './../actions/types'

const initialAuthState = {
  isLoggedIn: false,
  user:{},
  selected_car:{year:{id:'',name:''},model:{name:'',image:''},car_type:{},car:{}},
  language: {}
};

const auth = (state = initialAuthState, action) => {
  if (action.type === 'Login') {
    return { ...state, isLoggedIn: true };
  }
  if (action.type === 'Logout') {
    return { ...state, isLoggedIn: false };
  }
  if (action.type === UPDATE_USER) {
    return { ...state, user: action.data };
  }
  if (action.type === UPDATE_SELECTED_CAR) {
    return { ...state, selected_car: action.data };
  }
  if (action.type === UPDATE_LANGUAGE) {
    return { ...state,  language: action.data }
  }
  return state;
};

export default auth;
