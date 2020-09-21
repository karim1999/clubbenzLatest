import {API_ROOT} from './../../config/constant';
import RequestService from './../../services/RequestService';
import {store} from './../create';
import {
  UPDATE_USER,
  UPDATE_SELECTED_CAR,
  UPDATE_LANGUAGE,
} from '../actions/types';

export const registerUser = async data => {
console.log(data);
  let params = {
    url: API_ROOT + 'user/register_user',
    body: data,
  };
  // debugger
  // alert(JSON.stringify(params))

  let response = await new RequestService(params).callCreate();
  if (response.success) {
    // debugger
    store.dispatch({
      type: UPDATE_SELECTED_CAR,
      data: {
        year: response.year[0] || {id: '', name: ''},
        model: response.model[0] || {name: '', image: ''},
        car_type: response.car_type[0],
        car: response.car[0],
      },
    });
  } else {
  }

  return response;
};

export const verifiyNumber = async data => {
  let params = {
    url: API_ROOT + 'user/resend_code',
    body: data,
  };

  // alert(JSON.stringify(params))

  let response = await new RequestService(params).callCreate();
  return response;
};

export const sendCodeEmail = async data => {
  let params = {
    url: API_ROOT + 'user/resend_code_email',
    body: data,
  };

  // alert(JSON.stringify(params))

  let response = await new RequestService(params).callCreate();
  return response;
};

export const getCarByVin = async data => {
  let params = {
    url: API_ROOT + 'preferences/get_car_by_vin_prefix',
    body: data,
  };
  // debugger
  let response = await new RequestService(params).callCreate();
  return response;
};

export const sendSolution = async data => {
  let params = {
    url: API_ROOT + 'carguide/submit_solution',
    body: data,
  };

  // alert(JSON.stringify(params))

  let response = await new RequestService(params).callCreateWithoutLoader();
  return response;
};

export const requestPasswordReset = async data => {
  let params = {url: API_ROOT + 'user/forgotpassword', body: data};
  let response = await new RequestService(params).callCreate();
  return response;
};

export const updateProfile = async data => {
  let params = {
    url: API_ROOT + 'user/edit_profile',
    body: data,
  };

  let response = await new RequestService(params).callCreate();
  return response;
};

export const updateUser = data => {
  return {
    type: UPDATE_USER,
    data: data,
  };
};

export const updateLanguage = data => {
  return {
    type: UPDATE_LANGUAGE,
    data: data,
  };
};

export const getCarsInformation = async data => {
  let params = {
    url: API_ROOT + 'preferences/get_cars_information',
    body: data,
  };
  let response = await new RequestService(params).callCreate();
  return response;
};

export const userVerification = async data => {
  // let params = { url: API_ROOT + "user/verification_phone", body: data };
  let params = {url: API_ROOT + 'user/activate', body: data};
  let response = await new RequestService(params).callCreate();
  return response;
};

export const loginUser = async data => {
  console.log(data);
  let params = {url: API_ROOT + 'user/login', body: data};
  console.log(JSON.stringify(params));
  let response = await new RequestService(params).callCreate();
  console.log(response);
  if (response.success) {
    store.dispatch({type: UPDATE_USER, data: response.user});
    store.dispatch({
      type: UPDATE_SELECTED_CAR,
      data: {
        year: response.year[0] || {id: '', name: ''},
        model: response.model[0] || {name: '', image: ''},
        car_type: response.car_type[0],
        car: response.car[0],
      },
    });
  }

  return response;
};

export const loginWithFbUser = async data => {
  let params = {url: API_ROOT + 'user/fb_login', body: data};
  let response = await new RequestService(params).callCreate();
  if (response.success) {
    store.dispatch({type: UPDATE_USER, data: response.user});
    store.dispatch({
      type: UPDATE_SELECTED_CAR,
      data: {
        year: response.year[0] || {id: '', name: ''},
        model: response.model[0] || {name: '', image: ''},
        car_type: response.car_type[0],
        car: response.car[0],
      },
    });
  }
  return response;
};

export const logOut = async data => {
  let params = {url: API_ROOT + 'user/logout', body: data};
  let response = await new RequestService(params).callCreate();
  return response;
};

export const forgotPassword = async data => {
  let params = {url: API_ROOT + 'user/forgotpassword', body: data};
  let response = await new RequestService(params).callCreate();
  return response;
};

export const changePassword = async data => {
  let params = {url: API_ROOT + 'user/changepassword', body: data};
  let response = await new RequestService(params).callCreate();
  return response;
};
