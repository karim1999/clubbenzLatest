import {GET_PREFERENCES,GET_SERVICES,UPDATE_INDICATOR_FLAG} from './../actions/types'

const initialState = { 
  preferences:{years:[],fuel_types:[],models:[]},
  is_loading_indicator : false
};

const init = (state = initialState, action) => {
  if (action.type == GET_PREFERENCES) {
    return { ...state, preferences: action.data };
  }
  if (action.type == UPDATE_INDICATOR_FLAG) {
    return { ...state, is_loading_indicator: action.data };
  }
  return state;
};

export default init;
