import { API_ROOT } from "../../config/constant";
import { AsyncStorage } from "react-native";
import RequestService from "../../services/RequestService";



export const get_Cluster_error = async data => {
  let params = { url: API_ROOT + "carguide/cluster_error", body: data };
  // debugger
  let response = await new RequestService(params).callCreate();
  // debugger
  return response;
};

export const get_Carguide = async data => {
  let params = { url: API_ROOT + "carguide/car_guide", body: data };
  // debugger
  let response = await new RequestService(params).callCreateWithoutLoader();
  return response;
};

export const get_Cluster_error_solution = async data => {
  // debugger
  let params = { url: API_ROOT + "carguide/cluster_error_solution", body: data };
  // debugger
  let response = await new RequestService(params).callCreate();
  return response;
};

export const error_solution_like = async data => {
  let params = { url: API_ROOT + "carguide/error_solution_like", body: data };
  let response = await new RequestService(params).callCreate();
  return response;
};




