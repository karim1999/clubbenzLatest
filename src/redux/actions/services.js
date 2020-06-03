import { API_ROOT } from "./../../config/constant";
import RequestService from "./../../services/RequestService";
import { AsyncStorage } from "react-native";

export const serviceList = async () => {
  let params = { url: API_ROOT + "preferences/services", body: { test: "" } };
  let response = await new RequestService(params).callCreate();
  return response;
};

export const getValue = async () => {
  return AsyncStorage.getItem("serviceId").then(value => {
    if (value != null) {
      return value;
    } else {
      // debugger
      // alert("not found");
    }
  });
};

export const serviceShop = async (startIndex,search , position, sortBy= "distance", sortType= "ASC") => {
  // debugger
  var serviceId = await getValue();
  let params = {
    // url: API_ROOT + "servicesshop/serviceshops?service_id=" + serviceId + '&start=' + startIndex + '&search=' + search+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude
    url: API_ROOT + "servicesshop/serviceshops?service_id=" + serviceId+ '&start=' + startIndex + '&search=' + search+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&sort="+sortBy+"&sort_type="+sortType
  };
  // debugger;
  let response = await new RequestService(params).callShow();
  return response;
};

export const getServiceShopValue = async () => {
  return AsyncStorage.getItem("serviceShopId").then(value => {
    if (value != null) {
      return value;
    } else {
      // debugger
      // alert("not found");
    }
  });
};

export const serviceShopDetail = async () => {
  var serviceShopId = await getServiceShopValue();
  let params = {
    url: API_ROOT + "servicesshop/serviceshop_detail?id=" + serviceShopId
  };
  let response = await new RequestService(params).callShow();
  return response;
};
