import { API_ROOT } from "./../../config/constant";
import { AsyncStorage } from "react-native";
import RequestService from "./../../services/RequestService";

export const checkIsFavorite = async (user_id, part_id )=> {
    let params = {
        url: API_ROOT + "favorite/is_favorite",
        body: {user_id, part_id}
    };
    // debugger
    let response = await new RequestService(params).callCreate();
    return response;
};
export const addToFavorite = async (user_id, part_id )=> {
    let params = {
        url: API_ROOT + "favorite/add_favorite",
        body: {user_id, part_id}
    };
    // debugger
    let response = await new RequestService(params).callCreate();
    return response;
};
export const removeFromFavorite = async (user_id, part_id )=> {
    let params = {
        url: API_ROOT + "favorite/remove_favorite",
        body: {user_id, part_id}
    };
    // debugger
    let response = await new RequestService(params).callCreate();
    return response;
};
export const getFavorites = async (user_id)=> {
    let params = {
        url: API_ROOT + "favorite/get_favorites_by_user_id?user_id="+user_id,
    };
    // debugger
    let response = await new RequestService(params).callShow();
    return response;
};
