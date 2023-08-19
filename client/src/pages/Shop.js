import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Button } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import InfoBar from "../components/InfoBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import Pages from "../components/Pages";
import PagesSort from "../components/PagesSort";
import MultiRangeSlider from "../components/MultiRangeSlider";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import queryString from "query-string";
import {
  fetchBrands,
  fetchDevices,
  fetchInfos,
  fetchOneDevice,
  fetchTypes,
  minmaxDevices,
} from "../http/deviceAPI";

import { useHistory, useLocation } from "react-router-dom";

// import { set } from 'mobx';

const Shop = observer(() => {
  const [loading, set$loading] = useState(true);
  const [brandCountPerType, set$brandCountPerType] = useState({});
  const [productCountPerType, set$productCountPerType] = useState({});
  const [typeCountPerBrand, set$typeCountPerBrand] = useState({});
  const [productCountPerBrand, set$productCountPerBrand] = useState({});
  const [
    arrayOfDevicesCountPerTypePerBrand,
    set$arrayOfDevicesCountPerTypePerBrand,
  ] = useState([]);
  const [range, set$range] = useState([]);
  const [minValue, set$minValue] = useState("");
  const [maxValue, set$maxValue] = useState("");
  const [minMax, set$minMax] = useState({ min: null, max: null });
  const [infoArray, set$infoArray] = useState([]);
  const [infoArrayObjects, set$infoArrayObjects] = useState([]);

  const handleMinMax = (min, max) => {
    set$minMax({
      min: parseInt(min, 10),
      max: parseInt(max, 10),
    });
  };

  const { device } = useContext(Context);
  const history = useHistory();

  const location = useLocation();
  const path = location.search;

  const parsed = queryString.parse(path);

  let parsedTypes;
  parsed.types ? (parsedTypes = +parsed.types) : (parsedTypes = null);
  let parsedBrands;
  parsed.brands
    ? (parsedBrands = parsed.brands.split(",").map(Number))
    : (parsedBrands = null);
  let parsedSort;
  parsed.sort ? (parsedSort = parsed.sort) : (parsedSort = null);
  console.log("TCL: parsed.sort", parsed.sort);

  // перша загрузка
  useEffect(() => {
    fetchTypes().then((data) => {
      device.setTypes(data);
      device.setAlltypes(data);
      parsedTypes
        ? device.setSelectedType({ id: parsedTypes })
        : device.setSelectedType("");
    });
    fetchBrands().then((data) => {
      device.setBrands(data);
      device.setAllbrands(data);
      parsedBrands
        ? device.setSelectedBrands([...parsedBrands])
        : device.setSelectedBrands([]);
      device.setSort(parsedSort);
    });
    fetchDevices()
      .then((data) => {
        console.log("fetch all devices data: ", data);
        device.setAlldevices(data.rows);
      })
      .finally(() => set$loading(false));
  }, []);

  console.log("devices: ", device.devices[0]?.brandId);

  //пока аcинхронно грузятся отфильтрованые товары успевает второй useEffect отработать создать пустую строку

  // useEffect для фильтров
  useEffect(() => {
    fetchBrands(parsedTypes || device?.selectedType.id).then((data) => {
      device.setBrands(data);
    });
    minmaxDevices(
      parsedTypes || device?.selectedType.id,
      parsedBrands || device.selectedBrands
    ).then((data) => {
      console.log("data1", data);
      set$range(data);
    });

    const infosQuery = device?.selectedInfos.result;
 
    console.log("infosQuery: ", device);

    fetchDevices({
      typeId: device.selectedType.id,
      brandId: device.selectedBrands,
      infoId: infosQuery || [],
      page: device.page,
      limit: device.limit,
      min: minMax.min,
      max: minMax.max,
      sort: device.sort || null,
    })
      .then((data) => {
        device.setDevices(data.rows);
        device.setTotalCount(data.count);

        //пеоріввнювати minmax та  range та коректувати щоб за межі не виходило

        // Serialize the selectedBrands and selectedInfos array to a comma-separated string
        const brandsQueryString = device?.selectedBrands?.join(",");
        const infosQueryString = infosQuery?.join(",");
        // Construct the query parameters object based on the state values
        const queryParams = {
          types: device.selectedType?.id || null,
          brands: brandsQueryString || null,
          infos: infosQueryString || null,
          page: device.page || null,
          limit: device.limit || null,
          min: minMax.min || null,
          max: minMax.max || null,
          sort: device.sort || null,
        };

        const filterUndefined = (value) => value !== undefined;
        // Stringify the query parameters
        const query = queryString.stringify(queryParams, {
          skipNull: true,
          skipEmptyString: true,
          filter: filterUndefined,
        });

        history.push(`/shop/?${query}`);
      })
      .finally(() => set$loading(false));

    // }
  }, [
    device.selectedType,
    device.selectedBrands,
    device.selectedInfos,
    device.sort,
    device.page,
    device.limit,
    minMax,
  ]);

  useEffect(() => {
    console.log("device store ", device);

    if (!loading) {
      // Створимо пусті об'єкти для збереження кількості брендів у типі, товарів у типі, типів у бренді та товарів у бренді
      const brandCountPerType = {};
      const productCountPerType = {};
      const typeCountPerBrand = {};
      const productCountPerBrand = {};
      const devicesCountPerTypePerBrand = {};
      const arrayOfDevicesCountPerTypePerBrand = [];

      console.log("device: selectedBrands", device.selectedBrands);
      // Функція для знаходження унікальних значень в масиві
      function getUniqueValues(arr) {
        return arr?.reduce((uniqueValues, currentValue) => {
          // console.log("currentValue: ", currentValue);
          // console.log("uniqueValues: ", uniqueValues);
          if (!uniqueValues?.includes(currentValue)) {
            uniqueValues.push(currentValue);
          }
          return uniqueValues;
        }, []);
      }

      // Перебираємо бренди та товари для підрахунку кількості
      device.allbrands.forEach((brand) => {
        const brandId = brand.id;
        // const brandName = brand.name;

        // Знаходимо всі товари, що відповідають цьому бренду
        const productsOfBrand = device.alldevices.filter(
          (product) => product.brandId === brandId
        );
        // productCountPerBrand[brandName] = productsOfBrand.length;
        productCountPerBrand[brandId] = productsOfBrand.length;
        // Знаходимо всі унікальні типи товарів, що відповідають цьому бренду
        const uniqueTypesOfBrand = getUniqueValues(
          productsOfBrand.map((product) => product.typeId)
        );
        // typeCountPerBrand[brandName] = uniqueTypesOfBrand.length;
        typeCountPerBrand[brandId] = uniqueTypesOfBrand.length;
        console.log("uniqueTypesOfBrand: ", uniqueTypesOfBrand);
      });

      //беремо усі типи для щоб не зникали в аккордеоні
      // Перебираємо типи та товари для підрахунку кількості
      device.alltypes.forEach((type) => {
        const typeId = type.id;
        // const typeName = type.name;

        // Знаходимо всі товари, що відповідають цьому типу
        const productsOfType = device.alldevices.filter(
          (product) => product.typeId === typeId
        );
        // productCountPerType[typeName] = productsOfType.length;
        productCountPerType[typeId] = productsOfType.length;
        console.log("productCountPerType: ", productCountPerType);

        // Знаходимо всі унікальні бренди, що відповідають цьому типу
        const uniqueBrandsOfType = getUniqueValues(
          productsOfType.map((product) => product.brandId)
        );
        console.log("uniqueBrandsOfType: ", uniqueBrandsOfType);

        uniqueBrandsOfType?.forEach((brand) => {
          const devicesOfType = productsOfType.filter(
            (product) => product.brandId === brand
          ).length;
          arrayOfDevicesCountPerTypePerBrand.push(
            (devicesCountPerTypePerBrand[typeId] = {
              typeId,
              brand,
              devicesOfType,
            })
          );
        });
        console.log(
          "arrayOfdevicesCountPerTypePerBrand: ",
          arrayOfDevicesCountPerTypePerBrand
        );
        console.log(
          "devicesCountPerTypePerBrand: ",
          devicesCountPerTypePerBrand
        );
        // brandCountPerType[typeName] = uniqueBrandsOfType.length;
        brandCountPerType[typeId] = uniqueBrandsOfType;
      });

      // Виводимо результати
      set$brandCountPerType(brandCountPerType); //айді брендів замість кількості

      !device.selectedType > 0 && set$productCountPerType(productCountPerType);
      set$typeCountPerBrand(typeCountPerBrand);
      !device?.selectedBrands?.length > 0 &&
        set$productCountPerBrand(productCountPerBrand);

      set$arrayOfDevicesCountPerTypePerBrand(
        arrayOfDevicesCountPerTypePerBrand
      );

      // console.log("Кількість брендів у кожн типі:", brandCountPerType);
      // console.log("Кількість товарів у кожн типі:", productCountPerType);
      // console.log("Кількість типів у кожн бренді:", typeCountPerBrand);
      // console.log("Кількість товарів у кожн бренді:", productCountPerBrand);
    }
    // }
    // );
  }, [minMax, loading, device.selectedBrands, device.selectedType]);

  //если нет этого бренда в категории, а он был активен удалить из строки или сбросить из селектед
  //сделать чтобы отображались только категории которые в этом бренде?

  useEffect(() => {
    //запит на один товар з категорії за типом
    // fetchOneDevice("", device.selectedType.id).then((data) => {
    //   set$infoArray(data.info);
    //   console.log("device для інфо", data);

    if (device.selectedType?.id && device.alldevices.length) {
      const ids = device.alldevices
        ?.filter((item) => item?.typeId === device?.selectedType?.id)
        ?.map((obj) => obj.id)
        ?.join(","); // у строку для передачі

      //додати фільтрацію девайсів при зміні бренду чи мінмакс
      //щоб оновлювати каунт у фільтрах

      console.log("ids: ", ids);
      fetchInfos(ids).then((data) => {
        console.log("infoarrobj ", data);

        const result = []; // Результат буде масив об'єктів з ключами: title , масивами унікальних дескріпшенів,  кількістю повторень, масив deviceId

        data.rows.forEach((infoItem) => {
          const { title, description, deviceId } = infoItem;

          const existingTitleItem = result.find((item) => item.title === title);

          if (!existingTitleItem) {
            result.push({
              title,
              descriptions: [
                { description, count: 1, deviceIdArr: [deviceId] },
              ],
            });
          } else {
            const existingDescription = existingTitleItem?.descriptions?.find(
              (desc) => desc.description === description
            );

            if (!existingDescription) {
              existingTitleItem?.descriptions?.push({
                description,
                count: 1,
                deviceIdArr: [deviceId],
              });
            } else {
              existingDescription.count++;
              existingDescription?.deviceIdArr?.push(deviceId);
            }
          }
        });

        set$infoArrayObjects(result);
      });
    }
    // });
  }, [device.selectedType?.id, device.selectedBrands, minMax]);
  // console.log("infoArrayObjects: ", infoArrayObjects);

  if (loading) {
    return <Spinner animation={"border"} variant="secondary" />;
  }

  return (
    <Container fluid className="mt-5">
      <Row className="mt-5">
        <Col md={3}>
          <TypeBar
            seltype={parsed.type}
            productCountPerType={productCountPerType}
            brandCountPerType={brandCountPerType}
            arrayOfDevicesCountPerTypePerBrand={
              arrayOfDevicesCountPerTypePerBrand
            }
          />
          {/* <BrandBar productCountPerBrand={productCountPerBrand} /> */}
          {range?.length && (
            <>
              <MultiRangeSlider
                min={range[0] || 0}
                max={range[1] || 0}
                onChange={({ min, max }) => {
                  set$minValue(min);
                  set$maxValue(max);
                }}
              />
              <Button
                onClick={() => {
                  handleMinMax(minValue, maxValue);
                  device.setPage("1");
                }}
              >
                ok
              </Button>
            </>
          )}
          {infoArrayObjects?.length &&
            infoArrayObjects?.map((item) => (
              <InfoBar key={item.title} info={item} />
            ))}
        </Col>
        <Col md={9}>
          {/* <BrandBar productCountPerBrand={productCountPerBrand} /> */}
          <div className="d-flex justify-content-end">
            <Pages />
            <PagesSort />
          </div>
          <DeviceList />
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
