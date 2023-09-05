import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Button,
  useAccordionButton,
} from "react-bootstrap";
import TypeBar from "../components/TypeBar";
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
import InfoFilter from "../components/InfoFilter";
import { ChevronRight } from "react-bootstrap-icons";

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
  const [isOpenMap, set$isOpenMap] = useState({ aaa: true, ccc: true });
  const [infoArrayObjects, set$infoArrayObjects] = useState([]);
  const [sortedInfoArrayObjects, set$sortedInfoArrayObjects] = useState([]);

  const CustomToggle = React.memo(({ eventKey, isOpen, onToggle, expand }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      console.log("totally custom!", isOpen);
    });
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginLeft: "15px",
            cursor: "pointer",
            transform: `rotate(${
              expand !== false
                ? isOpen
                  ? "270deg"
                  : "90deg"
                : isOpen
                ? "270deg"
                : "90deg"           
            })`,
            transition: "transform 2s ease",
          }}
          onClick={() => {
            onToggle && onToggle(eventKey);
            expand !== false && decoratedOnClick();
          }}
        >
          <ChevronRight />
        </div>
      </div>
    );
  });
  const CustomToggle2 = React.memo(
    ({ eventKey, isOpen, onToggle, expand, marginRight }) => {
      const decoratedOnClick = (eventKey, () => console.log(eventKey));
      return (
        <div
          style={{
            cursor: "pointer",
            transform: `rotate(${isOpen ? "180deg" : "0deg"})`,
            transition: "transform 0.9s ease",
            marginRight: marginRight,
          }}
          onClick={() => {
            onToggle && onToggle(eventKey);
            expand !== false && decoratedOnClick();
          }}
        >
          <ChevronRight />
        </div>
      );
    }
  );
  // Function to toggle the isOpen state for a specific category
  const toggleCategory = (id) => {
    set$isOpenMap((prevIsOpenMap) => ({
      ...prevIsOpenMap,
      [id]: !prevIsOpenMap[id],
    }));
  };
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

  //first load
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
        device.setAlldevices(data.rows);
      })
      .finally(() => set$loading(false));
  }, []);

  // filters
  useEffect(() => {
    fetchBrands(parsedTypes || device?.selectedType.id).then((data) => {
      device.setBrands(data);
    });
    minmaxDevices(
      parsedTypes || device?.selectedType.id,
      parsedBrands || device.selectedBrands
    ).then((data) => {
      set$range(data);
    });

    const infosQuery = device?.selectedInfos.result;

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
    if (!loading) {  
      //creating objects to save quantity brands in type,devices in type, types in brand, products in brand
      const brandCountPerType = {};
      const productCountPerType = {};
      const typeCountPerBrand = {};
      const productCountPerBrand = {};
      const devicesCountPerTypePerBrand = {};
      const arrayOfDevicesCountPerTypePerBrand = [];
      //  unique values in arr 
      function getUniqueValues(arr) {
        return arr?.reduce((uniqueValues, currentValue) => {
          if (!uniqueValues?.includes(currentValue)) {
            uniqueValues.push(currentValue);
          }
          return uniqueValues;
        }, []);//empty array for start
      }

     
      device.allbrands.forEach((brand) => {
        const brandId = brand.id;
        // const brandName = brand.name;

        //find all devices wwith this brand
        const productsOfBrand = device.alldevices.filter(
          (product) => product.brandId === brandId
        );
        // productCountPerBrand[brandName] = productsOfBrand.length;
        productCountPerBrand[brandId] = productsOfBrand.length;      
        // find all unique types for this brand
        const uniqueTypesOfBrand = getUniqueValues(
          productsOfBrand.map((product) => product.typeId)
        );        
        typeCountPerBrand[brandId] = uniqueTypesOfBrand.length;
      });
      
      //take all types not to disappear from accordion    
      device.alltypes.forEach((type) => {
        const typeId = type.id;
        // const typeName = type.name;


        //find all devices for this type
        const productsOfType = device.alldevices.filter(
          (product) => product.typeId === typeId
        );      
        productCountPerType[typeId] = productsOfType.length;
   
        //find all unique brands for this type
        const uniqueBrandsOfType = getUniqueValues(
          productsOfType.map((product) => product.brandId)
        );

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
       
        brandCountPerType[typeId] = uniqueBrandsOfType;
      });
     
      set$brandCountPerType(brandCountPerType); //brand id insteadofquantity?

      // !device.selectedType.id > 0 &&
      set$productCountPerType(productCountPerType);
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

  
  useEffect(() => {
    if (device.selectedType?.id && device.alldevices.length) {      
      //only for firs tload of filters
      let ids =
        !device.selectedInfos?.result ||
        device.selectedInfos?.result?.length === 0
          ? device.alldevices
              ?.filter(
                (item) =>
                  item?.typeId === device?.selectedType?.id &&
                  (device?.selectedBrands?.length === 0 ||
                    device?.selectedBrands.includes(item?.brandId))
              )
              ?.map((obj) => obj.id)
              ?.join(",")
          : device.selectedInfos.result?.join(","); // pass to querystring      

      fetchInfos(ids).then((data) => {
        const result = []; //result is array of objects with keys: title , unique descriptions arrays,  repeats quantity, array of deviceId
       
       
        if (infoArrayObjects?.length > 0 && device.selectedTypeId?.id) {
          // Фfilter data.rows for device.selectedTypeId.id
          const filteredData = data.rows?.filter(
            (infoItem) => infoItem.deviceId === device.selectedTypeId.id
          );          
          filteredData.forEach((infoItem) => {
            const { title, description, deviceId } = infoItem;

            const existingTitleItem = result?.find(
              (item) => item.title === title
            );

            if (!existingTitleItem) {
              result?.push({
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
        } else {
          // if infoArrayObjects ===[] або device.selectedTypeId.id === null return previous code
          data.rows?.forEach((infoItem) => {
            const { title, description, deviceId } = infoItem;

            const existingTitleItem = result?.find(
              (item) => item.title === title
            );

            if (!existingTitleItem) {
              result?.push({
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
        }
      });
    }
  }, [
    device.selectedType?.id,
    device.selectedBrands,
    minMax,
    device.selectedInfos,
    loading,
  ]);

  useEffect(() => {
    // Функція порівняння для сортування
    const compare = (a, b) => {
      if (a.title > b.title) {
        return -1;
      }
      if (a.title < b.title) {
        return 1;
      }
      return 0;
    };
    // Сортування масиву
    const sortedArray = [...infoArrayObjects].sort(compare);
    // Оновлення стану новим відсортованим масивом
    set$sortedInfoArrayObjects(sortedArray);
  }, [infoArrayObjects]);

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
            toggleCategory={toggleCategory}
            CustomToggle={CustomToggle}
            isOpenMap={isOpenMap}
          />
          {device.selectedType?.id && (
            <InfoFilter
              sortedInfoArrayObjects={sortedInfoArrayObjects}
              toggleCategory={toggleCategory}
              CustomToggle={CustomToggle}
              CustomToggle2={CustomToggle2}
              isOpenMap={isOpenMap}
            />
          )}
        </Col>
        <Col md={9}>
          <div className="d-flex justify-content-around align-items-center">
            {range?.length && (
              <div className="d-flex justify-content-around align-items-center">
                <MultiRangeSlider
                  min={range[0] || 0}
                  max={range[1] || 0}
                  onChange={({ min, max }) => {
                    set$minValue(min);
                    set$maxValue(max);
                  }}
                />
                <div
                  style={{ cursor: "pointer", margin: "10px", padding: "5px" }}
                  onClick={() => {
                    handleMinMax(minValue, maxValue);
                    device.setPage("1");
                  }}
                >
                  <ChevronRight />
                </div>
              </div>
            )}
            <PagesSort />
            <Pages />
          </div>
          <DeviceList />
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
