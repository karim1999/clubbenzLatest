import { API_ROOT } from "./../../config/constant";
import { AsyncStorage } from "react-native";
import RequestService from "./../../services/RequestService";

export const subscribe = async (user_id, membership, address )=> {
    let params = {
        url: API_ROOT + "memberships/subscribe",
        body: {user_id, membership, address}
    };
    // debugger
    let response = await new RequestService(params).callCreate();
    return response;
};
export const getMemberships = async (user_id)=> {
    let params = {
        url: API_ROOT + "memberships/get_memberships?user_id="+user_id,
    };
    // debugger
    let response = await new RequestService(params).callShow();
    return response;
};
