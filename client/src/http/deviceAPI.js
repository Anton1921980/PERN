import { $authHost, $host } from "./index";
// import jwt_decode from "jwt-decode";

export const createType = async (type) => {
  const { data } = await $authHost.post("api/type", type);
  return data;
};

export const fetchTypes = async (
  brandId 
) => {
  const { data } = await $host.get("api/type", {
    params: {
      brandId,
    },
  });
  return data;
};

export const createBrand = async (brand) => {
  const { data } = await $authHost.post("api/brand", brand);
  return data;
};

export const fetchBrands = async (
  typeId
) => {
  const { data } = await $host.get("api/brand", {
    params: {
      typeId,
    },
  });
  return data;
};

export const createDevice = async (device) => {
  try {
    const { data } = await $authHost.post("api/device", device);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchDevices = async (devices) => {
  const { data } = await $host.get("api/device", {
    params: devices,
  });
  return data;
};

export const fetchInfos = async (ids) => {
  const { data } = await $host.get("api/device/getinfos", {
    params: {
      ids: ids,
    },
  });
  return data;
};

export const fetchOneDevice = async (id, typeId) => {
  const { data } = await $host.get("api/device/info", {
    params: {
      id: id,
      typeId: typeId,
    },
  });
  return data;
};


export const editOneDevice = async (device, id) => {
  const { data } = await $authHost.put("api/device/edit/" + id, device);
  return data;
};

export const deleteOneDevice = async (id) => {
  const { data } = await $authHost.delete("api/device/delete/" + id);
  //does info also deletes
  return data;
};
export const minmaxDevices = async (typeId = null, brandId = null) => {
  const { data } = await $host.get("api/device/minmax", {
    params: {
      typeId: typeId,
      brandId: brandId,
    },
  });
  return data;
};
export const addtoBasket = async (deviceId) => {
  const { response } = await $authHost.post("api/basket", deviceId);
  return response;
};

export const getBasket = async () => {
  const { data } = await $authHost.get("api/basket");
  return data;
};
export const deleteFromBasket = async (id) => {
  try {
    const { data } = await $authHost.delete(`api/basket/${id}`);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const sendData = async (data) => {
  try {
    const response = await $authHost.post("api/device/send-data", { data }); 
    return response.data; 
  } catch (error) {
    console.error(error); 
  }
};

export const sendAllData = async (data) => {
  try {
    const response = await $authHost.post("api/device/send-all-data", { data }); 
    return response.data; 
  } catch (error) {
    console.error(error); 
  }
};
