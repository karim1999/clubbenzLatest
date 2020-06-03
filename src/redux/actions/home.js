import { API_ROOT } from "./../../config/constant";
import RequestService from "./../../services/RequestService";
import { store } from "./../create";
import { GET_SERVICES } from "../actions/types";
import { GET_PARTS } from "../actions/types";

export const getServices = async () => {
  let params = { url: API_ROOT + "preferences/services", body: { test: "" } };
  let response = await new RequestService(params).callCreate();
  store.dispatch({ type: GET_SERVICES, data: response });
  return response;
};

export const homeService = async () => {
  let params = {
    url: API_ROOT + "preferences/get_home_page_seveices" 
  };
  let response = await new RequestService(params).callShow();
  return response;
};

export const HomeSearchList = async (start, search , position) => {
  let params = { url: API_ROOT + "preferences/search_result?start=&search=" + search+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude };
  // debugger
  let response = await new RequestService(params).callShow();
  return response;
};