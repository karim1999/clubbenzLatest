import {API_ROOT} from './../../config/constant'
import RequestService from './../../services/RequestService';
import {store} from './../create'
import {
   GET_PREFERENCES,
   UPDATE_INDICATOR_FLAG
} from '../actions/types';

export const getPreferences= async () =>{
    let params = { url: API_ROOT+'preferences/get_preferences',body:{test:''} }
      let response = await new  RequestService(params).callCreate()
      store.dispatch({type:GET_PREFERENCES,data:response})
      return response
}

export const updateIndicator = (data) =>{
  store.dispatch({type:UPDATE_INDICATOR_FLAG,data:data})
}