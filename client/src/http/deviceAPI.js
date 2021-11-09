import { $authHost, $host } from "./index";
// import jwt_decode from "jwt-decode";

export const createType = async ( type ) =>
{
    const { data } = await $authHost.post( 'api/type', type )
    return data
}

export const fetchTypes = async (brandId) =>//brandId
{
    const { data } = await $host.get( 'api/type',{
        params: {
            brandId
        }
    } )
    return data
}

export const createBrand = async ( brand ) =>
{
    const { data } = await $authHost.post( 'api/brand', brand )
    return data
}

export const fetchBrands = async (typeId) =>//typeId
{
    const { data } = await $host.get( 'api/brand',{
        params: {
            typeId
        }
    } )
    return data
}

export const createDevice = async ( device ) =>
{
    console.log( "TCL: createDevice -> device", device )

    try
    {
        const { data } = await $authHost.post( 'api/device', device )
        console.log( 'data', data )
        return data
    }
    catch ( error )
    {
        console.log( error )
    }

}

export const fetchDevices = async ( typeId, brandId, page, limit, sort ) =>
{
    const { data } = await $host.get( 'api/device', {
        params: {
            typeId, brandId, page, limit, sort
        }
    } )
    console.log( 'data', data )
    return data
}

export const fetchOneDevice = async ( id ) =>
{
    const { data } = await $host.get( 'api/device/' + id )
    return data
}

export const addtoBasket = async ( deviceId ) =>
{
    const { response } = await $authHost.post( 'api/basket', deviceId )
    return response
}

export const getBasket = async () =>
{
    const { data } = await $authHost.get( 'api/basket' )
    return data
}
export const deleteFromBasket = async ( id ) =>
{
    // try
    // {
    const { data } = await $authHost.delete( `api/basket/${id}` )
    console.log( 'data', data )
    return data
    // }
    // catch(error){
    //     console.log(error)
    // }
    
}