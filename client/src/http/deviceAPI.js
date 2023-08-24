import { $authHost, $host } from "./index";
// import jwt_decode from "jwt-decode";

export const createType = async (type) => {
  const { data } = await $authHost.post("api/type", type);
  return data;
};

export const fetchTypes = async (
  brandId //brandId
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
  typeId //typeId
) => {
  const { data } = await $host.get("api/brand", {
    params: {
      typeId,
    },
  });
  return data;
};

export const createDevice = async (device) => {
  console.log("TCL: createDevice -> device", device);

  try {
    const { data } = await $authHost.post("api/device", device);
    console.log("data", data);
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

// додати айдішнік інфо шо видаляється якшо є
export const editOneDevice = async (device, id) => {
  const { data } = await $authHost.put("api/device/edit/" + id, device);
  return data;
};

export const deleteOneDevice = async (id) => {
  const { data } = await $authHost.delete("api/device/delete/" + id);
  //чи видаляється також інфо?
  return data;
};
export const minmaxDevices = async (typeId = null, brandId = null) => {
  console.log("brandId: ", brandId);
  console.log("typeId: ", typeId);

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
    console.log("id", id);
    const { data } = await $authHost.delete(`api/basket/${id}`);
    console.log("data", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const sendData = async (data) => {
  try {
    const response = await $authHost.post(
      "api/device/send-data", {data}
   
    ); // виконати POST запит за допомогою axios
    return response.data; // отримати дані з відповіді
  } catch (error) {
    console.error(error); // обробити помилки
  }
};

export const sendAllData = async (data) => {
  try {

    const response = await $authHost.post(
      "api/device/send-all-data", {data}
    
    ); // виконати POST запит за допомогою axios
    return response.data; // отримати дані з відповіді
  } catch (error) {
    console.error(error); // обробити помилки
  }
};
