import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const addToBasket = async (device) => {
    const {data} = await $authHost.post('api/device', device)
    console.log(data)
    return data
}

export const fetchDevices = async (typeId, brandId, page, limit) => {
    const {data} = await $host.get('api/device', {params: {
            typeId, brandId, page, limit
        }})
    return data
}