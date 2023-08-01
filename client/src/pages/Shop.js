import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Button } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
// import PriceFilter from "../components/PriceFilter";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";
import { useHistory, useLocation } from "react-router-dom";
import MultiRangeSlider from "../components/MultiRangeSlider";
// import { set } from 'mobx';

const Shop = observer(() => {
  const [loading, setLoading] = useState(true);

  const [brandCountPerType, set$brandCountPerType] = useState({});
  const [productCountPerType, set$productCountPerType] = useState({});
  const [typeCountPerBrand, set$typeCountPerBrand] = useState({});
  const [productCountPerBrand, set$productCountPerBrand] = useState({});
  const [
    arrayOfDevicesCountPerTypePerBrand,
    set$arrayOfDevicesCountPerTypePerBrand,
  ] = useState([]);

  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [minMax, set$minMax] = useState({ min: null, max: null });
  console.log("minMax: ", minMax);

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

  let type = "";
  let brand = "";
  let sort = "";
  let range = "";

  // console.log( "TCL: path", path )

  const queryString = require("query-string");
  const parsed = queryString.parse(path);
  console.log("TCL: parsed", parsed);

  let parsedTypes;
  parsed.types ? (parsedTypes = +parsed.types) : (parsedTypes = null);
  let parsedBrands;
  parsed.brands ? (parsedBrands = +parsed.brands) : (parsedBrands = null);
  let parsedSort;
  parsed.sort ? (parsedSort = parsed.sort) : (parsedSort = "");
  console.log("TCL: parsed.sort", parsed.sort);

  let shopUrl = undefined; //переход по урл /shop
  let linked = undefined; //переход по урл querystring

  path && path.length > 16 ? (linked = 1) : (linked = undefined);

  !path ? (shopUrl = 1) : (shopUrl = undefined);

  //отрабатывает один раз при переходе по url или на /shop
  useEffect(() => {
    if (linked === 1) {
      //загрузка по строке
      fetchTypes().then((data) => {
        console.log("fetch types data: ", data);
        device.setTypes(data);
        device.setSelectedType({ id: parsedTypes });
      });

      fetchBrands(parsedTypes).then((data) => {
        device.setBrands(data);
        device.setSelectedBrand({ id: parsedBrands });
        device.setSort(parsedSort);
      });

      fetchDevices(
        parsedTypes,
        parsedBrands,
        parsed.page,
        parsed.limit,
        parsed.min,
        parsed.max,
        parsedSort
      )
        .then((data) => {
          console.log("data: ", data);
          device.setDevices(data.rows);
          device.setTotalCount(data.count);

          // device.setSort( parsedSort )
        })
        .finally(() => setLoading(false));

      console.log("device по строке:", device);
    } else if (shopUrl === 1) {
      //загрузка первичная /shop все товары
      fetchTypes().then((data) => {
        console.log("fetch types data: ", data);
        device.setTypes(data);
      });

      fetchBrands().then((data) => device.setBrands(data));

      fetchDevices(
        null,
        null,
        device.page,
        device.limit,
        null,
        null,
        device.sort
      )
        .then((data) => {
          device.setDevices(data.rows);
          device.setTotalCount(data.count);
        })
        .finally(() => setLoading(false));
      console.log("device без фильтров:", device);
    }
  }, []);

  console.log("devices: ", device.devices[0]?.brandId);

  //пока аcинхронно грузятся отфильтрованые товары успевает второй useEffect отработать создать пустую строку

  // useEffect для фильтров

  useEffect(() => {
    fetchBrands(device.selectedType.id).then((data) => {
      console.log("fetch brands2 data: ", data);
      device.setBrands(data);
    });
    fetchDevices(
      device.selectedType.id,
      device.selectedBrand.id,
      device.page,
      device.limit,
      minMax.min,
      minMax.max,
      device.sort
    )
      .then((data) => {
        device.setDevices(data.rows);
        device.setTotalCount(data.count);

        device.selectedType.id
          ? (type = `types=${device.selectedType.id}`)
          : (type = "");

        device.selectedBrand.id
          ? (brand = `&brands=${device.selectedBrand.id}`)
          : (brand = "");

        minMax.min || minMax.max
          ? (range = `&min=${minMax.min || 0}&max=${minMax.max || 10000}`)
          : (range = "");

        device.sort ? (sort = `&sort=${device.sort}`) : (sort = "");

        let query = `${type}${brand}&page=${device.page}&limit=${device.limit}${range}${sort}`;

        console.log("TCL: query", query);

        history.push(`/shop/?${query}`);

        console.log("TCL: device с фильтрами", device);
      })
      .finally(() => setLoading(false));

    // }
  }, [
    device.selectedType,
    device.selectedBrand,
    device.sort,
    device.page,
    device.limit,
    minMax,
  ]);

  useEffect(() => {
    !device?.alldevices?.length &&
      fetchDevices().then((data) => {
        console.log("fetch devices3 data: ", data);
        device.setAlldevices(data.rows);
      });
    !device?.alltypes?.length &&
      fetchTypes().then((data) => {
        console.log("fetch types3 data: ", data);
        device.setAlltypes(data);
      });
    !device?.allbrands?.length &&
      fetchBrands().then((data) => {
        console.log("fetch brands3 data: ", data);
        device.setAllbrands(data);
      });
  }, []);

  useEffect(() => {
    console.log("device ALL BRANDS: ", device);

    fetchDevices(
      device.selectedType.id || "",
      device.selectedBrand.id || "",
      "",
      "",
      minMax.min || null,
      minMax.max || null,
      ""
    ).then((data) => {
      const allDevices = data.rows;

      if (!loading) {
        // Створимо пусті об'єкти для збереження кількості брендів у типі, товарів у типі, типів у бренді та товарів у бренді
        const brandCountPerType = {};
        const productCountPerType = {};
        const typeCountPerBrand = {};
        const productCountPerBrand = {};
        const devicesCountPerTypePerBrand = {};
        const arrayOfDevicesCountPerTypePerBrand = [];

        // Функція для знаходження унікальних значень в масиві
        function getUniqueValues(arr) {
          return arr.reduce((uniqueValues, currentValue) => {
            if (!uniqueValues.includes(currentValue)) {
              uniqueValues.push(currentValue);
            }
            return uniqueValues;
          }, []);
        }

        // Перебираємо бренди та товари для підрахунку кількості
        device.allbrands.forEach((brand) => {
          const brandId = brand.id;
          const brandName = brand.name;

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
          const typeName = type.name;

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

        !device.selectedType > 0 &&
          set$productCountPerType(productCountPerType);
        set$typeCountPerBrand(typeCountPerBrand);
        !device.selectedBrand.id > 0 &&
          set$productCountPerBrand(productCountPerBrand);

        set$arrayOfDevicesCountPerTypePerBrand(
          arrayOfDevicesCountPerTypePerBrand
        );

        console.log("Кількість брендів у кожн типі:", brandCountPerType);
        console.log("Кількість товарів у кожн типі:", productCountPerType);
        console.log("Кількість типів у кожн бренді:", typeCountPerBrand);
        console.log("Кількість товарів у кожн бренді:", productCountPerBrand);
      }
    });
  }, [minMax, loading, device.selectedBrand, device.selectedType]);

  //если нет этого бренда в категории, а он был активен удалить из строки или сбросить из селектед
  //сделать чтобы отображались только категории которые в этом бренде?

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

          {/* <PriceFilter
            minPrice={100}
            maxPrice={1000}
            onPriceChange={priceRange}
            setOnPriceChange={handlePriceChange}
          /> */}

          <BrandBar productCountPerBrand={productCountPerBrand} />

          <MultiRangeSlider
            min={0}
            max={100000}
            onChange={({ min, max }) => {
              console.log(`min = ${min}, max = ${max}`);
              setMinValue(min);
              setMaxValue(max);
            }}
          />
          <Button onClick={() => handleMinMax(minValue, maxValue)}>ok</Button>
        </Col>

        <Col md={9}>
          {/* <BrandBar productCountPerBrand={productCountPerBrand} /> */}

          <div className="d-flex justify-content-end">
            <Pages />
            <div className="d-flex align-items-center ml-5">
              <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={"DESC" === device.sort ? "dark" : "light"}
              >
                <div
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => {
                    if (device.sort !== "DESC") {
                      //   setChosen(true);
                      device.setPage("1");
                      device.setSort("DESC");
                    }
                  }}
                >
                  {["+ ", <span>&#8372;</span>]}
                </div>
              </Card>
              <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={"ASC" === device.sort ? "dark" : "light"}
              >
                <div
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => {
                    if (device.sort !== "ASC") {
                      //   setChosen(true);
                      device.setPage("1");
                      device.setSort("ASC");
                    }
                  }}
                >
                  {["- ", <span>&#8372;</span>]}
                </div>
              </Card>
            </div>
            <div className="d-flex m-3 align-items-center ">
              <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={3 === device.limit ? "dark" : "light"}
              >
                <div
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => {
                    if (3 !== device.limit) {
                      device.setPage(1);
                      device.setLimit(3);
                    }
                  }}
                >
                  <span>3</span>
                </div>
              </Card>
              <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={6 === device.limit ? "dark" : "light"}
              >
                <div
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => {
                    if (6 !== device.limit) {
                      device.setPage(1);
                      device.setLimit(6);
                    }
                  }}
                >
                  <span>6</span>
                </div>
              </Card>
              <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={9 === device.limit ? "dark" : "light"}
              >
                <div
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => {
                    if (9 !== device.limit) {
                      device.setPage(1);
                      device.setLimit(9);
                    }
                  }}
                >
                  <span>9</span>
                </div>
              </Card>
            </div>
          </div>
          <DeviceList />
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
