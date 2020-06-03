import { API_ROOT } from "../../config/constant";
import RequestService from "../../services/RequestService";
import { AsyncStorage } from "react-native";

export const workshopList = async (start, search , position, sortBy= "distance", sortType= "ASC") => {
  // debugger
  // let params = { url: API_ROOT + "workshop/workshops?start=" + start + "&search=" + search+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude};
  let params = { url: API_ROOT + "workshop/workshops?start=" + start + "&search=" + search+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&sort="+sortBy+"&sort_type="+sortType};
  debugger;
  let response = await new RequestService(params).callShow();
  return response;
};

export const bookingList = async (id) => {
  let params = { url: API_ROOT + "workshop/bookings?user_id=" + id};
  let response = await new RequestService(params).callShow();
  return response;
};

export const notificationList = async (id) => {
  let params = { url: API_ROOT + "User/get_notifications?id=" + id};
  let response = await new RequestService(params).callShow();
  return response;
};

export const getValue = async () => {
  return AsyncStorage.getItem("workshopId").then(value => {
    if (value != null) {
      return value;
    } else {
      // debugger
      // alert("not found 2");
    }
  });
};

export const getToken = async () => {
  return AsyncStorage.getItem("user").then(value => {
    if (value != null) {
      return JSON.parse(value).token;
    } else {
      // debugger
      // alert("not found 1");
    }
  });
}

export const workshopDetail = async () => {
  var workshopId = await getValue();
  let params = { url: API_ROOT + "workshop/workshop_detail?id=" + workshopId };
  let response = await new RequestService(params).callShow();
  return response;
};

export const workshopBooking = async (data) => {
  data.workshop_id = await getValue()
  data.token = await getToken()
  let params = { url: API_ROOT + "user/booking" , body: data};
  let response = await new RequestService(params).callCreate();
  return response;
}
