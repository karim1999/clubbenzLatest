import {GET_SERVICES} from './../actions/types'

const initialState = { 
  services:{services:[]}
};

const home = (state = initialState, action) => {
  if (action.type == GET_SERVICES) {
    return { ...state, services: action.data };
  }
  return state;
};

export default home;
