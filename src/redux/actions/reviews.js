import {API_ROOT} from "../../config/constant";
import RequestService from "../../services/RequestService";
import {getValue as workshopId , getToken} from "./workshops";
import {getValue as partshopId} from "./partsShop";
// import {getValue as sericeshopId} from "./services";
import {getServiceShopValue as sericeshopId} from "./services";


export const submitReview = async (payload) => {
    // alert(JSON.stringify(payload))
    const type = payload.shop_type;
    payload.token = await getToken()
    if (type === 'workshop'){
        payload.shop_id = await workshopId()
    } else if (type === 'partsshop') {
        payload.shop_id = await partshopId()
    } else if (type === 'serviceshop') {
        payload.shop_id = await sericeshopId()
    } else if (type === 'provider') {
        payload.shop_id = payload.providerId
    } else {
        console.warn('Invalid Shop Type for review submission', payload.shop_type)
        return null
    }
    // alert(payload.shop_id)
    let params = {url: API_ROOT + "preferences/submit_review", body: payload};
    let response = await new RequestService(params).callCreate();
  // alert(JSON.stringify(payload))
    return response;
}
