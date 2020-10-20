import { API_ROOT } from "./../../config/constant";
import { AsyncStorage } from "react-native";
import RequestService from "./../../services/RequestService";

export const partList = async () => {
  let params = { url: API_ROOT + "parts/parts" };
  let response = await new RequestService(params).callShow();
  return response;
};

export const getValue = async () => {
  return AsyncStorage.getItem("partId").then(value => {
    if (value != null) {
      return value;
    } else {
      // debugger
      // alert("not found");
    }
  });
};

export const partDetail = async (id) => {
  if(id){
    var partId = id;
  }else{
    var partId = await getValue();
  }

  let params = { url: API_ROOT + "Parts/part_detail?id=" + partId };
  let response = await new RequestService(params).callShow();
  return response;
};
export const partCategories = async data => {
  let params = { url: API_ROOT + "parts/get_partcategory", body: data };
  let response = await new RequestService(params).callCreate();
  return response;
};

export const partSubCategories = async data => {
  let params = { url: API_ROOT + "parts/get_partsubcategory", body: data };
  let response = await new RequestService(params).callCreate();
  return response;
};

export const partSubCategoryItem = async (data, phone="") => {
  data.phone= encodeURIComponent(phone)
  let params = { url: API_ROOT + "parts/get_partsubcategory", body: data };
  let response = await new RequestService(params).callCreate();
  return response;
};

export const partCategoriesList = async (sub_category,search, type ,brand_id,start  , chassis, phone="") => {
  // debugger
  //let params = { url: API_ROOT + "Parts/parts?sub_category="+sub_category+"&search="+search+"&type="+type+"&brand_id="+brand_id+"&start="+start };
  let params = { url: API_ROOT + "Parts/parts?sub_category="+sub_category+"&search="+search+"&type="+type+"&brand_id="+brand_id+"&start="+start+"&chassis="+chassis+"&phone="+encodeURIComponent(phone) };
  console.log(params)
  // alert(JSON.stringify(params))
  let response = await new RequestService(params).callShow();
  return response;
};

export const partCategoriesListData = async (search,chassis_id) => {

  let params = { url: API_ROOT + "Parts/parts?search="+search+"&chassis="+chassis_id };

  let response = await new RequestService(params).callShow();
  return response;
};

export const partDetail1 = async (id )=> {
  let params = { url: API_ROOT + "Parts/part_detail?id="+id };
  // debugger
  let response = await new RequestService(params).callShow();
  return response;
};
