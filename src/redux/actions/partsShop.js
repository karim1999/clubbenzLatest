import { API_ROOT } from "./../../config/constant";
import { AsyncStorage } from "react-native";
import RequestService from "./../../services/RequestService";

export const partShopList = async (start, search , position, sortBy= "distance", sortType= "ASC") => {
  console.log('entered the part shop list')
  // let params = { url: API_ROOT + "Partsshop/shops?start=" + start + "&search=" + search+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude};
  let params = { url: API_ROOT + "Partsshop/shops?start=" + start + "&search=" + search+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&sort="+sortBy+"&sort_type="+sortType};
  debugger
  let response = await new RequestService(params).callShow();
  return response;
};

export const getValue = async () => {
  return AsyncStorage.getItem("partShopId").then(value => {
    if (value != null) {
      return value;
    } else {
      // debugger
      // alert("not found");
    }
  });
};

export const partShopDetail = async () => {
  var partShopId = await getValue();
  let params = { url: API_ROOT + "partsshop/shop_detail?id=" + partShopId };
  debugger
  let response = await new RequestService(params).callShow();
  return response;
};
