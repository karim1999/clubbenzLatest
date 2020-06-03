import { API_ROOT } from "./../../config/constant";
import { AsyncStorage } from "react-native";
import RequestService from "./../../services/RequestService";

export const getProviderDetails = async (id )=> {
    let params = { url: API_ROOT + "provider/get_provider_by_id?provider_id="+id };
    // debugger
    let response = await new RequestService(params).callShow();
    return response;
};
export const getProviderReviews = async (id )=> {
    let params = { url: API_ROOT + "provider/get_provider_reviews?provider_id="+id };
    // debugger
    let response = await new RequestService(params).callShow();
    return response;
};
